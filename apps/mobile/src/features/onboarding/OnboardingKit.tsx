import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii, spacing } from '@/theme';

export function OnboardingScreen({
  children,
  footer,
  scroll = true,
  center = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  center?: boolean;
}) {
  const Container = scroll ? ScrollView : View;
  return (
    <View style={styles.screen}>
      <Container
        style={styles.body}
        contentContainerStyle={[styles.content, center && styles.contentCentered]}
      >
        {children}
      </Container>
      {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
    </View>
  );
}

export function OnboardingFooter({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={['rgba(22,17,29,0)', 'rgba(22,17,29,0.9)']} locations={[0, 0.4]} style={styles.footer}>
      {children}
      <View style={styles.homeIndicator} />
    </LinearGradient>
  );
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({ label, onPress, disabled, loading }: ButtonProps) {
  return (
    <Pressable style={[styles.button, styles.primaryButton, disabled && styles.buttonDisabled]} onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.primaryButtonText}>{label}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable style={[styles.button, styles.secondaryButton]} onPress={onPress} disabled={disabled}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function TertiaryButton({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.tertiaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

interface LabeledTextFieldProps extends TextInputProps {
  label: string;
}

export function LabeledTextField({ label, style, ...inputProps }: LabeledTextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, style]}
        placeholderTextColor={colors.inputPlaceholder}
        {...inputProps}
      />
    </View>
  );
}

/** Generic decorative tile used wherever the design shows an illustration placeholder. */
export function ImagePlaceholder({ size = 174 }: { size?: number }) {
  return (
    <View style={[styles.imageTile, { width: size, height: size }]}>
      <Svg width={74} height={74} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 18l5-6 4 4.5 3-3.5 4 5"
          stroke={colors.borderStrong}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
          stroke={colors.borderStrong}
          strokeWidth={1.8}
        />
      </Svg>
    </View>
  );
}

interface SimpleCheckboxItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SimpleCheckboxItem({ label, selected, onPress }: SimpleCheckboxItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.simpleItem, selected && styles.simpleItemSelected]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Text style={styles.simpleItemText}>{label}</Text>
      <CheckIndicator selected={selected} />
    </Pressable>
  );
}

interface IconCheckboxItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function IconCheckboxItem({ label, selected, onPress }: IconCheckboxItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconItem, selected && styles.iconItemSelected]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <View style={styles.iconItemGlyph}>
        <View style={styles.iconItemDot} />
      </View>
      <Text style={styles.iconItemText}>{label}</Text>
      <CheckIndicator selected={selected} />
    </Pressable>
  );
}

interface SearchableChecklistProps {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

export function SearchableChecklist({ items, selected, onToggle }: SearchableChecklistProps) {
  const [query, setQuery] = useState('');
  const visible = query.trim()
    ? items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
    : items;

  return (
    <View style={{ width: '100%', gap: 16 }}>
      <View style={styles.searchField}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"
            stroke={colors.inputPlaceholder}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.inputPlaceholder}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {visible.map((item) => (
        <IconCheckboxItem key={item} label={item} selected={selected.includes(item)} onPress={() => onToggle(item)} />
      ))}
    </View>
  );
}

function CheckIndicator({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
      {selected ? (
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
          <Path d="M4 12.5l5 5L20 6" stroke="#0a070d" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: 32, paddingBottom: 140, gap: 40 },
  contentCentered: { flexGrow: 1, justifyContent: 'center' },
  footerWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  footer: { paddingTop: spacing.md, paddingHorizontal: spacing.md, gap: spacing.sm, alignItems: 'center' },
  homeIndicator: { width: 120, height: 5, borderRadius: 100, backgroundColor: colors.text, marginTop: 8, marginBottom: 8 },

  button: {
    width: '100%',
    height: 48,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  primaryButton: { backgroundColor: colors.primary },
  primaryButtonText: { color: colors.onPrimary, fontFamily: fonts.bold, fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent' },
  secondaryButtonText: { color: colors.primary, fontFamily: fonts.bold, fontSize: 16 },
  tertiaryButton: { height: 48, alignItems: 'center', justifyContent: 'center' },

  field: { gap: 6, width: '100%' },
  fieldLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, paddingLeft: 16 },
  fieldInput: {
    backgroundColor: colors.inputFill,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 18,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
  },

  imageTile: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  simpleItem: {
    width: '100%',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  simpleItemSelected: { borderColor: colors.selected },
  simpleItemText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, flex: 1 },

  iconItem: {
    width: '100%',
    borderRadius: radii.md,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
    backgroundColor: colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconItemSelected: { borderColor: colors.selected },
  iconItemGlyph: {
    width: 41,
    height: 41,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconItemDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.selected },
  iconItemText: { fontFamily: fonts.bold, fontSize: 14, color: colors.text, flex: 1 },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.checkboxDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: colors.selected },

  searchField: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.inputFill,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.text, padding: 0 },
});
