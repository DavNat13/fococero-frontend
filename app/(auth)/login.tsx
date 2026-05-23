import React, { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';

export default function LoginScreen() {
  const { login, isLoading, error, clearError, status, user } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && user && !isLoading) {
      router.replace('/');
    }
  }, [status, user, isLoading]);

  const handleLoginSubmit = useCallback(async (data: { rut: string; password: string }) => {
    clearError();
    await login(data);
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

