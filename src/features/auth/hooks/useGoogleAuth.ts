import { useState, useCallback } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { ENV } from '@core/config/env.config';
import { getFirebaseAuth } from '@core/config/firebase.config';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../model/auth.store';
import type { ApiFailure } from '@core/api';

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

interface UseGoogleAuthReturn {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthData } = useAuthStore();

  const webClientId = ENV.EXPO_PUBLIC_FIREBASE_CLIENT_ID || ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
  const hasClientId = webClientId.length > 0;

  const signIn = useCallback(async () => {
    if (!hasClientId) {
      setError('Google Sign-In no está configurado. Revisa EXPO_PUBLIC_FIREBASE_CLIENT_ID en .env');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      GoogleSignin.configure({
        webClientId,
        offlineAccess: false,
      });

      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      if (isDev) console.log('[GoogleAuth] Result:', JSON.stringify(result, null, 2));

      if (result.type === 'cancelled') {
        setError('Inicio de sesión cancelado');
        return;
      }

      const idToken = result.data.idToken;
      if (!idToken) {
        setError('No se pudo obtener el token de Google');
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const auth = getFirebaseAuth();
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseToken = await userCredential.user.getIdToken();
      if (isDev) console.log('[GoogleAuth] Firebase token obtenido, llamando API...');

      // Setear token en el store ANTES del API call para que el interceptor
      // agregue el Authorization header (el store se lee sincrónicamente en api.interceptors.ts:23)
      useAuthStore.setState({ firebaseToken });

      const apiResponse = await authApi.registerGoogle({ googleToken: firebaseToken });
      if (isDev) console.log('[GoogleAuth] Respuesta API:', JSON.stringify(apiResponse, null, 2));

      if (!apiResponse.success) {
        useAuthStore.setState({ firebaseToken: null });
        const msg = (apiResponse as ApiFailure).error?.message || 'Error al conectar con Google';
        if (isDev) console.error('[GoogleAuth] API error:', msg);
        setError(msg);
      } else if (apiResponse.data?.usuario) {
        // Force refresh ID token to pick up custom claims (rol) set by backend
        const refreshedToken = await userCredential.user.getIdToken(true);
        setAuthData(apiResponse.data.usuario, refreshedToken);
        if (__DEV__) {
          console.log(
            '[GoogleAuth] usuario recibido:',
            JSON.stringify(apiResponse.data?.usuario, null, 2),
          );
          console.log(
            '[GoogleAuth] estado del store tras login:',
            JSON.stringify(useAuthStore.getState().user, null, 2),
          );
        }
      } else {
        useAuthStore.setState({ firebaseToken: null });
        setError('Error al conectar con Google');
      }
    } catch (err: any) {
      if (err.code === statusCodes.IN_PROGRESS) {
        if (isDev) console.log('[GoogleAuth] Operación en progreso');
        setError('Inicio de sesión en progreso');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        if (isDev) console.error('[GoogleAuth] Play Services no disponible');
        setError('Google Play Services no está disponible');
      } else {
        if (isDev) console.error('[GoogleAuth] Error capturado:', err);
        setError('Error al iniciar sesión con Google');
      }
    } finally {
      setIsLoading(false);
    }
  }, [webClientId, setAuthData, hasClientId]);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch (err) {
      if (isDev) console.error('[useGoogleAuth] Error en signOut:', err);
    }
  }, []);

  return { signIn, signOut, isLoading, error };
};
