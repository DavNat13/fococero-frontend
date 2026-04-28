// src/features/auth/hooks/useSession.ts

import { useEffect, useState } from 'react';
import { useAuthStore } from '../model/auth.store';
import { tokenUtils } from '../utils/token.utils';

import { usuarioApi } from '@entities/usuario';

export const useSession = () => {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const status = useAuthStore((s) => s.status);
  const firebaseToken = useAuthStore((s) => s.firebaseToken);
  const { setAuthData, logout } = useAuthStore((s) => ({
    setAuthData: s.setAuthData,
    logout: s.logout,
  }));

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const syncSession = async () => {
      try {
        if (status === 'authenticated' && !tokenUtils.isValid(firebaseToken)) {
          logout();
          return;
        }

        if (status === 'authenticated') {
          const response = await usuarioApi.getMe();

          if (response.success) {
            setAuthData(response.data);
          } else if (response.error?.code === 'UNAUTHORIZED') {
            logout();
          }
        }
      } finally {
        setIsVerifying(false);
      }
    };

    syncSession();
  }, [isHydrated, status, firebaseToken, setAuthData, logout]);

  return {
    isReady: isHydrated,
    isAuthenticated: status === 'authenticated' || status === 'guest',
    isGuest: status === 'guest',
    isVerifying,
  };
};
