import { createOwnCycleProfile } from '@cyclehacker/supabase-client';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radii, spacing } from '@/theme';

export default function OnboardingChoice() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  async function handleTrackOwnCycle() {
    if (!session) return;
    setIsCreatingProfile(true);
    try {
      await createOwnCycleProfile(supabase, { userId: session.user.id, name: 'Me' });
      await queryClient.invalidateQueries({ queryKey: ['own-profile', session.user.id] });
      router.replace('/(app)/(tabs)');
    } finally {
      setIsCreatingProfile(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How would you like to start?</Text>
      <Pressable style={styles.card} onPress={handleTrackOwnCycle} disabled={isCreatingProfile}>
        {isCreatingProfile ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Text style={styles.cardTitle}>I'm tracking my own cycle</Text>
            <Text style={styles.cardBody}>
              Log periods, symptoms, and mood, and get daily phase-based guidance.
            </Text>
          </>
        )}
      </Pressable>
      <Pressable
        style={styles.card}
        onPress={() => router.push('/(app)/onboarding-partner-stub')}
        disabled={isCreatingProfile}
      >
        <Text style={styles.cardTitle}>I want to support someone</Text>
        <Text style={styles.cardBody}>Start tracking for a partner, even before they've signed up.</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 88,
    justifyContent: 'center',
  },
  cardTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, marginBottom: spacing.xs },
  cardBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
});
