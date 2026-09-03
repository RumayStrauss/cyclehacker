import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DayDetailSheet } from '@/features/calendar/DayDetailSheet';
import { MonthCalendar } from '@/features/calendar/MonthCalendar';
import { useCalendarData } from '@/features/calendar/useCalendarData';
import { useOwnProfile } from '@/lib/use-own-profile';
import { colors } from '@/theme';

export default function CalendarScreen() {
  const { data: profile } = useOwnProfile();
  const { markedDates } = useCalendarData(profile?.id);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <MonthCalendar markedDates={markedDates} onDayPress={setSelectedDate} />
      <DayDetailSheet profileId={profile?.id} date={selectedDate} onClose={() => setSelectedDate(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
