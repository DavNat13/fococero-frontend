// src/features/auth/hooks/useGoogleAuth.ts
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import * as Google from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { ENV } from '@core/config/env.config';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../model/auth.store';

WebBrowser.maybeCompleteAuthSession();

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

  const clientId = ENV.EXPO_PUBLIC_FIREBASE_CLIENT_ID || ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
  const config = {
    clientId,
    scopes: ['profile', 'email'],
  };

  // @ts-expect-error - expo-auth-session types are inconsistent
  const [, , promptAsync] = Google.useAuthRequest(config);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await promptAsync();

      if (result?.type === 'success') {
        const { access_token } = result.params;

        const apiResponse = await authApi.registerGoogle({ googleToken: access_token });

        if (apiResponse.success && apiResponse.data) {
          setAuthData(apiResponse.data, access_token);
          router.replace('/(brigadista)');
        } else {
          setError('Error al conectar con Google');
        }
      } else if (result?.type === 'cancel') {
        setError('Inicio de sesión cancelado');
      }
    } catch {
      setError('Error de conexión con Google');
    } finally {
      setIsLoading(false);
    }
  }, [promptAsync, setAuthData]);

  const signOut = useCallback(async () => {
    // Google Sign-Out logic if needed
  }, []);

  return { signIn, signOut, isLoading, error };
};
