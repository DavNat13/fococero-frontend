// app/index.tsx
import React from 'react';
import { useRouter } from 'expo-router';
import { WelcomeWidget } from '@/widgets/auth';

export default function WelcomePage() {
  const router = useRouter();

  // Handlers de navegación
  const handleLogin = () => router.push('./(auth)/login');
  const handleRegister = () => router.push('./(auth)/register');
  const handleGuest = () => router.push('./(auth)/guest');

  return (
    <WelcomeWidget
      onNavigateLogin={handleLogin}
      onNavigateRegister={handleRegister}
      onNavigateGuest={handleGuest}
    />
  );
}
