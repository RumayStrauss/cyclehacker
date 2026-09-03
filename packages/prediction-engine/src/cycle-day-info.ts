import type { CycleDayInfo, PeriodEntry } from './types';
import { calculateCycleStats } from './cycle-stats';
import { calculatePhaseBoundaries, getPhaseForDay } from './phase-boundaries';
import { derivePeriodStarts } from './period-starts';
import { diffDays, parseISODate } from './date-utils';

/**
 * Top-level combinator for "what's happening today." `today` is always an
 * injected parameter, never read from the system clock internally, so this
 * stays trivially testable. Returns null when nothing has been logged yet,
 * so the UI can show a "log your first period" state instead of a fabricated
 * cycle day.
 */
export function getCycleDayInfo(today: Date, entries: PeriodEntry[]): CycleDayInfo | null {
  const periodStarts = derivePeriodStarts(entries);
  if (periodStarts.length === 0) return null;

  const stats = calculateCycleStats(entries);
  const boundaries = calculatePhaseBoundaries(stats);

  const lastStart = periodStarts[periodStarts.length - 1]!;
  const daysSinceLastStart = Math.max(0, diffDays(today, parseISODate(lastStart)));
  const cycleDay = daysSinceLastStart + 1;
  const phase = getPhaseForDay(cycleDay, boundaries);
  const daysUntilNextPeriod = boundaries.cycleLength - daysSinceLastStart;

  return {
    cycleDay,
    phase,
    confidence: stats.confidence,
    daysUntilNextPeriod,
    boundaries,
  };
}
