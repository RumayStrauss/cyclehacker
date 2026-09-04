import { deleteOwnAccount } from '@cyclehacker/supabase-client';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radii, spacing } from '@/theme';

export default function Settings() {
  const { session } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and everything logged in it. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
      ],
    );
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await deleteOwnAccount(supabase);
      await supabase.auth.signOut();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <Text style={styles.email}>{session?.user.email ?? session?.user.phone}</Text>

      <Pressable style={styles.row} onPress={() => router.push('/(app)/onboarding-partner-stub')}>
        <Text style={styles.rowText}>Partner sharing</Text>
      </Pressable>

      <Pressable style={styles.row} onPress={handleSignOut}>
        <Text style={styles.rowText}>Sign out</Text>
      </Pressable>

      <Pressable style={styles.dangerRow} onPress={confirmDeleteAccount} disabled={isDeleting}>
        {isDeleting ? (
          <ActivityIndicator color={colors.danger} />
        ) : (
          <Text style={styles.dangerText}>Delete account</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
  backButton: { marginBottom: spacing.lg },
  email: { fontFamily: fonts.regular, fontSize: 16, color: colors.textSecondary, marginBottom: spacing.lg },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowText: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  dangerRow: {
    marginTop: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  dangerText: { fontFamily: fonts.bold, fontSize: 15, color: colors.danger },
});
