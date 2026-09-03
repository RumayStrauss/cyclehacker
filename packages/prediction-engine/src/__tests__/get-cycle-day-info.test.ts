import { describe, expect, it } from 'vitest';
import { getCycleDayInfo } from '../cycle-day-info';
import { NO_DATA, REGULAR_28_DAY_CYCLES, SINGLE_CYCLE, TWO_CYCLES } from './fixtures';

describe('getCycleDayInfo', () => {
  it('returns null with no logged periods', () => {
    expect(getCycleDayInfo(new Date('2026-01-15T00:00:00Z'), NO_DATA)).toBeNull();
  });

  it('computes cycle day relative to the single logged start, at low confidence', () => {
    const info = getCycleDayInfo(new Date('2026-01-10T00:00:00Z'), SINGLE_CYCLE);
    expect(info).not.toBeNull();
    expect(info!.cycleDay).toBe(10);
    expect(info!.confidence).toBe('low');
    expect(info!.phase).toBe('follicular');
  });

  it('stays at low confidence with exactly one cycle-length sample', () => {
    const info = getCycleDayInfo(new Date('2026-02-01T00:00:00Z'), TWO_CYCLES);
    expect(info!.confidence).toBe('low');
  });

  it('reports the menstrual phase on day 1 of a regular cycle', () => {
    const info = getCycleDayInfo(new Date('2026-03-26T00:00:00Z'), REGULAR_28_DAY_CYCLES);
    expect(info!.cycleDay).toBe(1);
    expect(info!.phase).toBe('menstrual');
    expect(info!.confidence).toBe('medium');
  });

  it('reports days until next period counting down through the cycle', () => {
    const info = getCycleDayInfo(new Date('2026-03-27T00:00:00Z'), REGULAR_28_DAY_CYCLES);
    expect(info!.cycleDay).toBe(2);
    expect(info!.daysUntilNextPeriod).toBe(27);
  });

  it('keeps counting cycle day forward without throwing when a period is overdue', () => {
    const info = getCycleDayInfo(new Date('2026-05-15T00:00:00Z'), REGULAR_28_DAY_CYCLES);
    expect(info).not.toBeNull();
    expect(info!.cycleDay).toBeGreaterThan(info!.boundaries.cycleLength);
    expect(info!.phase).toBe('luteal');
    expect(info!.daysUntilNextPeriod).toBeLessThan(0);
  });

  it('never returns a negative or zero cycle day even if "today" precedes the last logged start', () => {
    const info = getCycleDayInfo(new Date('2026-01-01T00:00:00Z'), REGULAR_28_DAY_CYCLES);
    expect(info!.cycleDay).toBeGreaterThanOrEqual(1);
  });
});
