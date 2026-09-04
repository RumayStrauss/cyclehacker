import { router } from 'expo-router';
import { Text } from 'react-native';
import { OnboardingFooter, OnboardingScreen, PrimaryButton, SearchableChecklist } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { colors, fonts } from '@/theme';

const SYMPTOMS = [
  'Abdominal cramps',
  'Back pain',
  'Headaches',
  'Bloating',
  'Mood changes',
  'Diarrhoea',
  'Nausea',
];

export default function Symptoms() {
  const { draft, toggleSymptom } = useOnboardingDraft();

  return (
    <OnboardingScreen
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Next" onPress={() => router.push('/(app)/onboarding/goals')} />
        </OnboardingFooter>
      }
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' }}>
        What are your usual period symptoms
      </Text>
      <SearchableChecklist items={SYMPTOMS} selected={draft.symptoms} onToggle={toggleSymptom} />
    </OnboardingScreen>
  );
}
