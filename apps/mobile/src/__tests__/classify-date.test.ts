import { calculateCycleStats, calculatePhaseBoundaries, derivePeriodStarts } from '@cyclehacker/prediction-engine';
import { classifyCalendarDate } from '@/features/calendar/classify-date';
import { parseISODate } from '@/features/calendar/date-utils';

const ENTRIES = [
  { date: '2026-06-01', flowLevel: 'medium' as const },
  { date: '2026-06-29', flowLevel: 'medium' as const },
];

function classify(iso: string) {
  const periodStartsAsc = derivePeriodStarts(ENTRIES).map(parseISODate);
  const boundaries = calculatePhaseBoundaries(calculateCycleStats(ENTRIES));
  const loggedDates = new Set(ENTRIES.map((e) => e.date));
  return classifyCalendarDate(parseISODate(iso), periodStartsAsc, boundaries, loggedDates);
}

describe('classifyCalendarDate', () => {
  it('returns a blank classification before any logged period', () => {
    expect(classify('2026-05-01')).toEqual({
      phase: null,
      isPeriodLogged: false,
      isPredictedPeriod: false,
      isPredictedOvulation: false,
    });
  });

  it('flags a logged period day as logged, not predicted', () => {
    const result = classify('2026-06-01');
    expect(result.isPeriodLogged).toBe(true);
    expect(result.isPredictedPeriod).toBe(false);
    expect(result.phase).toBe('menstrual');
  });

  it('projects a predicted period window beyond the last real cycle', () => {
    const boundaries = calculatePhaseBoundaries(calculateCycleStats(ENTRIES));
    const projectedStart = parseISODate('2026-06-29');
    projectedStart.setUTCDate(projectedStart.getUTCDate() + boundaries.cycleLength);
    const iso = projectedStart.toISOString().slice(0, 10);

    const result = classify(iso);
    expect(result.isPredictedPeriod).toBe(true);
    expect(result.isPeriodLogged).toBe(false);
    expect(result.phase).toBe('menstrual');
  });

  it('flags an ovulatory-window day without marking it as a period', () => {
    // cycleDay 13 of the June 1 cycle (period=1 day, ovulatory window days 12-14).
    const result = classify('2026-06-13');
    expect(result.phase).toBe('ovulatory');
    expect(result.isPredictedOvulation).toBe(true);
    expect(result.isPredictedPeriod).toBe(false);
  });
});
