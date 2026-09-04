import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/theme';

interface HeadlineInsightCardProps {
  text: string;
}

export function HeadlineInsightCard({ text }: HeadlineInsightCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Today</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.lg,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  text: { fontFamily: fonts.regular, fontSize: 16, color: colors.text, lineHeight: 22 },
});
