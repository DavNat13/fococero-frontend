// src/features/auth/hooks/useSession.ts

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../model/auth.store';
import { tokenUtils } from '../utils/token.utils';
import { getFirebaseAuth } from '@core/config/firebase.config';

import { usuarioApi } from '@entities/usuario';

const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 min

export const useSession = () => {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const setAuthData = useAuthStore((s) => s.setAuthData);
  const logout = useAuthStore((s) => s.logout);

  const [isVerifying, setIsVerifying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusRef = useRef(status);
  const userRef = useRef(user);
  statusRef.current = status;
  userRef.current = user;

  // Effect 1: Sincronización única al montar (sin firebaseToken en deps para evitar loop)
  useEffect(() => {
    if (!isHydrated) return;

    const syncSession = async () => {
      try {
        const currentStatus = useAuthStore.getState().status;
        const currentToken = useAuthStore.getState().firebaseToken;

        if (currentStatus === 'authenticated' && !tokenUtils.isValid(currentToken)) {
          logout();
          return;
        }

        if (currentStatus === 'authenticated') {
          const response = await usuarioApi.getMe();

          if (response.success) {
            const auth = getFirebaseAuth();
            const freshToken = await auth.currentUser?.getIdToken(true);
            setAuthData(response.data, freshToken || undefined);
          } else if (response.error?.code === 'UNAUTHORIZED') {
            logout();
          }
        }
      } catch (error) {
        const isDev =
          typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
        if (isDev) console.error('[useSession] Error sincronizando sesión:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    syncSession();
  }, [isHydrated, logout, setAuthData]);

  // Effect 2: Refresco periódico del token cada 30 min
  useEffect(() => {
    if (!isHydrated) return;

    intervalRef.current = setInterval(async () => {
      if (statusRef.current !== 'authenticated' || !userRef.current) return;
      try {
        const auth = getFirebaseAuth();
        if (!auth.currentUser) return;
        const currentToken = await auth.currentUser.getIdToken(false);
        if (tokenUtils.needsRefresh(currentToken)) {
          const freshToken = await auth.currentUser.getIdToken(true);
          setAuthData(userRef.current, freshToken);
        }
      } catch {
        // Si falla el refresh, el response interceptor manejará el 401
      }
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHydrated, status, user, setAuthData]);

  return {
    isReady: isHydrated,
    isAuthenticated: status === 'authenticated' || status === 'guest',
    isGuest: status === 'guest',
    isVerifying,
  };
};
