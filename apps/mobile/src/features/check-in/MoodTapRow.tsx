import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '@/theme';

const MOODS = [
  { value: 1, emoji: '😞', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

interface MoodTapRowProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function MoodTapRow({ value, onChange }: MoodTapRowProps) {
  return (
    <View>
      <Text style={styles.label}>Mood</Text>
      <View style={styles.row}>
        {MOODS.map((mood) => {
          const selected = value === mood.value;
          return (
            <Pressable
              key={mood.value}
              onPress={() => onChange(selected ? undefined : mood.value)}
              style={[styles.tap, selected && styles.tapSelected]}
              accessibilityRole="button"
              accessibilityLabel={mood.label}
              accessibilityState={{ selected }}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  tap: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tapSelected: { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
  emoji: { fontSize: 24 },
});
