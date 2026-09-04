import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii } from '@/theme';

const ROW_HEIGHT = 26;
const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2];
const OPACITY_BY_DISTANCE: Record<number, number> = { 0: 1, 1: 0.5, 2: 0.1 };

interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  formatLabel?: (n: number) => string;
}

export function NumberPicker({ value, onChange, min, max, formatLabel }: NumberPickerProps) {
  const label = formatLabel ?? ((n: number) => String(n));
  const dragStartValue = useSharedValue(value);
  const translateY = useSharedValue(0);

  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

  const commit = useCallback(
    (next: number) => {
      const clamped = clamp(next);
      if (clamped !== value) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(clamped);
      }
    },
    [clamp, onChange, value],
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      dragStartValue.value = value;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
      const delta = Math.round(-event.translationY / ROW_HEIGHT);
      runOnJS(commit)(dragStartValue.value + delta);
    })
    .onEnd(() => {
      translateY.value = 0;
    });

  const rowsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value % ROW_HEIGHT }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View style={styles.rowsClip}>
          <Animated.View style={rowsStyle}>
            {VISIBLE_OFFSETS.map((offset) => {
              const rowValue = value + offset;
              const inRange = rowValue >= min && rowValue <= max;
              return (
                <Text
                  key={offset}
                  style={[
                    styles.rowText,
                    { opacity: inRange ? OPACITY_BY_DISTANCE[Math.abs(offset)] : 0 },
                    offset === 0 && styles.rowTextCenter,
                  ]}
                >
                  {inRange ? label(rowValue) : ''}
                </Text>
              );
            })}
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={styles.controls}>
        <Pressable onPress={() => commit(value + 1)} hitSlop={8}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M6 15l6-6 6 6" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <Pressable onPress={() => commit(value - 1)} hitSlop={8}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M6 9l6 6 6-6" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 133,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowsClip: { flex: 1, height: ROW_HEIGHT * 5, overflow: 'hidden', justifyContent: 'center' },
  rowText: {
    height: ROW_HEIGHT,
    lineHeight: ROW_HEIGHT,
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  rowTextCenter: { fontFamily: fonts.bold },
  controls: { gap: 16, paddingVertical: 18 },
});
