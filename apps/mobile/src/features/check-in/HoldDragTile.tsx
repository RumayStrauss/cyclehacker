import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { fonts, radii, spacing } from '@/theme';

const ROW_HEIGHT = 40;

export interface DialLevel<T extends string | number> {
  value: T;
  label: string;
}

interface HoldDragTileProps<T extends string | number> {
  label: string;
  iconPath: string;
  /** Solid category/base color for the icon disk and the tile's selected border. */
  color: string;
  /** Stacked dial segment colors, one per level, darkest/lowest first. */
  levelColors: Record<T, string>;
  levels: DialLevel<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  /** Index (into `levels`) a fresh hold starts from; defaults to the middle level. */
  defaultLevelIndex?: number;
}

function hapticForLevelIndex(index: number, count: number) {
  const fraction = index / Math.max(1, count - 1);
  if (fraction < 0.4) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (fraction < 0.75) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function HoldDragTile<T extends string | number>({
  label,
  iconPath,
  color,
  levelColors,
  levels,
  value,
  onChange,
  defaultLevelIndex,
}: HoldDragTileProps<T>) {
  const startIndex = defaultLevelIndex ?? Math.floor((levels.length - 1) / 2);
  const currentIndex = value !== undefined ? levels.findIndex((l) => l.value === value) : -1;

  const dialVisible = useSharedValue(0);
  const activeIndex = useSharedValue(currentIndex >= 0 ? currentIndex : startIndex);
  const anchorIndex = useSharedValue(startIndex);

  const commit = useCallback(
    (index: number) => {
      const level = levels[index];
      onChange(level?.value);
    },
    [levels, onChange],
  );

  const fireHaptic = useCallback(
    (index: number) => {
      hapticForLevelIndex(index, levels.length);
    },
    [levels.length],
  );

  const pan = Gesture.Pan()
    .activateAfterLongPress(220)
    .onStart(() => {
      const startAt = currentIndex >= 0 ? currentIndex : startIndex;
      anchorIndex.value = startAt;
      activeIndex.value = startAt;
      dialVisible.value = withTiming(1, { duration: 120 });
      runOnJS(fireHaptic)(startAt);
    })
    .onUpdate((event) => {
      const delta = Math.round(-event.translationY / ROW_HEIGHT);
      const next = Math.min(levels.length - 1, Math.max(0, anchorIndex.value + delta));
      if (next !== activeIndex.value) {
        activeIndex.value = next;
        runOnJS(fireHaptic)(next);
      }
    })
    .onEnd(() => {
      dialVisible.value = withTiming(0, { duration: 120 });
      runOnJS(commit)(activeIndex.value);
    });

  const tap = Gesture.Tap().onStart(() => {
    if (currentIndex >= 0) {
      runOnJS(onChange)(undefined);
    } else {
      runOnJS(fireHaptic)(startIndex);
      runOnJS(commit)(startIndex);
    }
  });

  const gesture = Gesture.Exclusive(pan, tap);

  const dialStyle = useAnimatedStyle(() => ({
    opacity: dialVisible.value,
    transform: [{ translateY: dialVisible.value === 0 ? 8 : 0 }],
  }));

  const isSelected = value !== undefined;

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.dial, dialStyle]} pointerEvents="none">
          {[...levels].reverse().map((level) => {
            const index = levels.indexOf(level);
            return (
              <DialSegment
                key={String(level.value)}
                label={level.label}
                color={levelColors[level.value]}
                dark={index >= levels.length - 2}
                index={index}
                activeIndex={activeIndex}
              />
            );
          })}
        </Animated.View>

        <View
          style={[
            styles.tile,
            isSelected && { borderColor: color, borderWidth: 1.5, backgroundColor: colorWithAlpha(color, 0x22) },
          ]}
        >
          <View style={[styles.iconDisk, { backgroundColor: isSelected ? color : colorWithAlpha(color, 0x26) }]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d={iconPath}
                stroke={isSelected ? '#000000' : color}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={[styles.tileLabel, isSelected && { color, fontFamily: fonts.bold }]}>{label}</Text>
        </View>
      </View>
    </GestureDetector>
  );
}

function DialSegment({
  label,
  color,
  dark,
  index,
  activeIndex,
}: {
  label: string;
  color: string;
  dark: boolean;
  index: number;
  activeIndex: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const active = activeIndex.value === index;
    return {
      backgroundColor: color,
      paddingVertical: withTiming(active ? 10 : 6, { duration: 100 }),
      transform: [{ scale: withTiming(active ? 1.06 : 1, { duration: 100 }) }],
    };
  });
  return (
    <Animated.View style={[styles.dialSegment, style]}>
      <Text style={[styles.dialSegmentLabel, { color: dark ? '#000000' : 'rgba(255,255,255,0.9)' }]}>{label}</Text>
    </Animated.View>
  );
}

function colorWithAlpha(hex: string, alpha: number): string {
  return `${hex}${alpha.toString(16).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  tile: {
    backgroundColor: '#22192e',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingVertical: 22,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 12,
  },
  iconDisk: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontFamily: fonts.regular, fontSize: 15, color: '#ffffff' },
  dial: {
    position: 'absolute',
    left: '50%',
    bottom: '100%',
    marginLeft: -66,
    marginBottom: spacing.md,
    width: 132,
    backgroundColor: '#0a070d',
    borderRadius: radii.lg,
    padding: 6,
    gap: 3,
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  dialSegment: {
    borderRadius: radii.md,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  dialSegmentLabel: { fontFamily: fonts.bold, fontSize: 13 },
});
