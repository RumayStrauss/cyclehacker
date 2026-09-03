import type { FlowLevel, SymptomType } from '@cyclehacker/supabase-client';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { FlowSelector } from '@/features/check-in/FlowSelector';
import { MoodTapRow } from '@/features/check-in/MoodTapRow';
import { SymptomChipGrid } from '@/features/check-in/SymptomChipGrid';
import { useSaveCheckIn } from '@/features/check-in/useSaveCheckIn';
import { useOwnProfile } from '@/lib/use-own-profile';
import { colors, radii, spacing } from '@/theme';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CheckIn() {
  const { data: profile } = useOwnProfile();
  const saveCheckIn = useSaveCheckIn(profile?.id);

  const [flowLevel, setFlowLevel] = useState<FlowLevel | undefined>(undefined);
  const [mood, setMood] = useState<number | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<SymptomType[]>([]);

  async function handleDone() {
    await saveCheckIn.mutateAsync({ date: today(), flowLevel, mood, symptoms });
    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Everything here is optional. Log what feels relevant today.</Text>

      <FlowSelector value={flowLevel} onChange={setFlowLevel} />
      <MoodTapRow value={mood} onChange={setMood} />
      <SymptomChipGrid value={symptoms} onChange={setSymptoms} />

      {saveCheckIn.isError ? <Text style={styles.error}>Something went wrong. Try again.</Text> : null}

      <Pressable style={styles.button} onPress={handleDone} disabled={saveCheckIn.isPending}>
        {saveCheckIn.isPending ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={styles.buttonText}>Done</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.sm },
  error: { color: colors.danger },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.surface, fontSize: 16, fontWeight: '600' },
});
