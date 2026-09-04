import { Tabs } from 'expo-router';
import { colors, fonts } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.navBackground, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.regular, fontSize: 10 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Cycle' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
