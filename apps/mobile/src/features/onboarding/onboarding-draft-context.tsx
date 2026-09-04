import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

export interface OnboardingDraft {
  name: string;
  purpose: 'hack_cycle' | 'support_partner' | undefined;
  cycleLength: number;
  periodLength: number;
  symptoms: string[];
  goals: string[];
}

const DEFAULT_DRAFT: OnboardingDraft = {
  name: '',
  purpose: undefined,
  cycleLength: 28,
  periodLength: 5,
  symptoms: [],
  goals: [],
};

interface OnboardingDraftContextValue {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  toggleSymptom: (symptom: string) => void;
  toggleGoal: (goal: string) => void;
}

const OnboardingDraftContext = createContext<OnboardingDraftContextValue | undefined>(undefined);

export function OnboardingDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<OnboardingDraft>(DEFAULT_DRAFT);

  const value = useMemo<OnboardingDraftContextValue>(
    () => ({
      draft,
      update: (patch) => setDraft((prev) => ({ ...prev, ...patch })),
      toggleSymptom: (symptom) =>
        setDraft((prev) => ({
          ...prev,
          symptoms: prev.symptoms.includes(symptom)
            ? prev.symptoms.filter((s) => s !== symptom)
            : [...prev.symptoms, symptom],
        })),
      toggleGoal: (goal) =>
        setDraft((prev) => ({
          ...prev,
          goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
        })),
    }),
    [draft],
  );

  return <OnboardingDraftContext.Provider value={value}>{children}</OnboardingDraftContext.Provider>;
}

export function useOnboardingDraft(): OnboardingDraftContextValue {
  const context = useContext(OnboardingDraftContext);
  if (!context) throw new Error('useOnboardingDraft must be used within OnboardingDraftProvider');
  return context;
}
