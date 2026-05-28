import React, { useState } from 'react';
import { router } from 'expo-router';
import { GuestAccessWidget } from '@/widgets/auth';
import { authApi } from '@/features/auth/api/auth.api';
import type { RegisterGuestPayload } from '@/features/auth/model/auth.types';

export default function GuestScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestSubmit = async (_rut: string, _phone: string) => {
    setIsLoading(true);
    try {
      const payload: RegisterGuestPayload = {
        rut: _rut,
        nombre: 'Invitado',
        apellido: '',
        telefono: _phone,
      };
      const response = await authApi.registerGuest(payload);
      if (response.success) {
        router.replace('/(ciudadano)');
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return <GuestAccessWidget onGuestSubmit={handleGuestSubmit} isLoading={isLoading} />;
}
