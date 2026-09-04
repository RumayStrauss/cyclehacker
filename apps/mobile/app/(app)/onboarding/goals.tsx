import { router } from 'expo-router';
import { Text } from 'react-native';
import { OnboardingFooter, OnboardingScreen, PrimaryButton, SearchableChecklist } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { colors, fonts } from '@/theme';

const GOALS = [
  'Predict period start date',
  'Predict ovulation',
  'Predict mood changes',
  'Plan for energy fluctuation',
  'Support nutritional needs',
  'Predict libido changes',
  'Prepared for symptoms',
  'Adjust sleep duration',
];

export default function Goals() {
  const { draft, toggleGoal } = useOnboardingDraft();

  return (
    <OnboardingScreen
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Next" onPress={() => router.push('/(app)/onboarding/add-partner')} />
        </OnboardingFooter>
      }
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' }}>
        What do you want to achieve
      </Text>
      <SearchableChecklist items={GOALS} selected={draft.goals} onToggle={toggleGoal} />
    </OnboardingScreen>
  );
}
