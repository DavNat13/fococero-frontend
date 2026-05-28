import React, { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthFormWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';
import { registerFormSchema } from '@/features/auth/model/auth.schemas';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError, status, user } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && user && !isLoading) {
      router.replace('/');
    }
  }, [status, user, isLoading]);

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
      });

      if (!validation.success) {
        const firstError = validation.error.issues[0];
        Alert.alert('Error de validación', firstError?.message ?? 'Datos inválidos');
        return;
      }
      await register(validation.data);
    },
    [register, clearError],
  );

  return (
    <AuthFormWidget
      initialMode="register"
      onSubmit={handleRegisterSubmit}
      isLoading={isLoading}
      error={error ?? undefined}
    />
  );
}
