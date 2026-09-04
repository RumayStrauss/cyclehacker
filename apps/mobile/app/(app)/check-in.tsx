import type { FlowLevel, SymptomIntensity, SymptomType } from '@cyclehacker/supabase-client';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AllSymptomsList } from '@/features/check-in/AllSymptomsList';
import { MoodTapRow } from '@/features/check-in/MoodTapRow';
import { QuickAccessGrid } from '@/features/check-in/QuickAccessGrid';
import { useSaveCheckIn } from '@/features/check-in/useSaveCheckIn';
import { useOwnProfile } from '@/lib/use-own-profile';
import { colors, fonts, radii, spacing } from '@/theme';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CheckIn() {
  const { data: profile } = useOwnProfile();
  const saveCheckIn = useSaveCheckIn(profile?.id);

  const [flowLevel, setFlowLevel] = useState<FlowLevel | undefined>(undefined);
  const [mood, setMood] = useState<number | undefined>(undefined);
  const [intensities, setIntensities] = useState<Partial<Record<SymptomType, SymptomIntensity>>>({});

  function setIntensity(type: SymptomType, intensity: SymptomIntensity | undefined) {
    setIntensities((prev) => {
      const next = { ...prev };
      if (intensity === undefined) delete next[type];
      else next[type] = intensity;
      return next;
    });
  }

  async function handleDone() {
    const symptoms = Object.entries(intensities).map(([type, intensity]) => ({
      type: type as SymptomType,
      intensity: intensity as SymptomIntensity,
    }));
    await saveCheckIn.mutateAsync({ date: today(), flowLevel, mood, symptoms });
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dragHandle} />
        <Text style={styles.headerTitle}>Daily check-in</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <QuickAccessGrid
          flowLevel={flowLevel}
          onFlowLevelChange={setFlowLevel}
          intensities={intensities}
          onSetIntensity={setIntensity}
        />
        <AllSymptomsList intensities={intensities} onSetIntensity={setIntensity} />
        <MoodTapRow value={mood} onChange={setMood} />
      </ScrollView>

      <LinearGradient colors={['rgba(22,17,29,0)', 'rgba(22,17,29,0.95)']} style={styles.footerFade} pointerEvents="none" />
      <View style={styles.footer}>
        {saveCheckIn.isError ? <Text style={styles.error}>Something went wrong. Try again.</Text> : null}
        <Pressable style={styles.button} onPress={handleDone} disabled={saveCheckIn.isPending}>
          {saveCheckIn.isPending ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Done</Text>
          )}
        </Pressable>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingTop: 10 },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, marginBottom: 14 },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.text,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
    textAlign: 'center',
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xl, paddingBottom: 120 },
  footerFade: { position: 'absolute', left: 0, right: 0, bottom: 88, height: 40 },
  footer: { paddingHorizontal: spacing.md, alignItems: 'center', gap: spacing.sm, backgroundColor: colors.background },
  error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 13 },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontFamily: fonts.regular },
  homeIndicator: { width: 120, height: 5, borderRadius: 100, backgroundColor: colors.text, marginTop: 8, marginBottom: 8 },
});
