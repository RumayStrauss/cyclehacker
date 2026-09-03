import type { CyclePhase } from '@cyclehacker/prediction-engine';
import { allTips } from './content';
import { INSIGHT_CATEGORIES, type InsightCategory, type InsightTip } from './types';

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function daysSinceEpoch(date: string): number {
  return Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
}

export function getTipsForCategory(phase: CyclePhase, category: InsightCategory): InsightTip[] {
  return allTips.filter((tip) => tip.phase === phase && tip.category === category);
}

/**
 * Deterministic, not random-per-render: the same (phase, profileId, date)
 * always returns the same tip, so re-opening the app doesn't change the
 * headline mid-day. The category rotates daily on a stable schedule; the
 * specific tip within it is picked by a seeded hash of profileId + date so
 * different profiles see variety on the same day.
 */
export function selectHeadlineInsight(
  phase: CyclePhase,
  profileId: string,
  date: string,
): InsightTip {
  const eligibleCategories = INSIGHT_CATEGORIES.filter((category) =>
    getTipsForCategory(phase, category).some((tip) => tip.isHeadlineEligible),
  );
  if (eligibleCategories.length === 0) {
    throw new Error(`No headline-eligible tips configured for phase "${phase}"`);
  }

  const categoryIndex = daysSinceEpoch(date) % eligibleCategories.length;
  const category = eligibleCategories[categoryIndex]!;

  const candidates = getTipsForCategory(phase, category).filter((tip) => tip.isHeadlineEligible);
  const tipIndex = hashString(`${profileId}:${date}`) % candidates.length;
  return candidates[tipIndex]!;
}
