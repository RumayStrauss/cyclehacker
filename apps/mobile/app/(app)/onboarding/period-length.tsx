import { router } from 'expo-router';
import { Text } from 'react-native';
import { NumberPicker } from '@/features/onboarding/NumberPicker';
import { OnboardingFooter, OnboardingScreen, PrimaryButton } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { colors, fonts } from '@/theme';

export default function PeriodLength() {
  const { draft, update } = useOnboardingDraft();

  return (
    <OnboardingScreen
      center
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Next" onPress={() => router.push('/(app)/onboarding/symptoms')} />
        </OnboardingFooter>
      }
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' }}>
        How long is your usual period?
      </Text>

      <NumberPicker
        value={draft.periodLength}
        onChange={(periodLength) => update({ periodLength })}
        min={1}
        max={14}
        formatLabel={(n) => `${n} days`}
      />
    </OnboardingScreen>
  );
}
