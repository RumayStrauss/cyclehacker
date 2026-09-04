import type { SymptomType } from '@cyclehacker/supabase-client';

export type SymptomCategoryKey = 'flow' | 'bodily' | 'energy' | 'cravings' | 'libido';

export interface GranularSymptom {
  type: SymptomType;
  label: string;
}

export interface SymptomCategory {
  key: SymptomCategoryKey;
  label: string;
  color: string;
  /** SVG path data (24x24 viewBox, stroke-based) shared with the design mockup icons. */
  iconPath: string;
  /** Every selectable symptom in this category, shown as chips under "All symptoms". */
  symptoms: GranularSymptom[];
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    key: 'flow',
    label: 'Flow',
    color: '#e0399a',
    iconPath: 'M12 2s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z',
    symptoms: [{ type: 'clots', label: 'Clots' }],
  },
  {
    key: 'bodily',
    label: 'Bodily symptoms',
    color: '#f0995a',
    iconPath:
      'M12 21c-4-2.5-8-6.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-6 8.5-10 11z M9 12h2l1-2 2 4 1-2h2',
    symptoms: [
      { type: 'cramps', label: 'Cramps' },
      { type: 'headache', label: 'Headache' },
      { type: 'backache', label: 'Backache' },
      { type: 'nausea', label: 'Nausea' },
      { type: 'bloating', label: 'Bloating' },
      { type: 'tender_breasts', label: 'Tender breasts' },
    ],
  },
  {
    key: 'energy',
    label: 'Energy',
    color: '#3be46e',
    iconPath: 'M13 2 3 14h9l-1 8 10-12h-9z',
    symptoms: [
      { type: 'low_energy', label: 'Low energy' },
      { type: 'fatigue', label: 'Fatigue' },
      { type: 'wired', label: 'Wired' },
      { type: 'restless', label: 'Restless' },
    ],
  },
  {
    key: 'cravings',
    label: 'Cravings',
    color: '#f2c94c',
    iconPath: 'M4 13a8 8 0 0 0 16 0 M4 13c0-4.4 3.6-8 8-8s8 3.6 8 8 M9 9c0-1.5 1-2 1-3.5 M14 9c0-1.5-1-2-1-3.5',
    symptoms: [
      { type: 'cravings_sweet', label: 'Sweet' },
      { type: 'cravings_salty', label: 'Salty' },
      { type: 'cravings_chocolate', label: 'Chocolate' },
      { type: 'cravings_carbs', label: 'Carbs' },
    ],
  },
  {
    key: 'libido',
    label: 'Libido',
    color: '#8278bf',
    iconPath:
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z',
    symptoms: [
      { type: 'libido_low', label: 'Low' },
      { type: 'libido_neutral', label: 'Neutral' },
      { type: 'libido_high', label: 'High' },
    ],
  },
];

export const HEADACHE_ICON_PATH =
  'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M9 10a3 3 0 0 1 6 0c0 2-3 2-3 5';

export interface QuickAccessTile {
  key: string;
  label: string;
  category: SymptomCategoryKey;
  /** Overrides the category's default icon, e.g. Headache gets its own glyph. */
  iconPath?: string;
  /** The symptom_type this tile's dial writes to; omitted for the Flow tile, which writes flowLevel instead. */
  symptomType?: SymptomType;
}

export const QUICK_ACCESS_TILES: QuickAccessTile[] = [
  { key: 'flow', label: 'Flow', category: 'flow' },
  { key: 'energy', label: 'Energy', category: 'energy', symptomType: 'energy' },
  { key: 'cramps', label: 'Cramps', category: 'bodily', symptomType: 'cramps' },
  { key: 'headache', label: 'Headache', category: 'bodily', iconPath: HEADACHE_ICON_PATH, symptomType: 'headache' },
  { key: 'cravings', label: 'Cravings', category: 'cravings', symptomType: 'cravings' },
  { key: 'libido', label: 'Libido', category: 'libido', symptomType: 'libido' },
];

/** Every symptom_type's display label, including the general quick-access ones with no granular chip of their own. */
export const SYMPTOM_LABELS: Record<SymptomType, string> = {
  energy: 'Energy',
  cravings: 'Cravings',
  libido: 'Libido',
  ...Object.fromEntries(SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms.map((s) => [s.type, s.label]))),
} as Record<SymptomType, string>;

export const INTENSITY_LEVELS: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Meh' },
  { value: 3, label: 'Fine' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Super high' },
];

export const FLOW_DIAL_LEVELS: { value: 'spotting' | 'light' | 'medium' | 'heavy'; label: string }[] = [
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function mix(hex: string, target: number, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const t = target;
  const mixChannel = (c: number) => Math.round(c + (t - c) * clamp01(amount));
  return `#${[mixChannel(r), mixChannel(g), mixChannel(b)]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * Shades a category color into the dial's 5 segment colors, darkest (Low) to
 * lightest (Super high), with the 4th segment (High) as the pure category
 * color, matching the worked Energy example in the design mockup.
 */
export function intensityShades(categoryColor: string): Record<1 | 2 | 3 | 4 | 5, string> {
  return {
    1: mix(categoryColor, 0, 0.75),
    2: mix(categoryColor, 0, 0.55),
    3: mix(categoryColor, 0, 0.3),
    4: categoryColor,
    5: mix(categoryColor, 255, 0.45),
  };
}
