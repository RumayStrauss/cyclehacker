import { describe, expect, it } from 'vitest';
import { derivePeriodEpisodes, derivePeriodStarts } from '../period-starts';
import {
  LOGGING_GAP_MID_PERIOD,
  LOGGING_GAP_TOO_LARGE,
  NO_DATA,
  OUT_OF_ORDER_DUPLICATE_ENTRIES,
  REGULAR_28_DAY_CYCLES,
} from './fixtures';

describe('derivePeriodStarts', () => {
  it('returns an empty array for no data', () => {
    expect(derivePeriodStarts(NO_DATA)).toEqual([]);
  });

  it('sorts and dedupes out-of-order, duplicate entries', () => {
    expect(derivePeriodStarts(OUT_OF_ORDER_DUPLICATE_ENTRIES)).toEqual(['2026-01-01']);
  });

  it('tolerates a single missed logging day mid-period', () => {
    expect(derivePeriodStarts(LOGGING_GAP_MID_PERIOD)).toEqual(['2026-01-01']);
  });

  it('fractures into two episodes when the gap exceeds tolerance', () => {
    expect(derivePeriodStarts(LOGGING_GAP_TOO_LARGE)).toEqual(['2026-01-01', '2026-01-05']);
  });

  it('finds one start per logged period', () => {
    expect(derivePeriodStarts(REGULAR_28_DAY_CYCLES)).toEqual([
      '2026-01-01',
      '2026-01-29',
      '2026-02-26',
      '2026-03-26',
    ]);
  });
});

describe('derivePeriodEpisodes', () => {
  it('spans the full logged range of a gap-tolerant episode', () => {
    expect(derivePeriodEpisodes(LOGGING_GAP_MID_PERIOD)).toEqual([
      { start: '2026-01-01', end: '2026-01-05' },
    ]);
  });
});
