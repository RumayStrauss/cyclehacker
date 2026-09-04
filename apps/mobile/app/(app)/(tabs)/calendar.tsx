import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarLegend } from '@/features/calendar/CalendarLegend';
import { ContinuousCalendarFeed } from '@/features/calendar/ContinuousCalendarFeed';
import { DayDetailSheet } from '@/features/calendar/DayDetailSheet';
import { useCalendarFeedData } from '@/features/calendar/useCalendarFeedData';
import { useOwnProfile } from '@/lib/use-own-profile';
import { colors, fonts, spacing } from '@/theme';

export default function CalendarScreen() {
  const { data: profile } = useOwnProfile();
  const { weeks, classify } = useCalendarFeedData(profile?.id);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <View style={styles.legendBar}>
        <CalendarLegend />
      </View>
      <View style={styles.feed}>
        <ContinuousCalendarFeed weeks={weeks} classify={classify} onDayPress={setSelectedDate} />
      </View>
      <DayDetailSheet profileId={profile?.id} date={selectedDate} onClose={() => setSelectedDate(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  legendBar: { borderBottomWidth: 1, borderBottomColor: colors.border },
  feed: { flex: 1, paddingHorizontal: 16 },
});
