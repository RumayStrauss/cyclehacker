import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/theme';

export default function OnboardingPartnerStub() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner support is coming soon</Text>
      <Text style={styles.body}>
        We're still building the partner tracking experience. For now, you can explore the app on
        your own, or come back once this is ready.
      </Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.text, marginBottom: spacing.md },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontFamily: fonts.bold },
});
