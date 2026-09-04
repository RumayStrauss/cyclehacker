import { getTipsForCategory } from '@cyclehacker/insight-content';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HackingTipCard } from '@/features/home/HackingTipCard';
import { PhaseRing } from '@/features/home/PhaseRing';
import { SettingsIcon } from '@/features/home/tab-icons';
import { useCycleDayInfo } from '@/features/home/useCycleDayInfo';
import { useOwnProfile } from '@/lib/use-own-profile';
import { useOwnUser } from '@/lib/use-own-user';
import { colors, fonts, radii, spacing } from '@/theme';

const TIP_CARDS: { title: string; iconPath: string; category: 'physical' | 'mood' }[] = [
  {
    title: 'Energy levels',
    category: 'physical',
    iconPath: 'M13 2 3 14h9l-1 8 10-12h-9z',
  },
  {
    title: 'Mood',
    category: 'mood',
    iconPath: 'M12 21c-4-2.5-8-6.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-6 8.5-10 11z',
  },
];

export default function Home() {
  const { data: profile, isLoading: isProfileLoading } = useOwnProfile();
  const { data: user } = useOwnUser();
  const { data: cycleDayInfo, isLoading: isCycleDayLoading } = useCycleDayInfo(profile?.id);

  if (isProfileLoading) return null;

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyTitle}>Let's get started</Text>
        <Text style={styles.emptyBody}>Set up your cycle profile to start seeing daily guidance.</Text>
        <Pressable style={styles.button} onPress={() => router.push('/(app)/onboarding/welcome')}>
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
      </View>
    );
  }

  const greetingName = user?.name ?? profile.name;

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <View style={styles.avatar} />
        <Pressable style={styles.settingsButton} onPress={() => router.push('/(app)/(tabs)/settings')}>
          <SettingsIcon color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>Hi {greetingName}!</Text>

        {isCycleDayLoading ? null : cycleDayInfo ? (
          <View style={{ alignItems: 'center' }}>
            <PhaseRing cycleDay={cycleDayInfo.cycleDay} phase={cycleDayInfo.phase} boundaries={cycleDayInfo.boundaries} />
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardTitle}>No periods logged yet</Text>
            <Text style={styles.emptyCardBody}>Log your first period to start seeing your cycle day and phase.</Text>
          </View>
        )}

        {cycleDayInfo ? (
          <View style={{ gap: spacing.sm }}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsTitle}>Hacking & tips</Text>
            </View>
            {TIP_CARDS.map((card) => {
              const tip = getTipsForCategory(cycleDayInfo.phase, card.category)[0];
              if (!tip) return null;
              return <HackingTipCard key={card.category} title={card.title} body={tip.text} iconPath={card.iconPath} />;
            })}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceElevated },
  settingsButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: spacing.md, gap: spacing.xl },
  greeting: { fontFamily: fonts.display, fontSize: 44, color: colors.text },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  emptyCardTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, marginBottom: spacing.sm },
  emptyCardBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tipsTitle: { fontFamily: fonts.extraBold, fontSize: 14, color: colors.textSecondary, letterSpacing: 1 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.text, textAlign: 'center', marginTop: 200 },
  emptyBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  button: { backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center', marginHorizontal: spacing.lg },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontFamily: fonts.bold },
});
