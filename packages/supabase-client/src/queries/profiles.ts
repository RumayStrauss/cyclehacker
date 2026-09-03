import type { CycleHackerClient } from '../client';

export async function createOwnCycleProfile(
  client: CycleHackerClient,
  params: { userId: string; name: string },
) {
  const { data, error } = await client
    .from('cycle_profiles')
    .insert({
      name: params.name,
      owner_user_id: params.userId,
      created_by_user_id: params.userId,
      is_proxy: false,
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
