import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { ImagePlaceholder, LabeledTextField, OnboardingFooter, OnboardingScreen, PrimaryButton } from '@/features/onboarding/OnboardingKit';
import { supabase } from '@/lib/supabase';
import { colors, fonts } from '@/theme';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleContinue() {
    setError(null);
    setIsSubmitting(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setIsSubmitting(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    router.push({ pathname: '/(auth)/otp', params: { email } });
  }

  return (
    <OnboardingScreen
      footer={
        <OnboardingFooter>
          <PrimaryButton label="Continue" onPress={handleContinue} loading={isSubmitting} disabled={!email.includes('@')} />
        </OnboardingFooter>
      }
    >
      <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.text, textAlign: 'center' }}>
        How would you like to register?
      </Text>
      <LabeledTextField
        label="Email"
        placeholder="E.g. brittanyspears@email.com"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {error ? <Text style={{ color: colors.danger, fontFamily: fonts.regular, fontSize: 13 }}>{error}</Text> : null}
      <ImagePlaceholder />
    </OnboardingScreen>
  );
}
