import type { Confidence, CycleStats, PeriodEntry } from './types';
import { derivePeriodEpisodes, derivePeriodStarts } from './period-starts';
import { diffDays, parseISODate } from './date-utils';

const ROLLING_WINDOW = 6;
const PLAUSIBLE_MIN_CYCLE_LENGTH = 10;
const PLAUSIBLE_MAX_CYCLE_LENGTH = 90;
const IRREGULARITY_STDEV_THRESHOLD_DAYS = 7;

export function calculateCycleLengths(periodStarts: string[]): number[] {
  const lengths: number[] = [];
  for (let i = 1; i < periodStarts.length; i++) {
    lengths.push(diffDays(parseISODate(periodStarts[i]!), parseISODate(periodStarts[i - 1]!)));
  }
  return lengths;
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance = mean(values.map((value) => (value - avg) ** 2));
  return Math.sqrt(variance);
}

function confidenceFromSampleCount(periodStartCount: number): Confidence {
  if (periodStartCount === 0) return 'none';
  if (periodStartCount <= 2) return 'low';
  if (periodStartCount <= 4) return 'medium';
  return 'high';
}

/**
 * Rolling-average cycle stats. Cycle-length values feeding the average are
 * clamped to a physiologically plausible band so one mislogged outlier
 * doesn't distort the estimate, while irregularity is judged from the raw,
 * unclamped variance so a genuinely erratic cycle is still flagged as such.
 */
export function calculateCycleStats(entries: PeriodEntry[]): CycleStats {
  const periodStarts = derivePeriodStarts(entries);
  const allLengths = calculateCycleLengths(periodStarts);
  const windowedLengths = allLengths.slice(-ROLLING_WINDOW);

  const clampedLengths = windowedLengths.map((length) =>
    Math.min(PLAUSIBLE_MAX_CYCLE_LENGTH, Math.max(PLAUSIBLE_MIN_CYCLE_LENGTH, length)),
  );
  const averageCycleLength = clampedLengths.length > 0 ? mean(clampedLengths) : null;

  const episodes = derivePeriodEpisodes(entries);
  const episodeLengths = episodes
    .slice(-ROLLING_WINDOW)
    .map((episode) => diffDays(parseISODate(episode.end), parseISODate(episode.start)) + 1);
  const averagePeriodLength = episodeLengths.length > 0 ? mean(episodeLengths) : null;

  const isIrregular =
    allLengths.length >= 3 && stdev(allLengths.slice(-ROLLING_WINDOW)) > IRREGULARITY_STDEV_THRESHOLD_DAYS;

  return {
    averageCycleLength,
    averagePeriodLength,
    cycleLengthSamples: windowedLengths,
    confidence: confidenceFromSampleCount(periodStarts.length),
    isIrregular,
  };
}
