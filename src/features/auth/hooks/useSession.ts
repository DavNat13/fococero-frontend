// src/features/auth/hooks/useSession.ts

import { useEffect, useState } from 'react';
import { useAuthStore } from '../model/auth.store';
import { authApi } from '../api/auth.api';
import { tokenUtils } from '../utils/token.utils';

export const useSession = () => {
  // El store ya maneja la hidratación internamente
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const status = useAuthStore((s) => s.status);
  const firebaseToken = useAuthStore((s) => s.firebaseToken);
  const { setAuthData, logout } = useAuthStore((s) => ({
    setAuthData: s.setAuthData,
    logout: s.logout,
  }));

  // Estado local para saber si el chequeo de red (opcional) terminó
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Si no ha terminado de leer MMKV, no podemos decidir nada
    if (!isHydrated) return;

    const syncSession = async () => {
      try {
        if (status === 'authenticated' && !tokenUtils.isValid(firebaseToken)) {
          logout();
          return;
        }

        if (status === 'authenticated') {
          const response = await authApi.getProfile();

          if (response.success) {
            setAuthData(response.data);
          } else if (response.error?.code === 'UNAUTHORIZED') {
            // El servidor dice que el token ya no vale (revocado)
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
    isVerifying, // Útil si queremos mostrar un spinner sutil de "sincronizando..."
  };
};
