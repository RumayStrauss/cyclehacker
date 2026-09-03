import { selectHeadlineInsight } from '@cyclehacker/insight-content';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CycleDaySummary } from '@/features/home/CycleDaySummary';
import { HeadlineInsightCard } from '@/features/home/HeadlineInsightCard';
import { useCycleDayInfo } from '@/features/home/useCycleDayInfo';
import { useOwnProfile } from '@/lib/use-own-profile';
import { colors, radii, spacing } from '@/theme';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const { data: profile, isLoading: isProfileLoading } = useOwnProfile();
  const { data: cycleDayInfo, isLoading: isCycleDayLoading } = useCycleDayInfo(profile?.id);

  if (isProfileLoading) return null;

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyTitle}>Let's get started</Text>
        <Text style={styles.emptyBody}>Set up your cycle profile to start seeing daily guidance.</Text>
        <Pressable style={styles.button} onPress={() => router.push('/(app)/onboarding-choice')}>
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCycleDayLoading ? null : cycleDayInfo ? (
        <>
          <CycleDaySummary
            cycleDay={cycleDayInfo.cycleDay}
            phase={cycleDayInfo.phase}
            confidence={cycleDayInfo.confidence}
          />
          <HeadlineInsightCard
            text={selectHeadlineInsight(cycleDayInfo.phase, profile.id, today()).text}
          />
        </>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No periods logged yet</Text>
          <Text style={styles.emptyBody}>Log your first period to start seeing your cycle day and phase.</Text>
        </View>
      )}

      <Pressable style={styles.checkInButton} onPress={() => router.push('/(app)/check-in')}>
        <Text style={styles.checkInButtonText}>Daily check-in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background, gap: spacing.lg },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyBody: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.surface, fontSize: 16, fontWeight: '600' },
  checkInButton: {
    marginTop: 'auto',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  checkInButtonText: { color: colors.surface, fontSize: 16, fontWeight: '600' },
});
