import type { InsightTip } from '../types';
import { follicularTips } from './follicular';
import { lutealTips } from './luteal';
import { menstrualTips } from './menstrual';
import { ovulatoryTips } from './ovulatory';

export const allTips: InsightTip[] = [
  ...menstrualTips,
  ...follicularTips,
  ...ovulatoryTips,
  ...lutealTips,
];
