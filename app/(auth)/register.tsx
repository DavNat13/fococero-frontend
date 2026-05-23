import React, { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError, status, user } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && user && !isLoading) {
      router.replace('/');
    }
  }, [status, user, isLoading]);

  const handleRegisterSubmit = useCallback(async (data: {
    fullName: string;
    rut: string;
    phone: string;
    password: string;
  }) => {
    clearError();
    const [nombre, ...apellidoArr] = data.fullName.split(' ');
    const apellido = apellidoArr.join(' ');

    await register({
      rut: data.rut,
      nombre,
      apellido,
      telefono: data.phone.replace('+56', ''),
    });
  }, [register, clearError]);

  return (
    <AuthFormWidget
      initialMode="register"
      onSubmit={handleRegisterSubmit}
      isLoading={isLoading}
      error={error ?? undefined}
    />
  );
}

