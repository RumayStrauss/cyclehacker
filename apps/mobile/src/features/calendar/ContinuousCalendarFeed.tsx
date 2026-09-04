import { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from 'react-native';
import { fonts, phaseColors } from '@/theme';
import type { CalendarDayClassification } from './classify-date';
import { monthLabel, toISODate } from './date-utils';
import type { CalendarWeek } from './useCalendarFeedData';

const CELL_SIZE = 34;
const ROW_GAP = 5;

function hexAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

interface DayCellProps {
  date: Date;
  classification: CalendarDayClassification;
  isToday: boolean;
  onPress: (iso: string) => void;
}

function DayCell({ date, classification, isToday, onPress }: DayCellProps) {
  const { phase, isPeriodLogged, isPredictedPeriod, isPredictedOvulation } = classification;
  const background = phase ? hexAlpha(phaseColors[phase], '1f') : 'transparent';

  let ringStyle = {};
  let numberColor = '#ffffff';
  let numberWeight: 'bold' | 'normal' = 'normal';

  if (isPeriodLogged) {
    ringStyle = { backgroundColor: phaseColors.menstrual };
    numberWeight = 'bold';
  } else if (isPredictedPeriod) {
    ringStyle = { borderWidth: 1.5, borderColor: phaseColors.menstrual };
  } else if (isPredictedOvulation) {
    ringStyle = { borderWidth: 1.5, borderColor: phaseColors.ovulatory, backgroundColor: hexAlpha(phaseColors.ovulatory, '33') };
  }

  const day = date.getUTCDate();
  const iso = toISODate(date);

  return (
    <Pressable style={[styles.cellOuter, { backgroundColor: background }]} onPress={() => onPress(iso)}>
      <View style={[styles.cellInner, ringStyle, isToday && styles.todayRing]}>
        {day === 1 ? <Text style={styles.monthTag}>{monthLabel(date).slice(0, 3).toUpperCase()}</Text> : null}
        <Text
          style={[styles.dayNumber, { color: numberColor, fontFamily: numberWeight === 'bold' ? fonts.bold : fonts.regular }]}
        >
          {day}
        </Text>
      </View>
    </Pressable>
  );
}

interface WeekRowProps {
  week: CalendarWeek;
  classify: (date: Date) => CalendarDayClassification;
  todayISO: string;
  onDayPress: (iso: string) => void;
}

function WeekRow({ week, classify, todayISO, onDayPress }: WeekRowProps) {
  return (
    <View style={styles.weekRow}>
      {week.days.map((date) => (
        <DayCell
          key={toISODate(date)}
          date={date}
          classification={classify(date)}
          isToday={toISODate(date) === todayISO}
          onPress={onDayPress}
        />
      ))}
    </View>
  );
}

interface ContinuousCalendarFeedProps {
  weeks: CalendarWeek[];
  classify: (date: Date) => CalendarDayClassification;
  onDayPress: (iso: string) => void;
}

export function ContinuousCalendarFeed({ weeks, classify, onDayPress }: ContinuousCalendarFeedProps) {
  const todayISO = useRef(toISODate(new Date())).current;
  const [visibleMonth, setVisibleMonth] = useState(() => monthLabel(new Date()));

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as CalendarWeek | undefined;
    if (first) setVisibleMonth(monthLabel(first.days[3]!));
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 20 }).current;

  return (
    <View style={styles.container}>
      <View style={styles.monthPillWrap}>
        <View style={styles.monthPill}>
          <Text style={styles.monthPillText}>{visibleMonth}</Text>
        </View>
      </View>

      <View style={styles.weekdayRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => (
          <Text key={i} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      <FlatList
        data={weeks}
        keyExtractor={(week) => week.key}
        renderItem={({ item }) => <WeekRow week={item} classify={classify} todayISO={todayISO} onDayPress={onDayPress} />}
        initialNumToRender={12}
        windowSize={7}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  monthPillWrap: { alignItems: 'center', paddingVertical: 10 },
  monthPill: { backgroundColor: '#22192e', borderRadius: 11, paddingHorizontal: 12, paddingVertical: 4 },
  monthPillText: { fontFamily: fonts.bold, fontSize: 12, color: '#ffffff', letterSpacing: 0.5 },
  weekdayRow: { flexDirection: 'row', marginBottom: 6 },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  weekRow: { flexDirection: 'row', gap: 2, marginBottom: ROW_GAP },
  cellOuter: { flex: 1, borderRadius: 14, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  cellInner: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayRing: { borderWidth: 2, borderColor: '#ffffff' },
  monthTag: {
    position: 'absolute',
    top: -2,
    fontFamily: fonts.bold,
    fontSize: 8,
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.5)',
  },
  dayNumber: { fontSize: 15 },
});
