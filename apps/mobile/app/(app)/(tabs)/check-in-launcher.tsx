import { Redirect } from 'expo-router';

/** Never actually navigated to: the tab bar's floating "+" button intercepts
 * its own press (see (tabs)/_layout.tsx) and pushes the check-in modal
 * directly. This file only exists so expo-router has a route to attach the
 * custom tabBarButton to. */
export default function CheckInLauncher() {
  return <Redirect href="/(app)/(tabs)" />;
}
