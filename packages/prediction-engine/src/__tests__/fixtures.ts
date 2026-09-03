import type { FlowLevel, PeriodEntry } from '../types';

export function makePeriodEntries(
  periods: { start: string; length: number }[],
  flowLevel: FlowLevel = 'medium',
): PeriodEntry[] {
  const entries: PeriodEntry[] = [];
  for (const { start, length } of periods) {
    const startDate = new Date(`${start}T00:00:00Z`);
    for (let i = 0; i < length; i++) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + i);
      entries.push({ date: d.toISOString().slice(0, 10), flowLevel });
    }
  }
  return entries;
}

// Four periods, each exactly 28 days apart, 5 days long.
export const REGULAR_28_DAY_CYCLES = makePeriodEntries([
  { start: '2026-01-01', length: 5 },
  { start: '2026-01-29', length: 5 },
  { start: '2026-02-26', length: 5 },
  { start: '2026-03-26', length: 5 },
]);

// Cycle lengths of 24, 44, 26 days: genuinely erratic, no mislogged outlier.
export const IRREGULAR_CYCLES = makePeriodEntries([
  { start: '2026-01-01', length: 4 },
  { start: '2026-01-25', length: 4 },
  { start: '2026-03-10', length: 4 },
  { start: '2026-04-05', length: 4 },
]);

// One mislogged/implausible short cycle (7 days) between two normal 28-day ones.
export const IMPLAUSIBLE_OUTLIER_CYCLES = makePeriodEntries([
  { start: '2026-01-01', length: 5 },
  { start: '2026-01-29', length: 5 },
  { start: '2026-02-05', length: 5 },
  { start: '2026-03-05', length: 5 },
]);

export const SINGLE_CYCLE = makePeriodEntries([{ start: '2026-01-01', length: 5 }]);

export const TWO_CYCLES = makePeriodEntries([
  { start: '2026-01-01', length: 5 },
  { start: '2026-01-29', length: 5 },
]);

export const NO_DATA: PeriodEntry[] = [];

// A single missed logging day (day 3) mid-period should not fracture the episode.
export const LOGGING_GAP_MID_PERIOD: PeriodEntry[] = [
  { date: '2026-01-01', flowLevel: 'medium' },
  { date: '2026-01-02', flowLevel: 'medium' },
  { date: '2026-01-04', flowLevel: 'light' },
  { date: '2026-01-05', flowLevel: 'spotting' },
];

// A 3-day gap exceeds the default tolerance and should fracture into two episodes.
export const LOGGING_GAP_TOO_LARGE: PeriodEntry[] = [
  { date: '2026-01-01', flowLevel: 'medium' },
  { date: '2026-01-02', flowLevel: 'medium' },
  { date: '2026-01-05', flowLevel: 'light' },
];

export const OUT_OF_ORDER_DUPLICATE_ENTRIES: PeriodEntry[] = [
  { date: '2026-01-02', flowLevel: 'medium' },
  { date: '2026-01-01', flowLevel: 'heavy' },
  { date: '2026-01-01', flowLevel: 'heavy' },
];
