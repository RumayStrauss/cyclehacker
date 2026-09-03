import { getOwnCycleProfile } from '@cyclehacker/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth-context';
import { supabase } from './supabase';

export function useOwnProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['own-profile', userId],
    queryFn: () => getOwnCycleProfile(supabase, userId!),
    enabled: Boolean(userId),
  });
}
