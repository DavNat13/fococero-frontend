import React from 'react';
import { AuthFormWidget } from '@/widgets/auth';

export default function RegisterScreen() {
  const handleRegisterSubmit = (data: any) => {
    console.log('Registrando brigadista:', data);
  };

  return <AuthFormWidget initialMode="register" onSubmit={handleRegisterSubmit} />;
}
