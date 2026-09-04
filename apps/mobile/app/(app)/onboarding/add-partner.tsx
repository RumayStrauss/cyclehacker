import { createOwnCycleProfile, updateOwnUserName } from '@cyclehacker/supabase-client';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { OnboardingFooter, OnboardingScreen, PrimaryButton, SecondaryButton } from '@/features/onboarding/OnboardingKit';
import { useOnboardingDraft } from '@/features/onboarding/onboarding-draft-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { colors, fonts } from '@/theme';

export default function AddPartner() {
  const { session } = useAuth();
  const { draft } = useOnboardingDraft();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function finishOnboarding() {
    if (!session) return;
    setIsSubmitting(true);
    try {
      await updateOwnUserName(supabase, session.user.id, draft.name);
      await createOwnCycleProfile(supabase, {
        userId: session.user.id,
        name: 'Me',
        initialCycleLengthEstimate: draft.cycleLength,
        initialPeriodLengthEstimate: draft.periodLength,
        typicalSymptoms: draft.symptoms,
        goals: draft.goals,
      });
      await queryClient.invalidateQueries({ queryKey: ['own-profile', session.user.id] });
      router.replace('/(app)/(tabs)');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSendInvite() {
    Alert.alert('Coming soon', 'Partner invites are on the way. You can invite a partner later from Settings.', [
      { text: 'OK', onPress: finishOnboarding },
    ]);
  }

  return (
    <OnboardingScreen
      center
      footer={
        <OnboardingFooter>
          <SecondaryButton label="Skip" onPress={finishOnboarding} disabled={isSubmitting} />
        </OnboardingFooter>
      }
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text, textAlign: 'center' }}>
        Invite a partner
      </Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.text, textAlign: 'center' }}>
        Let your partner know what you need even before you need it.
      </Text>
      <PrimaryButton label="Send invite" onPress={handleSendInvite} loading={isSubmitting} />
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: 'center' }}>
        Privacy disclaimer: You can configure what data they can and cannot see.
      </Text>
    </OnboardingScreen>
  );
}
