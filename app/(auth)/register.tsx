import { useAuthStore } from '@/features/auth';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { registerFormSchema } from '@/features/auth/model/auth.schemas';
import { AuthFormWidget } from '@/widgets/auth';
import { router } from 'expo-router';
import React, { useCallback } from 'react';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const {
    signIn: signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth();

  const handleRegisterSubmit = useCallback(
    async (data: { fullName: string; rut: string; phone: string; password: string }) => {
      clearError();
      const [nombre, ...apellidoArr] = data.fullName.split(' ');
      const apellido = apellidoArr.join(' ');

      const validation = registerFormSchema.safeParse({
        rut: data.rut,
        nombre,
        apellido: apellido || nombre,
        telefono: data.phone,
        password: data.password,
      });

      if (!validation.success) {
        const firstError = validation.error.issues[0];
        useAuthStore.setState({ error: firstError?.message ?? 'Datos inválidos' });
        return;
      }
      await register(validation.data);
    },
    [register, clearError],
  );

  return (
    <AuthFormWidget
      mode="register"
      onSubmit={handleRegisterSubmit}
      isLoading={isLoading}
      error={error ?? googleError ?? undefined}
      onGoogleSignIn={signInWithGoogle}
      isGoogleLoading={isGoogleLoading}
      onNavigateToLogin={() => router.push('/login')}
    />
  );
}
