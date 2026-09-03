import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/auth-context';

export default function AppLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding-choice" />
      <Stack.Screen name="onboarding-partner-stub" />
      <Stack.Screen
        name="check-in"
        options={{ presentation: 'modal', headerShown: true, title: 'Daily check-in' }}
      />
    </Stack>
  );
}
