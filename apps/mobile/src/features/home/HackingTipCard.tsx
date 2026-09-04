import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii } from '@/theme';

interface HackingTipCardProps {
  title: string;
  body: string;
  iconPath: string;
}

export function HackingTipCard({ title, body, iconPath }: HackingTipCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d={iconPath} stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: 8, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1630',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.text, flex: 1 },
  body: { fontFamily: fonts.regular, fontSize: 16, color: colors.textSecondary, paddingHorizontal: 8, paddingBottom: 4 },
});
