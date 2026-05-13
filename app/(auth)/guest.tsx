import React from 'react';
import { GuestAccessWidget } from '@/widgets/auth';

export default function GuestScreen() {
  const handleGuestSubmit = (rut: string, phone: string) => {
    console.log('Acceso de emergencia:', rut, phone);
  };

  return <GuestAccessWidget onGuestSubmit={handleGuestSubmit} />;
}

