import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#020617' }, // Mantiene el Dark Mode de FocoCero
        animation: 'slide_from_right', // Transición táctica
      }}
    />
  );
}
