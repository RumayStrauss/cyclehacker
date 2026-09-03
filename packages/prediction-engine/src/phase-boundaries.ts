import type { CyclePhase, CycleStats, PhaseBoundaries } from './types';

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;
const MAX_LUTEAL_LENGTH = 14;
const MAX_OVULATORY_LENGTH = 3;

/**
 * Proportional phase-boundary model, not a fixed 28/14 split. Luteal length
 * is treated as near-fixed regardless of total cycle length (the standard
 * physiological assumption), which is what makes this correct for short and
 * long cycles rather than just the textbook 28-day one. Boundaries always
 * exactly partition 1..cycleLength, with no gaps or overlaps.
 */
export function calculatePhaseBoundaries(stats: CycleStats): PhaseBoundaries {
  const cycleLength = Math.round(stats.averageCycleLength ?? DEFAULT_CYCLE_LENGTH);
  const rawPeriodLength = Math.round(stats.averagePeriodLength ?? DEFAULT_PERIOD_LENGTH);

  // Leave room for at least a 1-day ovulatory window and 1-day luteal phase.
  const periodLength = Math.min(Math.max(rawPeriodLength, 1), Math.max(1, cycleLength - 6));
  const lutealLength = Math.max(1, Math.min(MAX_LUTEAL_LENGTH, cycleLength - periodLength - 1));

  const remainingBeforeLuteal = Math.max(0, cycleLength - periodLength - lutealLength);
  const ovulatoryLength = Math.min(MAX_OVULATORY_LENGTH, remainingBeforeLuteal);
  const follicularLength = remainingBeforeLuteal - ovulatoryLength;

  const menstrualStart = 1;
  const menstrualEnd = periodLength;
  const follicularStart = menstrualEnd + 1;
  const follicularEnd = follicularStart + follicularLength - 1;
  const ovulatoryStart = follicularEnd + 1;
  const ovulatoryEnd = ovulatoryStart + ovulatoryLength - 1;
  const lutealStart = ovulatoryEnd + 1;
  const lutealEnd = lutealStart + lutealLength - 1;

  return {
    cycleLength,
    menstrualStart,
    menstrualEnd,
    follicularStart,
    follicularEnd,
    ovulatoryStart,
    ovulatoryEnd,
    lutealStart,
    lutealEnd,
  };
}

export function getPhaseForDay(cycleDay: number, boundaries: PhaseBoundaries): CyclePhase {
  const day = Math.min(Math.max(cycleDay, 1), boundaries.cycleLength);
  if (day <= boundaries.menstrualEnd) return 'menstrual';
  if (day <= boundaries.follicularEnd) return 'follicular';
  if (day <= boundaries.ovulatoryEnd) return 'ovulatory';
  return 'luteal';
}
