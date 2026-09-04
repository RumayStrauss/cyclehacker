import type { SymptomIntensity, SymptomType } from '@cyclehacker/supabase-client';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii, spacing } from '@/theme';
import { SectionLabel } from './SectionLabel';
import { SYMPTOM_CATEGORIES, type SymptomCategory } from './symptom-taxonomy';

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
          {category.symptoms.map((symptom) => {
            const selected = intensities[symptom.type] !== undefined;
            return (
              <SymptomRow
                key={symptom.type}
                label={symptom.label}
                category={category}
                selected={selected}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSetIntensity(symptom.type, selected ? undefined : DEFAULT_TAP_INTENSITY);
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function SymptomRow({
  label,
  category,
  selected,
  onPress,
}: {
  label: string;
  category: SymptomCategory;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && { borderColor: category.color }]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <View style={styles.rowIcon}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d={category.iconPath} stroke={category.color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <Text style={styles.rowText}>{label}</Text>
      <View style={[styles.checkbox, selected && { backgroundColor: category.color }]}>
        {selected ? (
          <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <Path d="M4 12.5l5 5L20 6" stroke="#0a070d" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.lg },
  group: { gap: spacing.sm },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  groupLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
  },
  rowIcon: {
    width: 41,
    height: 41,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.checkboxDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
