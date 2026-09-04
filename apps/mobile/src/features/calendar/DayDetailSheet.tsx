import { listSymptomsForDate } from '@cyclehacker/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { SYMPTOM_LABELS } from '@/features/check-in/symptom-taxonomy';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radii, spacing } from '@/theme';

interface DayDetailSheetProps {
  profileId: string | undefined;
  date: string | null;
  onClose: () => void;
}

function isToday(date: string): boolean {
  return date === new Date().toISOString().slice(0, 10);
}

export function DayDetailSheet({ profileId, date, onClose }: DayDetailSheetProps) {
  const symptomsQuery = useQuery({
    queryKey: ['symptoms-for-date', profileId, date],
    queryFn: () => listSymptomsForDate(supabase, profileId!, date!),
    enabled: Boolean(profileId && date),
  });

  const labels = (symptomsQuery.data ?? []).map((row) => SYMPTOM_LABELS[row.type]);

  return (
    <Modal visible={Boolean(date)} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{date}</Text>
          {labels.length > 0 ? (
            <Text style={styles.body}>Symptoms logged: {labels.join(', ')}</Text>
          ) : (
            <Text style={styles.body}>Nothing logged for this day.</Text>
          )}
          {date && isToday(date) ? (
            <Pressable
              style={styles.button}
              onPress={() => {
                onClose();
                router.push('/(app)/check-in');
              }}
            >
              <Text style={styles.buttonText}>Edit today's check-in</Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
  },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginBottom: spacing.sm },
  body: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, marginBottom: spacing.md },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  buttonText: { color: colors.onPrimary, fontFamily: fonts.bold, fontSize: 15 },
});
