import { Stack, router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth';

export default function AuthLayout() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    if ((status === 'authenticated' || status === 'guest') && user) {
      router.dismissAll();
    }
  }, [status, user]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontFamily: 'Inter', fontWeight: '600', fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#020617' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="register" options={{ title: 'Crear Cuenta' }} />
      <Stack.Screen name="guest" options={{ title: 'Modo Despliegue Rápido' }} />
    </Stack>
  );
}
