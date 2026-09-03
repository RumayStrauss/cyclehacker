import type { PeriodEntry } from './types';
import { diffDays, parseISODate } from './date-utils';

const DEFAULT_GAP_TOLERANCE_DAYS = 1;

/**
 * Groups logged dates into period episodes, tolerating a small logging gap
 * (a missed day mid-period) so it doesn't fracture one real period into two.
 * Returns the start date of each episode, sorted ascending.
 */
export function derivePeriodStarts(
  entries: PeriodEntry[],
  gapToleranceDays: number = DEFAULT_GAP_TOLERANCE_DAYS,
): string[] {
  return derivePeriodEpisodes(entries, gapToleranceDays).map((episode) => episode.start);
}

export interface PeriodEpisode {
  start: string;
  end: string;
}

export function derivePeriodEpisodes(
  entries: PeriodEntry[],
  gapToleranceDays: number = DEFAULT_GAP_TOLERANCE_DAYS,
): PeriodEpisode[] {
  const uniqueDates = Array.from(new Set(entries.map((entry) => entry.date))).sort();
  if (uniqueDates.length === 0) return [];

  const episodes: PeriodEpisode[] = [];
  let episodeStart = uniqueDates[0]!;
  let episodeEnd = uniqueDates[0]!;

  for (let i = 1; i < uniqueDates.length; i++) {
    const previous = uniqueDates[i - 1]!;
    const current = uniqueDates[i]!;
    const gap = diffDays(parseISODate(current), parseISODate(previous));
    if (gap > gapToleranceDays + 1) {
      episodes.push({ start: episodeStart, end: episodeEnd });
      episodeStart = current;
    }
    episodeEnd = current;
  }
  episodes.push({ start: episodeStart, end: episodeEnd });
  return episodes;
}
