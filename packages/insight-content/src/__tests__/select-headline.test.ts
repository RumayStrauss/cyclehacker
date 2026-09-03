import { describe, expect, it } from 'vitest';
import { selectHeadlineInsight } from '../select-headline';

describe('selectHeadlineInsight', () => {
  it('is deterministic for the same phase, profile, and date', () => {
    const first = selectHeadlineInsight('luteal', 'profile-1', '2026-03-10');
    const second = selectHeadlineInsight('luteal', 'profile-1', '2026-03-10');
    expect(second.id).toBe(first.id);
  });

  it('only ever returns headline-eligible tips', () => {
    const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'] as const;
    for (const phase of phases) {
      for (let day = 1; day <= 10; day++) {
        const tip = selectHeadlineInsight(phase, 'profile-1', `2026-01-${String(day).padStart(2, '0')}`);
        expect(tip.isHeadlineEligible).toBe(true);
        expect(tip.phase).toBe(phase);
      }
    }
  });

  it('varies across different dates', () => {
    const seen = new Set<string>();
    for (let day = 1; day <= 20; day++) {
      const tip = selectHeadlineInsight('follicular', 'profile-1', `2026-02-${String(day).padStart(2, '0')}`);
      seen.add(tip.id);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('varies across different profiles on the same date', () => {
    const a = selectHeadlineInsight('ovulatory', 'profile-a', '2026-05-01');
    const b = selectHeadlineInsight('ovulatory', 'profile-b', '2026-05-01');
    // Not guaranteed to differ (hash collisions are possible), but across
    // many profile ids at least one different pick should turn up.
    const ids = new Set<string>([a.id]);
    for (let i = 0; i < 30; i++) {
      ids.add(selectHeadlineInsight('ovulatory', `profile-${i}`, '2026-05-01').id);
    }
    expect(ids.size).toBeGreaterThan(1);
    expect(b).toBeDefined();
  });
});
