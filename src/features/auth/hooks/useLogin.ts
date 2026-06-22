// src/features/auth/hooks/useLogin.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthActions } from '../model/auth.selectors';
import { RegisterFormData } from '../model/auth.schemas';
import { authOfflineStrategy } from '../offline-strategy';
import { ApiErrorDetail } from '@core/api/api.types';

type LoginStatus = 'idle' | 'submitting' | 'success' | 'error';

export const useLogin = () => {
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const { setAuthData } = useAuthActions();

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const loginAsGuest = useCallback(
    async (data: RegisterFormData): Promise<boolean> => {
      if (status === 'submitting') return false;

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setStatus('submitting');
      setError(null);

      const response = await authApi.registerGuest(data);

      if (response.success) {
        setAuthData(response.data.usuario, response.data.firebaseToken);
        setStatus('success');
        return true;
      }

      if (response.error?.code === 'NETWORK_ERROR') {
        console.info('[useLogin] Activando protocolo offline: Creando identidad optimista.');

        const optimisticUser = authOfflineStrategy.createOptimisticUser(data);

        setAuthData(optimisticUser);

        await authOfflineStrategy.queueRegister(data);

        setStatus('success');
        return true;
      }

      handleAuthError(response.error);
      setStatus('error');
      return false;
    },
    [status, setAuthData],
  );

  const handleAuthError = (apiError?: ApiErrorDetail) => {
    if (!apiError) return setError('Error interno inesperado.');

    const errorMap: Record<string, string> = {
      NETWORK_ERROR: 'Sin conexión. El registro se completará cuando recuperes señal.',
      VALIDATION_ERROR: 'El RUT o el teléfono no cumplen con el formato oficial.',
      CONTRACT_BREACH: 'Inconsistencia de datos con el servidor. Reporte este error.',
      UNAUTHORIZED: 'Credenciales inválidas o sesión expirada.',
    };

    setError(errorMap[apiError.code] || apiError.message || 'Error en la autenticación.');
  };

  return {
    isLoading: status === 'submitting',
    isSuccess: status === 'success',
    error,
    loginAsGuest,
    reset: () => {
      setStatus('idle');
      setError(null);
    },
  };
};
