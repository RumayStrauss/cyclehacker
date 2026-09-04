import type { CycleHackerClient } from '../client';

export interface CreateOwnCycleProfileParams {
  userId: string;
  name: string;
  initialCycleLengthEstimate?: number;
  initialPeriodLengthEstimate?: number;
  typicalSymptoms?: string[];
  goals?: string[];
}

export async function createOwnCycleProfile(client: CycleHackerClient, params: CreateOwnCycleProfileParams) {
  const { data, error } = await client
    .from('cycle_profiles')
    .insert({
      name: params.name,
      owner_user_id: params.userId,
      created_by_user_id: params.userId,
      is_proxy: false,
      initial_cycle_length_estimate: params.initialCycleLengthEstimate,
      initial_period_length_estimate: params.initialPeriodLengthEstimate,
      typical_symptoms: params.typicalSymptoms,
      goals: params.goals,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOwnCycleProfile(client: CycleHackerClient, userId: string) {
  const { data, error } = await client
    .from('cycle_profiles')
    .select('*')
    .eq('owner_user_id', userId)
    .eq('is_proxy', false)
    .maybeSingle();
  if (error) throw error;
  return data;
}
