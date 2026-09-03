export function parseISODate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

export function addDays(date: string, days: number): string {
  const d = parseISODate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
