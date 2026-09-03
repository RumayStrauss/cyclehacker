import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '@/theme';

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
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  text: { fontSize: 16, color: colors.text, lineHeight: 22 },
});
