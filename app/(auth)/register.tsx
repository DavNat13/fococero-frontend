import React, { useCallback } from 'react';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();

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
      rut: data.rut as any,
      nombre,
      apellido,
      telefono: data.phone,
      token: data.password,
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

