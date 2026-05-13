import React, { useCallback } from 'react';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();

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

