import { getCycleDayInfo, type CyclePhase } from '@cyclehacker/prediction-engine';
import { listPeriodEntries } from '@cyclehacker/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';

const PHASE_DOT_COLORS: Record<CyclePhase, string> = {
  menstrual: '#B5495B',
  follicular: '#D9A5AF',
  ovulatory: '#C97D8F',
  luteal: '#E8C3C9',
};

const WINDOW_DAYS_BEFORE = 45;
const WINDOW_DAYS_AFTER = 75;

export interface CalendarMark {
  marked: true;
  dotColor: string;
}

export function useCalendarData(profileId: string | undefined) {
  const entriesQuery = useQuery({
    queryKey: ['period-entries', profileId],
    queryFn: () => listPeriodEntries(supabase, profileId!),
    enabled: Boolean(profileId),
  });

  const markedDates = useMemo(() => {
    const entries = entriesQuery.data ?? [];
    if (entries.length === 0) return {};

    const loggedDates = new Set(entries.map((entry) => entry.date));
    const marks: Record<string, CalendarMark> = {};

    const start = new Date();
    start.setUTCDate(start.getUTCDate() - WINDOW_DAYS_BEFORE);

    for (let i = 0; i < WINDOW_DAYS_BEFORE + WINDOW_DAYS_AFTER; i++) {
      const date = new Date(start);
      date.setUTCDate(date.getUTCDate() + i);
      const dateStr = date.toISOString().slice(0, 10);
      const info = getCycleDayInfo(date, entries);
      if (!info) continue;

      marks[dateStr] = {
        marked: true,
        dotColor: loggedDates.has(dateStr) ? PHASE_DOT_COLORS.menstrual : PHASE_DOT_COLORS[info.phase],
      };
    }

    return marks;
  }, [entriesQuery.data]);

  return { markedDates, isLoading: entriesQuery.isLoading };
}
