import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { auth } from './config';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// ─── Google Sign-In ───────────────────────────────────────────────────────────
export function useGoogleAuth() {
  // Fallback placeholder prevents expo-auth-session from throwing on web
  // when env vars aren't configured yet; actual sign-in will still fail gracefully.
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'not-configured',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'not-configured',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'not-configured',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      // On web, expo-auth-session may return access_token instead of id_token
      const { id_token, access_token } = response.params;
      const credential = GoogleAuthProvider.credential(
        id_token ?? null,
        access_token ?? null
      );
      if (auth) {
        signInWithCredential(auth, credential).catch(console.error);
      }
    }
  }, [response]);

  return { request, response, promptAsync };
}

// ─── Facebook Sign-In ─────────────────────────────────────────────────────────
export async function signInWithFacebook(accessToken: string): Promise<UserCredential> {
  const credential = FacebookAuthProvider.credential(accessToken);
  return signInWithCredential(auth, credential);
}

// ─── Apple Sign-In (iOS only) ─────────────────────────────────────────────────
export async function signInWithApple(): Promise<UserCredential | null> {
  if (Platform.OS !== 'ios') return null;
  try {
    const { appleAuth } = await import('@invertase/react-native-apple-authentication');
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const { identityToken, nonce } = appleAuthRequestResponse;
    if (!identityToken) throw new Error('Apple sign-in failed: no identity token');
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({ idToken: identityToken, rawNonce: nonce });
    return signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Apple sign-in error:', error);
    return null;
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
