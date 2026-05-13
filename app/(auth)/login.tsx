import React, { useCallback } from 'react';
import { router } from 'expo-router';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLoginSubmit = useCallback(async (data: { rut: string; password: string }) => {
    clearError();
    const success = await login(data);
    if (success) {
      router.replace('/(brigadista)');
    }
  }, [login, clearError]);

  return (
    <AuthFormWidget
      initialMode="login"
      onSubmit={handleLoginSubmit}
      isLoading={isLoading}
      error={error ?? undefined}
    />
  );
}
