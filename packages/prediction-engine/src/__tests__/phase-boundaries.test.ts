import { describe, expect, it } from 'vitest';
import { calculatePhaseBoundaries, getPhaseForDay } from '../phase-boundaries';
import type { CycleStats } from '../types';

function statsWith(averageCycleLength: number | null, averagePeriodLength: number | null): CycleStats {
  return {
    averageCycleLength,
    averagePeriodLength,
    cycleLengthSamples: [],
    confidence: 'medium',
    isIrregular: false,
  };
}

function assertValidPartition(boundaries: ReturnType<typeof calculatePhaseBoundaries>) {
  expect(boundaries.menstrualStart).toBe(1);
  expect(boundaries.lutealEnd).toBe(boundaries.cycleLength);
  expect(boundaries.follicularStart).toBe(boundaries.menstrualEnd + 1);
  expect(boundaries.ovulatoryStart).toBe(boundaries.follicularEnd + 1);
  expect(boundaries.lutealStart).toBe(boundaries.ovulatoryEnd + 1);
  expect(boundaries.lutealEnd - boundaries.lutealStart + 1).toBeLessThanOrEqual(14);
}

describe('calculatePhaseBoundaries', () => {
  it('falls back to a 28-day/5-day default when nothing is known', () => {
    const boundaries = calculatePhaseBoundaries(statsWith(null, null));
    expect(boundaries.cycleLength).toBe(28);
    expect(boundaries.menstrualEnd).toBe(5);
    assertValidPartition(boundaries);
  });

  it('exactly partitions a 21-day cycle with no gaps or overlaps', () => {
    const boundaries = calculatePhaseBoundaries(statsWith(21, 4));
    assertValidPartition(boundaries);
  });

  it('exactly partitions a 35-day cycle with no gaps or overlaps', () => {
    const boundaries = calculatePhaseBoundaries(statsWith(35, 6));
    assertValidPartition(boundaries);
  });

  it('exactly partitions the minimum plausible 10-day cycle', () => {
    const boundaries = calculatePhaseBoundaries(statsWith(10, 5));
    assertValidPartition(boundaries);
  });

  it('always partitions across a wide range of cycle and period lengths', () => {
    for (let cycleLength = 10; cycleLength <= 60; cycleLength += 3) {
      for (let periodLength = 1; periodLength <= 10; periodLength += 2) {
        const boundaries = calculatePhaseBoundaries(statsWith(cycleLength, periodLength));
        assertValidPartition(boundaries);
      }
    }
  });
});

describe('getPhaseForDay', () => {
  const boundaries = calculatePhaseBoundaries(statsWith(28, 5));

  it('classifies every day of the cycle into exactly one phase', () => {
    for (let day = 1; day <= boundaries.cycleLength; day++) {
      expect(['menstrual', 'follicular', 'ovulatory', 'luteal']).toContain(
        getPhaseForDay(day, boundaries),
      );
    }
  });

  it('clamps an out-of-range day into the cycle instead of throwing', () => {
    expect(getPhaseForDay(0, boundaries)).toBe('menstrual');
    expect(getPhaseForDay(999, boundaries)).toBe('luteal');
  });
});
