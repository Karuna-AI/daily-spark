import { useEffect, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useAuthListener, useAuth } from '../src/hooks/useAuth';
import { useNotificationDeepLink } from '../src/hooks/useNotifications';
import '../src/services/firebase/config'; // Initialize Firebase

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { user, profile, isInitialized } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // Not logged in → send to login
      if (!inAuthGroup) router.replace('/(auth)/login');
    } else if (!profile?.onboardingComplete) {
      // Logged in but no topics set → send to onboarding
      router.replace('/(auth)/welcome');
    } else {
      // Fully onboarded → send to app
      if (inAuthGroup) router.replace('/(app)');
    }
  }, [user, profile, isInitialized]);

  return null;
}

export default function RootLayout() {
  useAuthListener(); // Start Firebase auth state observer

  const router = useRouter();

  useNotificationDeepLink((sparkId) => {
    // Navigate to home when notification tapped; app will highlight that spark
    router.push('/(app)');
  });

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <StatusBar style="light" backgroundColor="#0D0D1A" />
      <AuthGate />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D1A' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D1A' },
});
