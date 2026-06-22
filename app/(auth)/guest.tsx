import React, { useCallback } from 'react';
import { GuestAccessWidget } from '@/widgets/auth';
import { useAuthStore } from '@/features/auth';
import type { RegisterGuestPayload } from '@/features/auth/model/auth.types';

export default function GuestScreen() {
  const { register, isLoading } = useAuthStore();

  const handleGuestSubmit = useCallback(
    async (rut: string, phone: string) => {
      const payload: RegisterGuestPayload = {
        rut,
        nombre: 'Invitado',
        apellido: 'Invitado',
        telefono: phone,
      };
      await register(payload);
    },
    [register],
  );

  return <GuestAccessWidget onGuestSubmit={handleGuestSubmit} isLoading={isLoading} />;
}
