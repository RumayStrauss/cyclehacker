import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonts, phaseColors } from '@/theme';

const ITEMS = [
  { kind: 'logged' as const, label: 'Period logged' },
  { kind: 'predicted-period' as const, label: 'Predicted period' },
  { kind: 'predicted-ovulation' as const, label: 'Predicted ovulation' },
];

function Swatch({ kind }: { kind: (typeof ITEMS)[number]['kind'] }) {
  if (kind === 'logged') return <View style={[styles.dot, { backgroundColor: phaseColors.menstrual }]} />;
  if (kind === 'predicted-period') {
    return <View style={[styles.dot, styles.ring, { borderColor: phaseColors.menstrual }]} />;
  }
  return (
    <View
      style={[styles.dot, styles.ring, { borderColor: phaseColors.ovulatory, backgroundColor: `${phaseColors.ovulatory}33` }]}
    />
  );
}

export function CalendarLegend() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ITEMS.map((item, i) => (
        <View key={item.kind} style={styles.itemGroup}>
          {i > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.item}>
            <Swatch kind={item.kind} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  itemGroup: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 12, backgroundColor: '#22192e', marginHorizontal: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  ring: { borderWidth: 1.5, backgroundColor: 'transparent' },
  label: { fontFamily: fonts.regular, fontSize: 10.5, color: 'rgba(255,255,255,0.7)' },
});
