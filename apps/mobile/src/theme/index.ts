export const colors = {
  background: '#16111d',
  surface: '#22192e',
  surfaceElevated: '#291f38',
  navBackground: '#0a070d',
  border: '#22192e',
  borderStrong: '#4b3767',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.5)',
  primary: '#3be46e',
  onPrimary: '#000000',
  danger: '#ff5c72',
  /** Form-field tokens, straight from the Figma component set. */
  inputFill: '#0a070d',
  inputActiveFill: '#22192e',
  inputActiveBorder: '#1b5f5e',
  inputPlaceholder: 'rgba(255,255,255,0.5)',
  /** Selection accent used by checkbox/chip "selected" states (distinct from the primary CTA green). */
  selected: '#22a09e',
  selectedTint: 'rgba(34,160,158,0.15)',
  checkboxDefault: '#4b3767',
};

/** Cycle-phase tint colors, shared by the calendar and any phase-aware UI. */
export const phaseColors = {
  menstrual: '#e0399a',
  follicular: '#3bcecc',
  ovulatory: '#1b5f5e',
  luteal: '#7d67c9',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 24,
  pill: 999,
};

export const fonts = {
  display: 'Brume-Regular',
  light: 'Article-Light',
  regular: 'Article-Regular',
  bold: 'Article-Bold',
  extraBold: 'Article-ExtraBold',
};
