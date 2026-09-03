import { saveDailyCheckIn, type DailyCheckInInput } from '@cyclehacker/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSaveCheckIn(profileId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<DailyCheckInInput, 'profileId'>) => {
      if (!profileId) throw new Error('No active cycle profile');
      await saveDailyCheckIn(supabase, { ...input, profileId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle-day-info', profileId] });
    },
  });
}
