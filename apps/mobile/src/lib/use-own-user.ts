import { getOwnUser } from '@cyclehacker/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth-context';
import { supabase } from './supabase';

export function useOwnUser() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['own-user', userId],
    queryFn: () => getOwnUser(supabase, userId!),
    enabled: Boolean(userId),
  });
}
