import type { FlowLevel, SymptomIntensity, SymptomType } from '@cyclehacker/supabase-client';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { HoldDragTile } from './HoldDragTile';
import { SectionLabel } from './SectionLabel';
import {
  FLOW_DIAL_LEVELS,
  INTENSITY_LEVELS,
  QUICK_ACCESS_TILES,
  SYMPTOM_CATEGORIES,
  intensityShades,
} from './symptom-taxonomy';

function categoryFor(key: string) {
  return SYMPTOM_CATEGORIES.find((c) => c.key === key)!;
}

interface QuickAccessGridProps {
  flowLevel: FlowLevel | undefined;
  onFlowLevelChange: (value: FlowLevel | undefined) => void;
  intensities: Partial<Record<SymptomType, SymptomIntensity>>;
  onSetIntensity: (type: SymptomType, intensity: SymptomIntensity | undefined) => void;
}

export function QuickAccessGrid({
  flowLevel,
  onFlowLevelChange,
  intensities,
  onSetIntensity,
}: QuickAccessGridProps) {
  return (
    <View style={styles.section}>
      <SectionLabel>Frequently used</SectionLabel>
      <View style={styles.grid}>
        {QUICK_ACCESS_TILES.map((tile) => {
          const category = categoryFor(tile.category);
          if (tile.key === 'flow') {
            const value =
              flowLevel && flowLevel !== 'none' ? (flowLevel as (typeof FLOW_DIAL_LEVELS)[number]['value']) : undefined;
            const shades = intensityShades(category.color);
            return (
              <View key={tile.key} style={styles.item}>
                <HoldDragTile
                  label={tile.label}
                  iconPath={tile.iconPath ?? category.iconPath}
                  color={category.color}
                  levelColors={{ spotting: shades[1], light: shades[2], medium: shades[4], heavy: shades[5] }}
                  levels={FLOW_DIAL_LEVELS}
                  value={value}
                  onChange={(next) => onFlowLevelChange(next ?? 'none')}
                  defaultLevelIndex={1}
                />
              </View>
            );
          }

          const symptomType = tile.symptomType as SymptomType;
          const value = intensities[symptomType];
          return (
            <View key={tile.key} style={styles.item}>
              <HoldDragTile
                label={tile.label}
                iconPath={tile.iconPath ?? category.iconPath}
                color={category.color}
                levelColors={intensityShades(category.color)}
                levels={INTENSITY_LEVELS}
                value={value}
                onChange={(next) => onSetIntensity(symptomType, next)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  item: { width: '48%' },
});
