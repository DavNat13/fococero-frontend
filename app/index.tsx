// app/index.tsx
import { WelcomeWidget } from '@/widgets/auth';
import { useRouter } from 'expo-router';
import React from 'react';

export default function WelcomePage() {
  const router = useRouter();

  const handleLogin = () => router.push('./(auth)/login');
  const handleRegister = () => router.push('./(auth)/register');

  return <WelcomeWidget onCreateAccountPress={handleRegister} onHaveAccountPress={handleLogin} />;
}

