import { createClient as createSupabaseJsClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types.gen';

export type CycleHackerClient = SupabaseClient<Database>;

export interface AuthStorageAdapter {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
}

export interface CreateClientOptions {
  url: string;
  anonKey: string;
  /**
   * Injected by the app (e.g. an expo-secure-store adapter) so this package
   * has no React Native dependency of its own.
   */
  storage?: AuthStorageAdapter;
}

export function createCycleHackerClient(options: CreateClientOptions): CycleHackerClient {
  return createSupabaseJsClient<Database>(options.url, options.anonKey, {
    auth: {
      storage: options.storage,
      autoRefreshToken: true,
      persistSession: Boolean(options.storage),
      detectSessionInUrl: false,
    },
  });
}
