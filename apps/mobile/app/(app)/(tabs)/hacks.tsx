import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/theme';

export default function Hacks() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The full hacks library is coming soon</Text>
      <Text style={styles.body}>
        For now, check your home screen for a couple of phase-based tips picked for today.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background, gap: spacing.sm },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.text, textAlign: 'center' },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
