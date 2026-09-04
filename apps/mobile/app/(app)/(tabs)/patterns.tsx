import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/theme';

export default function Patterns() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patterns are coming soon</Text>
      <Text style={styles.body}>
        Once you've logged a few cycles, this is where you'll see trends across your symptoms, mood, and energy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background, gap: spacing.sm },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.text, textAlign: 'center' },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
