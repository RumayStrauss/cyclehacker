import { Calendar, type DateData } from 'react-native-calendars';
import { colors } from '@/theme';
import type { CalendarMark } from './useCalendarData';

interface MonthCalendarProps {
  markedDates: Record<string, CalendarMark>;
  onDayPress: (date: string) => void;
}

export function MonthCalendar({ markedDates, onDayPress }: MonthCalendarProps) {
  return (
    <Calendar
      markedDates={markedDates}
      onDayPress={(day: DateData) => onDayPress(day.dateString)}
      theme={{
        selectedDayBackgroundColor: colors.primary,
        todayTextColor: colors.primary,
        arrowColor: colors.primary,
        dotColor: colors.primary,
      }}
    />
  );
}
