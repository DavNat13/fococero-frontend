import React, { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore, loginSchema } from '@/features/auth';

export default function LoginScreen() {
  const { login, isLoading, error, clearError, status, user } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && user && !isLoading) {
      router.replace('/');
    }
  }, [status, user, isLoading]);

  const handleLoginSubmit = useCallback(
    async (data: { rut: string; password: string }) => {
      clearError();
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        const firstError = validation.error.issues[0];
        Alert.alert('Error de validación', firstError?.message ?? 'Datos inválidos');
        return;
      }
      await login(validation.data);
    },
    [login, clearError],
  );

  return (
    <AuthFormWidget
      initialMode="login"
      onSubmit={handleLoginSubmit}
      isLoading={isLoading}
      error={error ?? undefined}
    />
  );
}
