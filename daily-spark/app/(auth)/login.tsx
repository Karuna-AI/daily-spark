import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGoogleAuth, signInWithApple } from '../../src/services/firebase/auth';
import { Colors } from '../../src/constants/colors';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { promptAsync, request } = useGoogleAuth();

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (e) {
      Alert.alert('Sign-in failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    setLoading(true);
    try {
      const result = await signInWithApple();
      if (!result) Alert.alert('Sign-in failed', 'Apple sign-in could not be completed.');
    } catch (e) {
      Alert.alert('Sign-in failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.brandIcon}>⚡</Text>
          <Text style={styles.brandName}>Daily Spark</Text>
          <Text style={styles.tagline}>3 amazing facts. Every day.</Text>
          <Text style={styles.taglineSub}>Positive. Surprising. Yours.</Text>
        </View>

        {/* Feature pills */}
        <View style={styles.featurePills}>
          {['🌍 Personalized topics', '🔔 3 daily sparks', '😮 Always positive'].map((f) => (
            <View key={f} style={styles.pill}>
              <Text style={styles.pillText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Auth Buttons */}
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={[styles.authBtn, styles.googleBtn]}
            onPress={handleGoogle}
            disabled={!request || loading}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.authBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.authBtn, styles.appleBtn]}
              onPress={handleApple}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
            >
              <Text style={styles.appleIcon}></Text>
              <Text style={[styles.authBtnText, { color: '#000' }]}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          {loading && <ActivityIndicator color={Colors.spark} style={{ marginTop: 16 }} />}
        </View>

        <Text style={styles.legal}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  brand: { alignItems: 'center', marginTop: 40 },
  brandIcon: { fontSize: 72, marginBottom: 12 },
  brandName: {
    color: Colors.textPrimary,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  tagline: {
    color: Colors.spark,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  taglineSub: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pill: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  authButtons: { width: '100%', gap: 12 },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 12,
  },
  googleBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  appleBtn: { backgroundColor: '#FFFFFF' },
  googleIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 20,
    color: '#000',
  },
  authBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  legal: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
