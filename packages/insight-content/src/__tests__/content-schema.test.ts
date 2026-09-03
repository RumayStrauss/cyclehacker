import type { CyclePhase } from '@cyclehacker/prediction-engine';
import { describe, expect, it } from 'vitest';
import { allTips } from '../content';
import { INSIGHT_CATEGORIES } from '../types';

const PHASES: CyclePhase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
const EM_DASH = '—';

// Guards against diagnostic/prescriptive phrasing ("you will feel low",
// "you have PMS"). Deliberately does not flag plain "you are" since that
// alone isn't a diagnostic claim.
const DIAGNOSTIC_PHRASING = /\byou (will|have)\b/i;

describe('insight content schema', () => {
  it('has at least one tip for every phase and category combination', () => {
    for (const phase of PHASES) {
      for (const category of INSIGHT_CATEGORIES) {
        const matches = allTips.filter((tip) => tip.phase === phase && tip.category === category);
        expect(matches.length, `${phase}/${category} should have at least one tip`).toBeGreaterThan(0);
      }
    }
  });

  it('has unique ids', () => {
    const ids = allTips.map((tip) => tip.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never uses an em dash', () => {
    for (const tip of allTips) {
      expect(tip.text.includes(EM_DASH), `${tip.id} contains an em dash`).toBe(false);
    }
  });

  it('never uses diagnostic or prescriptive phrasing', () => {
    for (const tip of allTips) {
      expect(DIAGNOSTIC_PHRASING.test(tip.text), `${tip.id} reads as diagnostic: "${tip.text}"`).toBe(
        false,
      );
    }
  });

  it('keeps headline-eligible tips within the home screen card length budget', () => {
    for (const tip of allTips.filter((t) => t.isHeadlineEligible)) {
      expect(tip.text.length, `${tip.id} is ${tip.text.length} chars`).toBeLessThanOrEqual(110);
    }
  });

  it('has at least one headline-eligible tip for every phase', () => {
    for (const phase of PHASES) {
      const hasHeadline = allTips.some((tip) => tip.phase === phase && tip.isHeadlineEligible);
      expect(hasHeadline, `${phase} has no headline-eligible tip`).toBe(true);
    }
  });
});
