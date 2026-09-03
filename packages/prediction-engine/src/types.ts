export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy';

export interface PeriodEntry {
  /** ISO date, 'YYYY-MM-DD' */
  date: string;
  flowLevel: FlowLevel;
}

export type Confidence = 'none' | 'low' | 'medium' | 'high';

export interface CycleStats {
  averageCycleLength: number | null;
  averagePeriodLength: number | null;
  cycleLengthSamples: number[];
  confidence: Confidence;
  isIrregular: boolean;
}

export interface PhaseBoundaries {
  cycleLength: number;
  menstrualStart: number;
  menstrualEnd: number;
  follicularStart: number;
  follicularEnd: number;
  ovulatoryStart: number;
  ovulatoryEnd: number;
  lutealStart: number;
  lutealEnd: number;
}

export interface CycleDayInfo {
  cycleDay: number;
  phase: CyclePhase;
  confidence: Confidence;
  daysUntilNextPeriod: number | null;
  boundaries: PhaseBoundaries;
}
