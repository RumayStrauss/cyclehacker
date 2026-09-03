import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '@/theme';

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
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  body: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.lg },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.surface, fontSize: 16, fontWeight: '600' },
});
