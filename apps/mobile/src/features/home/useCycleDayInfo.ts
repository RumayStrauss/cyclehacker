import { getCycleDayInfo } from '@cyclehacker/prediction-engine';
import { listPeriodEntries } from '@cyclehacker/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCycleDayInfo(profileId: string | undefined) {
  return useQuery({
    queryKey: ['cycle-day-info', profileId],
    queryFn: async () => {
      const entries = await listPeriodEntries(supabase, profileId!);
      return getCycleDayInfo(new Date(), entries);
    },
    enabled: Boolean(profileId),
  });
}
