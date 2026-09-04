import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, spacing } from '@/theme';
import { SectionLabel } from './SectionLabel';

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
    <View style={styles.section}>
      <SectionLabel>Mood</SectionLabel>
      <View style={styles.row}>
        {MOODS.map((mood) => {
          const selected = value === mood.value;
          return (
            <Pressable
              key={mood.value}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChange(selected ? undefined : mood.value);
              }}
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
  section: { gap: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  tap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#22192e',
    backgroundColor: '#22192e',
  },
  tapSelected: { borderColor: '#3be46e', backgroundColor: '#3be46e26' },
  emoji: { fontSize: 24, fontFamily: fonts.regular },
});
