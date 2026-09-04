const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** UTC midnight for the given calendar date, so day-math never drifts across DST. */
export function utcDate(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day));
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return utcDate(year!, month! - 1, day!);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/** `a - b` in whole days. */
export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -date.getUTCDay());
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
}
