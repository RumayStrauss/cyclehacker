import type { CyclePhase, PhaseBoundaries } from '@cyclehacker/prediction-engine';
import { getPhaseForDay } from '@cyclehacker/prediction-engine';
import { addDays, diffDays, toISODate } from './date-utils';

export interface CalendarDayClassification {
  phase: CyclePhase | null;
  isPeriodLogged: boolean;
  isPredictedPeriod: boolean;
  isPredictedOvulation: boolean;
}

const BLANK: CalendarDayClassification = {
  phase: null,
  isPeriodLogged: false,
  isPredictedPeriod: false,
  isPredictedOvulation: false,
};

function bracketingStart(date: Date, periodStartsAsc: Date[]): Date | null {
  let result: Date | null = null;
  for (const start of periodStartsAsc) {
    if (start <= date) result = start;
    else break;
  }
  return result;
}

/**
 * Classifies one calendar date against the prediction engine's cycle
 * boundaries: for dates within or before the last real logged period this
 * walks the real period-start history; for dates beyond it, this projects
 * forward in fixed `boundaries.cycleLength` steps, same assumption
 * `getCycleDayInfo` makes for "today."
 */
export function classifyCalendarDate(
  date: Date,
  periodStartsAsc: Date[],
  boundaries: PhaseBoundaries,
  loggedPeriodDates: ReadonlySet<string>,
): CalendarDayClassification {
  if (periodStartsAsc.length === 0) return BLANK;

  const first = periodStartsAsc[0]!;
  if (date < first) return BLANK;

  const lastReal = periodStartsAsc[periodStartsAsc.length - 1]!;

  let effectiveStart: Date;
  if (date <= lastReal) {
    effectiveStart = bracketingStart(date, periodStartsAsc) ?? first;
  } else {
    effectiveStart = lastReal;
    while (diffDays(date, effectiveStart) >= boundaries.cycleLength) {
      effectiveStart = addDays(effectiveStart, boundaries.cycleLength);
    }
  }

  const cycleDay = diffDays(date, effectiveStart) + 1;
  const phase = getPhaseForDay(cycleDay, boundaries);
  const isPeriodLogged = loggedPeriodDates.has(toISODate(date));
  const isPredictedPeriod = !isPeriodLogged && cycleDay <= boundaries.menstrualEnd;
  const isPredictedOvulation = cycleDay >= boundaries.ovulatoryStart && cycleDay <= boundaries.ovulatoryEnd;

  return { phase, isPeriodLogged, isPredictedPeriod, isPredictedOvulation };
}
