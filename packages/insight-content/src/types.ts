import type { CyclePhase } from '@cyclehacker/prediction-engine';

export type InsightCategory =
  | 'physical'
  | 'nutrition'
  | 'productivity'
  | 'mood'
  | 'libido'
  | 'sleep';

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  'physical',
  'nutrition',
  'productivity',
  'mood',
  'libido',
  'sleep',
];

export interface InsightTip {
  id: string;
  phase: CyclePhase;
  category: InsightCategory;
  text: string;
  isHeadlineEligible: boolean;
}

export type { CyclePhase };
