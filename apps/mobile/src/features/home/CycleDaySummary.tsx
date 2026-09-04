import type { Confidence, CyclePhase } from '@cyclehacker/prediction-engine';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/theme';

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Period',
  follicular: 'Follicular phase',
  ovulatory: 'Ovulatory phase',
  luteal: 'Luteal phase',
};

interface CycleDaySummaryProps {
  cycleDay: number;
  phase: CyclePhase;
  confidence: Confidence;
}

export function CycleDaySummary({ cycleDay, phase, confidence }: CycleDaySummaryProps) {
  const isLowConfidence = confidence === 'none' || confidence === 'low';

  return (
    <View style={styles.container}>
      <Text style={styles.day}>Day {cycleDay}</Text>
      <Text style={styles.phase}>{PHASE_LABELS[phase]}</Text>
      {isLowConfidence ? (
        <Text style={styles.note}>
          Still learning your cycle. This gets more accurate with a few more logged periods.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  day: { fontFamily: fonts.display, fontSize: 34, color: colors.text },
  phase: { fontFamily: fonts.regular, fontSize: 17, color: colors.textSecondary, marginTop: spacing.xs },
  note: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
});
