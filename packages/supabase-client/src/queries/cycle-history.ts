import type { PeriodEntry } from '@cyclehacker/prediction-engine';
import type { CycleHackerClient } from '../client';

/** Feeds `@cyclehacker/prediction-engine`'s getCycleDayInfo/calculateCycleStats. */
export async function listPeriodEntries(
  client: CycleHackerClient,
  profileId: string,
): Promise<PeriodEntry[]> {
  const { data, error } = await client
    .from('cycle_entries')
    .select('date, flow_level')
    .eq('profile_id', profileId)
    .neq('flow_level', 'none')
    .order('date', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    date: row.date,
    flowLevel: row.flow_level as PeriodEntry['flowLevel'],
  }));
}

export async function listSymptomsForDate(client: CycleHackerClient, profileId: string, date: string) {
  const { data, error } = await client
    .from('symptom_logs')
    .select('symptom_type')
    .eq('profile_id', profileId)
    .eq('date', date);
  if (error) throw error;
  return (data ?? []).map((row) => row.symptom_type);
}
