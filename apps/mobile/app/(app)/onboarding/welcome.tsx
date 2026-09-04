import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { ImagePlaceholder, OnboardingFooter, OnboardingScreen, PrimaryButton } from '@/features/onboarding/OnboardingKit';
import { colors, fonts } from '@/theme';

export default function Welcome() {
  return (
    <OnboardingScreen
      center
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Next" onPress={() => router.push('/(app)/onboarding/name')} />
        </OnboardingFooter>
      }
    >
      <ImagePlaceholder size={274} />
      <View style={{ gap: 16 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' }}>
          You&rsquo;re in!
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.text, textAlign: 'center' }}>
          Now let&rsquo;s set up the rest.
        </Text>
      </View>
    </OnboardingScreen>
  );
}
