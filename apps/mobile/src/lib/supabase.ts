import { createCycleHackerClient, type CycleHackerClient } from '@cyclehacker/supabase-client';
import * as SecureStore from 'expo-secure-store';

const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set. Copy .env.example to .env.',
  );
}

export const supabase: CycleHackerClient = createCycleHackerClient({
  url,
  anonKey,
  storage: secureStoreAdapter,
});
