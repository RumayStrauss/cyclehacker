import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { CalendarTabIcon, CycleTabIcon, HacksTabIcon, PatternsTabIcon, PlusIcon } from '@/features/home/tab-icons';
import { colors, fonts } from '@/theme';

function FloatingCheckInButton() {
  return (
    <View style={styles.floatingWrap} pointerEvents="box-none">
      <Pressable style={styles.floatingButton} onPress={() => router.push('/(app)/check-in')}>
        <PlusIcon />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontFamily: fonts.regular, fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Cycle', tabBarIcon: ({ color }) => <CycleTabIcon color={String(color)} /> }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ title: 'Calendar', tabBarIcon: ({ color }) => <CalendarTabIcon color={String(color)} /> }}
      />
      <Tabs.Screen
        name="check-in-launcher"
        options={{
          title: '',
          tabBarButton: () => <FloatingCheckInButton />,
        }}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />
      <Tabs.Screen
        name="patterns"
        options={{ title: 'Patterns', tabBarIcon: ({ color }) => <PatternsTabIcon color={String(color)} /> }}
      />
      <Tabs.Screen name="hacks" options={{ title: 'Hacks', tabBarIcon: ({ color }) => <HacksTabIcon color={String(color)} /> }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.navBackground,
    borderTopColor: colors.border,
    height: 82,
    paddingTop: 6,
  },
  floatingWrap: { flex: 1, alignItems: 'center' },
  floatingButton: {
    position: 'absolute',
    top: -28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
