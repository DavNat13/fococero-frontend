import React from 'react';
import { AuthFormWidget } from '@/widgets/auth';

export default function LoginScreen() {
  const handleLoginSubmit = (data: any) => {
    console.log('Iniciando sesión con:', data);
  };

  return <AuthFormWidget initialMode="login" onSubmit={handleLoginSubmit} />;
}
