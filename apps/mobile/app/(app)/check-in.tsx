import type { FlowLevel, SymptomIntensity, SymptomType } from '@cyclehacker/supabase-client';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { AllSymptomsList } from '@/features/check-in/AllSymptomsList';
import { MoodTapRow } from '@/features/check-in/MoodTapRow';
import { QuickAccessGrid } from '@/features/check-in/QuickAccessGrid';
import { useSaveCheckIn } from '@/features/check-in/useSaveCheckIn';
import { OnboardingFooter, OnboardingScreen, PrimaryButton } from '@/features/onboarding/OnboardingKit';
import { useOwnProfile } from '@/lib/use-own-profile';
import { colors, fonts } from '@/theme';

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
    <OnboardingScreen
      footer={
        <OnboardingFooter>
          {saveCheckIn.isError ? <Text style={{ color: colors.danger, fontFamily: fonts.regular, fontSize: 13 }}>Something went wrong. Try again.</Text> : null}
          <PrimaryButton label="Done" onPress={handleDone} loading={saveCheckIn.isPending} />
        </OnboardingFooter>
      }
    >
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, marginBottom: 14 }} />
        <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.text }}>Daily check-in</Text>
      </View>

      <QuickAccessGrid
        flowLevel={flowLevel}
        onFlowLevelChange={setFlowLevel}
        intensities={intensities}
        onSetIntensity={setIntensity}
      />
      <AllSymptomsList intensities={intensities} onSetIntensity={setIntensity} />
      <MoodTapRow value={mood} onChange={setMood} />
    </OnboardingScreen>
  );
}
