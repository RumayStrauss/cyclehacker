import type { SymptomType } from '@cyclehacker/supabase-client';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '@/theme';

const SYMPTOM_LABELS: Record<SymptomType, string> = {
  cramps: 'Cramps',
  headache: 'Headache',
  bloating: 'Bloating',
  fatigue: 'Fatigue',
  acne: 'Acne',
  tender_breasts: 'Tender breasts',
  backache: 'Backache',
  nausea: 'Nausea',
  cravings: 'Cravings',
  insomnia: 'Insomnia',
  other: 'Other',
};

const SYMPTOMS = Object.keys(SYMPTOM_LABELS) as SymptomType[];

interface SymptomChipGridProps {
  value: SymptomType[];
  onChange: (value: SymptomType[]) => void;
}

export function SymptomChipGrid({ value, onChange }: SymptomChipGridProps) {
  function toggle(symptom: SymptomType) {
    onChange(value.includes(symptom) ? value.filter((s) => s !== symptom) : [...value, symptom]);
  }

  return (
    <View>
      <Text style={styles.label}>Symptoms</Text>
      <View style={styles.row}>
        {SYMPTOMS.map((symptom) => {
          const selected = value.includes(symptom);
          return (
            <Pressable
              key={symptom}
              onPress={() => toggle(symptom)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {SYMPTOM_LABELS[symptom]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13 },
  chipTextSelected: { color: colors.primary, fontWeight: '600' },
});
