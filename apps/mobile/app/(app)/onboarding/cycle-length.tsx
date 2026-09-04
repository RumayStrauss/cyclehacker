import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NumberPicker } from '@/features/onboarding/NumberPicker';
import { OnboardingFooter, OnboardingScreen, PrimaryButton } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { colors, fonts, radii } from '@/theme';

export default function CycleLength() {
  const { draft, update } = useOnboardingDraft();

  return (
    <OnboardingScreen
      center
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Next" onPress={() => router.push('/(app)/onboarding/period-length')} />
        </OnboardingFooter>
      }
    >
      <Pressable
        style={styles.importRow}
        onPress={() => Alert.alert('Import data', 'Importing from other apps is coming soon.')}
      >
        <View style={styles.importIcon}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 21c-4-2.5-8-6.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-6 8.5-10 11z"
              fill={colors.primary}
            />
          </Svg>
        </View>
        <Text style={styles.importText}>Import data from elsewhere</Text>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M9 6l6 6-6 6" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <Text style={styles.title}>What is your average cycle length?</Text>

      <NumberPicker
        value={draft.cycleLength}
        onChange={(cycleLength) => update({ cycleLength })}
        min={15}
        max={45}
        formatLabel={(n) => `${n} days`}
      />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  importRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    padding: 12,
  },
  importIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  importText: { flex: 1, fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' },
});
