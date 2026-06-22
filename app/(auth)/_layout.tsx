import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
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
