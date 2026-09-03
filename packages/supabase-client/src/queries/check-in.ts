import type { CycleHackerClient } from '../client';
import type { FlowLevel, SymptomType } from '../types.gen';

export interface DailyCheckInInput {
  profileId: string;
  /** 'YYYY-MM-DD' */
  date: string;
  flowLevel?: FlowLevel;
  mood?: number;
  symptoms?: SymptomType[];
}

/**
 * Every field is independently optional, matching the check-in screen where
 * everything is skippable. Saves whichever fields were actually touched;
 * upserts on the tables' unique constraints so re-opening today's check-in
 * and changing one field doesn't duplicate rows.
 */
export async function saveDailyCheckIn(
  client: CycleHackerClient,
  input: DailyCheckInInput,
): Promise<void> {
  const tasks: PromiseLike<{ error: { message: string } | null }>[] = [];

  if (input.flowLevel) {
    tasks.push(
      client
        .from('cycle_entries')
        .upsert(
          { profile_id: input.profileId, date: input.date, flow_level: input.flowLevel, source: 'self' },
          { onConflict: 'profile_id,date' },
        )
        .then(({ error }) => ({ error })),
    );
  }

  if (input.mood !== undefined) {
    tasks.push(
      client
        .from('mood_logs')
        .upsert(
          { profile_id: input.profileId, date: input.date, value: input.mood, source: 'self' },
          { onConflict: 'profile_id,date' },
        )
        .then(({ error }) => ({ error })),
    );
  }

  for (const symptomType of input.symptoms ?? []) {
    tasks.push(
      client
        .from('symptom_logs')
        .upsert(
          {
            profile_id: input.profileId,
            date: input.date,
            symptom_type: symptomType,
            value: true,
            source: 'self',
          },
          { onConflict: 'profile_id,date,symptom_type' },
        )
        .then(({ error }) => ({ error })),
    );
  }

  const results = await Promise.all(tasks);
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) throw firstError;
}
