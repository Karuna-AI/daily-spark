import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { createOrUpdateUser, getUserProfile } from '../services/firebase/user';
import { useAuthStore } from '../stores/authStore';

export function useAuthListener() {
  const { setUser, setProfile, setInitialized, reset } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await createOrUpdateUser(firebaseUser);
          const profile = await getUserProfile(firebaseUser.uid);
          setProfile(profile);
        } catch (err) {
          console.error('Error loading user profile:', err);
        }
        setInitialized();
      } else {
        reset();
      }
    });

    return unsubscribe;
  }, []);
}

export function useAuth() {
  return useAuthStore();
}
