import { describe, expect, it } from 'vitest';
import { calculateCycleLengths, calculateCycleStats } from '../cycle-stats';
import { derivePeriodStarts } from '../period-starts';
import {
  IMPLAUSIBLE_OUTLIER_CYCLES,
  IRREGULAR_CYCLES,
  NO_DATA,
  REGULAR_28_DAY_CYCLES,
  SINGLE_CYCLE,
  TWO_CYCLES,
} from './fixtures';

describe('calculateCycleLengths', () => {
  it('diffs successive period starts', () => {
    const starts = derivePeriodStarts(REGULAR_28_DAY_CYCLES);
    expect(calculateCycleLengths(starts)).toEqual([28, 28, 28]);
  });
});

describe('calculateCycleStats', () => {
  it('reports no data as none/null, not fabricated', () => {
    const stats = calculateCycleStats(NO_DATA);
    expect(stats.averageCycleLength).toBeNull();
    expect(stats.averagePeriodLength).toBeNull();
    expect(stats.confidence).toBe('none');
    expect(stats.isIrregular).toBe(false);
  });

  it('gives low confidence with a single logged cycle and no length sample yet', () => {
    const stats = calculateCycleStats(SINGLE_CYCLE);
    expect(stats.averageCycleLength).toBeNull();
    expect(stats.averagePeriodLength).toBe(5);
    expect(stats.confidence).toBe('low');
    expect(stats.isIrregular).toBe(false);
  });

  it('gives low confidence with exactly one cycle-length sample', () => {
    const stats = calculateCycleStats(TWO_CYCLES);
    expect(stats.averageCycleLength).toBe(28);
    expect(stats.confidence).toBe('low');
    expect(stats.isIrregular).toBe(false);
  });

  it('computes a regular cycle as not irregular, medium confidence at 4 starts', () => {
    const stats = calculateCycleStats(REGULAR_28_DAY_CYCLES);
    expect(stats.averageCycleLength).toBe(28);
    expect(stats.averagePeriodLength).toBe(5);
    expect(stats.confidence).toBe('medium');
    expect(stats.isIrregular).toBe(false);
  });

  it('flags a genuinely erratic cycle history as irregular', () => {
    const stats = calculateCycleStats(IRREGULAR_CYCLES);
    expect(stats.isIrregular).toBe(true);
  });

  it('clamps an implausible outlier before averaging, but still flags irregularity', () => {
    const rawLengths = calculateCycleLengths(derivePeriodStarts(IMPLAUSIBLE_OUTLIER_CYCLES));
    expect(rawLengths).toEqual([28, 7, 28]);

    const stats = calculateCycleStats(IMPLAUSIBLE_OUTLIER_CYCLES);
    // Raw mean would be 21; the 7-day outlier is clamped to 10 before averaging.
    expect(stats.averageCycleLength).toBe(22);
    expect(stats.isIrregular).toBe(true);
  });

  it('never returns NaN or throws on any fixture', () => {
    for (const entries of [
      NO_DATA,
      SINGLE_CYCLE,
      TWO_CYCLES,
      REGULAR_28_DAY_CYCLES,
      IRREGULAR_CYCLES,
      IMPLAUSIBLE_OUTLIER_CYCLES,
    ]) {
      const stats = calculateCycleStats(entries);
      if (stats.averageCycleLength !== null) {
        expect(Number.isFinite(stats.averageCycleLength)).toBe(true);
      }
      if (stats.averagePeriodLength !== null) {
        expect(Number.isFinite(stats.averagePeriodLength)).toBe(true);
      }
    }
  });
});
