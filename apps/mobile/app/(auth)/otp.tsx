import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ImagePlaceholder, OnboardingFooter, OnboardingScreen, TertiaryButton } from '@/features/onboarding/OnboardingKit';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radii } from '@/theme';

const CODE_LENGTH = 6;

export default function Otp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  async function verify(code: string) {
    setError(null);
    setIsVerifying(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    setIsVerifying(false);
    if (verifyError) {
      setError(verifyError.message);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();
      return;
    }
    router.replace('/(app)/onboarding/welcome');
  }

  function handleChangeDigit(index: number, text: string) {
    const value = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
    if (next.every((d) => d.length === 1)) {
      verify(next.join(''));
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleResend() {
    setError(null);
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  }

  return (
    <OnboardingScreen
      footer={
        <OnboardingFooter>
          <View />
        </OnboardingFooter>
      }
    >
      <View style={{ gap: 16, alignItems: 'center' }}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We sent a one-time pin to{'\n'}
          <Text style={styles.subtitleEmail}>{email}</Text>.
        </Text>
      </View>

      <View style={{ gap: 16, alignItems: 'center' }}>
        <View style={styles.row}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              style={[styles.box, digit && styles.boxFilled]}
              value={digit}
              onChangeText={(text) => handleChangeDigit(index, text)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!isVerifying}
            />
          ))}
        </View>
        <TertiaryButton label="Resend OTP" onPress={handleResend} disabled={isVerifying} />
      </View>

      {error ? <Text style={{ color: colors.danger, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center' }}>{error}</Text> : null}

      <ImagePlaceholder />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 20 },
  subtitleEmail: { fontFamily: fonts.bold },
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  box: {
    width: 42,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.inputFill,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 18,
    textAlign: 'center',
  },
  boxFilled: { backgroundColor: colors.inputActiveFill, borderWidth: 1, borderColor: colors.inputActiveBorder },
});
