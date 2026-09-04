import { calculateCycleStats, calculatePhaseBoundaries, derivePeriodStarts } from '@cyclehacker/prediction-engine';
import { listPeriodEntries } from '@cyclehacker/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { classifyCalendarDate, type CalendarDayClassification } from './classify-date';
import { addDays, parseISODate, startOfWeek, toISODate } from './date-utils';

const WEEKS_BEFORE_TODAY = 26;
const WEEKS_AFTER_TODAY = 20;

export interface CalendarWeek {
  key: string;
  days: Date[];
}

export function useCalendarFeedData(profileId: string | undefined) {
  const entriesQuery = useQuery({
    queryKey: ['period-entries', profileId],
    queryFn: () => listPeriodEntries(supabase, profileId!),
    enabled: Boolean(profileId),
  });

  const weeks = useMemo<CalendarWeek[]>(() => {
    const firstWeekStart = addDays(startOfWeek(new Date()), -7 * WEEKS_BEFORE_TODAY);
    const result: CalendarWeek[] = [];
    for (let i = 0; i < WEEKS_BEFORE_TODAY + WEEKS_AFTER_TODAY; i++) {
      const weekStart = addDays(firstWeekStart, i * 7);
      const days = Array.from({ length: 7 }, (_, d) => addDays(weekStart, d));
      result.push({ key: toISODate(weekStart), days });
    }
    return result;
  }, []);

  const classify = useMemo(() => {
    const entries = entriesQuery.data ?? [];
    const periodStartsAsc = derivePeriodStarts(entries).map(parseISODate);
    const stats = calculateCycleStats(entries);
    const boundaries = calculatePhaseBoundaries(stats);
    const loggedDates = new Set(entries.map((e) => e.date));

    return (date: Date): CalendarDayClassification =>
      classifyCalendarDate(date, periodStartsAsc, boundaries, loggedDates);
  }, [entriesQuery.data]);

  return { weeks, classify, isLoading: entriesQuery.isLoading };
}
