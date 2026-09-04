import { router } from 'expo-router';
import { Text } from 'react-native';
import { OnboardingFooter, OnboardingScreen, PrimaryButton, SimpleCheckboxItem } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft, type OnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { colors, fonts } from '@/theme';

const OPTIONS: { value: NonNullable<OnboardingDraft['purpose']>; label: string }[] = [
  { value: 'hack_cycle', label: 'I want to hack my cycle' },
  { value: 'support_partner', label: 'I want to support a partner' },
];

export default function Purpose() {
  const { draft, update } = useOnboardingDraft();

  function handleNext() {
    if (draft.purpose === 'support_partner') {
      router.push('/(app)/onboarding-partner-stub');
      return;
    }
    router.push('/(app)/onboarding/cycle-length');
  }

  return (
    <OnboardingScreen
      center
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Next" onPress={handleNext} disabled={!draft.purpose} />
        </OnboardingFooter>
      }
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' }}>
        What brought{'\n'}you here?
      </Text>
      {OPTIONS.map((option) => (
        <SimpleCheckboxItem
          key={option.value}
          label={option.label}
          selected={draft.purpose === option.value}
          onPress={() => update({ purpose: option.value })}
        />
      ))}
    </OnboardingScreen>
  );
}
