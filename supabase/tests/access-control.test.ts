import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Run `supabase start` then `supabase status -o env` to populate these, or
// export them yourself when pointing at a different local instance.
const API_URL = process.env.API_URL ?? 'http://127.0.0.1:54321';
const ANON_KEY = process.env.ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;

if (!ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error(
    'ANON_KEY and SERVICE_ROLE_KEY env vars are required. Run `supabase start` then ' +
      '`supabase status -o env` and export the values before running this test.',
  );
}

async function signUpTestUser(): Promise<{ client: SupabaseClient; userId: string }> {
  const client = createClient(API_URL, ANON_KEY!);
  const email = `test-${randomUUID()}@example.com`;
  const password = randomUUID();
  const { data, error } = await client.auth.signUp({ email, password });
  if (error || !data.user) {
    throw new Error(`sign up failed: ${error?.message}`);
  }
  return { client, userId: data.user.id };
}

/**
 * Proves that a partner's read query is structurally incapable of returning
 * raw symptom/journal rows, per CLAUDE.md's "supportive tracking, not
 * surveillance" principle, at the query layer rather than the UI layer.
 * Exercised through the same @supabase/supabase-js client the app itself
 * uses, so this reflects a real app query, not just a policy definition.
 */
describe('partner data access control', () => {
  const adminClient = createClient(API_URL, SERVICE_ROLE_KEY!);

  let ownerId: string;
  let ownerClient: SupabaseClient;
  let partnerId: string;
  let partnerClient: SupabaseClient;
  let profileId: string;

  beforeAll(async () => {
    const owner = await signUpTestUser();
    ownerClient = owner.client;
    ownerId = owner.userId;

    const partner = await signUpTestUser();
    partnerClient = partner.client;
    partnerId = partner.userId;

    const { data: profile, error: profileError } = await ownerClient
      .from('cycle_profiles')
      .insert({
        name: 'Access control test',
        owner_user_id: ownerId,
        created_by_user_id: ownerId,
        is_proxy: false,
      })
      .select()
      .single();
    if (profileError || !profile) {
      throw new Error(`profile insert failed: ${profileError?.message}`);
    }
    profileId = profile.id as string;

    const { error: entryError } = await ownerClient
      .from('cycle_entries')
      .insert({ profile_id: profileId, date: '2026-01-01', flow_level: 'medium', source: 'self' });
    if (entryError) throw new Error(`cycle_entries insert failed: ${entryError.message}`);

    const { error: symptomError } = await ownerClient.from('symptom_logs').insert({
      profile_id: profileId,
      date: '2026-01-01',
      symptom_type: 'cramps',
      value: true,
      source: 'self',
    });
    if (symptomError) throw new Error(`symptom_logs insert failed: ${symptomError.message}`);

    const { error: moodError } = await ownerClient
      .from('mood_logs')
      .insert({ profile_id: profileId, date: '2026-01-01', value: 3, source: 'self' });
    if (moodError) throw new Error(`mood_logs insert failed: ${moodError.message}`);
  });

  afterAll(async () => {
    if (ownerId) await adminClient.auth.admin.deleteUser(ownerId);
    if (partnerId) await adminClient.auth.admin.deleteUser(partnerId);
  });

  it('lets the owner read their own raw logs', async () => {
    const { data, error } = await ownerClient
      .from('cycle_entries')
      .select('*')
      .eq('profile_id', profileId);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it('blocks an unrelated user from reading raw logs', async () => {
    const [entries, symptoms, moods] = await Promise.all([
      partnerClient.from('cycle_entries').select('*').eq('profile_id', profileId),
      partnerClient.from('symptom_logs').select('*').eq('profile_id', profileId),
      partnerClient.from('mood_logs').select('*').eq('profile_id', profileId),
    ]);
    expect(entries.data).toEqual([]);
    expect(symptoms.data).toEqual([]);
    expect(moods.data).toEqual([]);
  });

  it('still blocks raw log reads once an active partner link exists between owner and partner', async () => {
    const { data: link, error: linkError } = await ownerClient
      .from('partner_links')
      .insert({
        profile_id: profileId,
        partner_user_id: partnerId,
        status: 'active',
        invited_by: ownerId,
      })
      .select()
      .single();
    expect(linkError).toBeNull();
    expect(link).not.toBeNull();

    const [entries, symptoms, moods] = await Promise.all([
      partnerClient.from('cycle_entries').select('*').eq('profile_id', profileId),
      partnerClient.from('symptom_logs').select('*').eq('profile_id', profileId),
      partnerClient.from('mood_logs').select('*').eq('profile_id', profileId),
    ]);
    expect(entries.data).toEqual([]);
    expect(symptoms.data).toEqual([]);
    expect(moods.data).toEqual([]);

    // The partner can see that a link exists (needed later to show
    // pending/active status in a partner UI); they still cannot see any raw
    // data through it, which is the point of this test.
    const { data: visibleLink } = await partnerClient
      .from('partner_links')
      .select('*')
      .eq('profile_id', profileId);
    expect(visibleLink).toHaveLength(1);
  });

  it('blocks an unrelated user from creating a cycle profile they do not own', async () => {
    const { error } = await partnerClient.from('cycle_profiles').insert({
      name: 'Should fail',
      owner_user_id: ownerId,
      created_by_user_id: partnerId,
      is_proxy: false,
    });
    expect(error).not.toBeNull();
  });
});

describe('account deletion cascade', () => {
  const adminClient = createClient(API_URL, SERVICE_ROLE_KEY!);

  it('removes the profile and its logs when the owner deletes their account', async () => {
    const { client, userId } = await signUpTestUser();

    const { data: profile, error: profileError } = await client
      .from('cycle_profiles')
      .insert({
        name: 'Deletion test',
        owner_user_id: userId,
        created_by_user_id: userId,
        is_proxy: false,
      })
      .select()
      .single();
    if (profileError || !profile) {
      throw new Error(`profile insert failed: ${profileError?.message}`);
    }
    const profileId = profile.id as string;

    const { error: entryError } = await client
      .from('cycle_entries')
      .insert({ profile_id: profileId, date: '2026-01-01', flow_level: 'medium', source: 'self' });
    if (entryError) throw new Error(`cycle_entries insert failed: ${entryError.message}`);

    const { error: rpcError } = await client.rpc('delete_own_account');
    expect(rpcError).toBeNull();

    const { data: remainingProfiles } = await adminClient
      .from('cycle_profiles')
      .select('*')
      .eq('id', profileId);
    expect(remainingProfiles).toEqual([]);

    const { data: remainingEntries } = await adminClient
      .from('cycle_entries')
      .select('*')
      .eq('profile_id', profileId);
    expect(remainingEntries).toEqual([]);
  });
});
