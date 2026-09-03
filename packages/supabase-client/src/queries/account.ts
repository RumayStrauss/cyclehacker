import type { CycleHackerClient } from '../client';

/**
 * Calls the delete_own_account() Postgres function (see the init migration),
 * which deletes the auth.users row for the current session and relies on
 * cascading foreign keys to remove every profile, log, and partner link tied
 * to this account.
 */
export async function deleteOwnAccount(client: CycleHackerClient): Promise<void> {
  const { error } = await client.rpc('delete_own_account');
  if (error) throw error;
}
