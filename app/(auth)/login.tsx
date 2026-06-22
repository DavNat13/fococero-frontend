import { loginSchema, useAuthStore } from '@/features/auth';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { AuthFormWidget } from '@/widgets/auth';
import React, { useCallback } from 'react';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const {
    signIn: signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth();

  const handleLoginSubmit = useCallback(
    async (data: { rut: string; password: string }) => {
      clearError();
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        const firstError = validation.error.issues[0];
        useAuthStore.setState({ error: firstError?.message ?? 'Datos inválidos' });
        return;
      }
      await login(validation.data);
    },
    [login, clearError],
  );

  return (
    <AuthFormWidget
      mode="login"
      onSubmit={handleLoginSubmit}
      isLoading={isLoading}
      error={error ?? googleError ?? undefined}
      onGoogleSignIn={signInWithGoogle}
      isGoogleLoading={isGoogleLoading}
    />
  );
}
