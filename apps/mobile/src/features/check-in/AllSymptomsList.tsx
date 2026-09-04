import type { SymptomIntensity, SymptomType } from '@cyclehacker/supabase-client';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, spacing } from '@/theme';
import { SectionLabel } from './SectionLabel';
import { SYMPTOM_CATEGORIES } from './symptom-taxonomy';

const DEFAULT_TAP_INTENSITY: SymptomIntensity = 3;

interface AllSymptomsListProps {
  intensities: Partial<Record<SymptomType, SymptomIntensity>>;
  onSetIntensity: (type: SymptomType, intensity: SymptomIntensity | undefined) => void;
}

export function AllSymptomsList({ intensities, onSetIntensity }: AllSymptomsListProps) {
  return (
    <View style={styles.section}>
      <SectionLabel>All symptoms</SectionLabel>
      {SYMPTOM_CATEGORIES.map((category) => (
        <View key={category.key} style={styles.group}>
          <View style={styles.groupHeader}>
            <View style={[styles.dot, { backgroundColor: category.color }]} />
            <Text style={styles.groupLabel}>{category.label}</Text>
          </View>
          <View style={styles.chipRow}>
            {category.symptoms.map((symptom) => {
              const selected = intensities[symptom.type] !== undefined;
              return (
                <Pressable
                  key={symptom.type}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSetIntensity(symptom.type, selected ? undefined : DEFAULT_TAP_INTENSITY);
                  }}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? `${category.color}33` : `${category.color}1f`,
                      borderColor: selected ? category.color : `${category.color}66`,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={styles.chipText}>{symptom.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.lg },
  group: { gap: 10 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  groupLabel: { fontFamily: fonts.bold, fontSize: 14, color: '#ffffff' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontFamily: fonts.regular, fontSize: 14, color: '#ffffff' },
});
