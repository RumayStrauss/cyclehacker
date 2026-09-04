import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { fonts } from '@/theme';

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#f5f5f5',
    letterSpacing: 1,
  },
});
