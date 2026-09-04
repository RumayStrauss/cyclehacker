import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ImagePlaceholder, LabeledTextField, OnboardingFooter, OnboardingScreen, PrimaryButton } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { colors, fonts } from '@/theme';

export default function OnboardingName() {
  const { draft, update } = useOnboardingDraft();

  return (
    <OnboardingScreen
      footer={
        <OnboardingFooter>
          <PrimaryButton
            label="Let's go"
            onPress={() => router.push('/(app)/onboarding/purpose')}
            disabled={draft.name.trim().length === 0}
          />
        </OnboardingFooter>
      }
    >
      <View style={{ gap: 16 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text }}>Oh, hi!</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.text }}>What should we call you?</Text>
      </View>
      <LabeledTextField
        label="Nickname"
        placeholder="E.g. Brittany"
        value={draft.name}
        onChangeText={(name) => update({ name })}
      />
      <ImagePlaceholder />
    </OnboardingScreen>
  );
}
