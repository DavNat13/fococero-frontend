import React from 'react';
import { useAuthStore } from '@/features/auth';
import { UserRole } from '@/entities/usuario';
import { Redirect } from 'expo-router';
import { WelcomeWidget } from '@/widgets/auth';

function getRouteByRole(rol?: UserRole): string {
  switch (rol) {
    case UserRole.ADMIN:
      return '/(admin)';
    case UserRole.BRIGADISTA:
      return '/(brigadista)';
    case UserRole.INVITADO:
      return '/(invitado)';
    case UserRole.USUARIO:
    default:
      return '/(ciudadano)';
  }
}

export default function IndexPage() {
  const { status, user, isHydrated } = useAuthStore();

  console.log('[IndexPage] Store state:', { status, user: !!user, isHydrated });

  if (!isHydrated) return null;

  if ((status === 'authenticated' || status === 'guest') && user) {
    return <Redirect href={getRouteByRole(user.rol) as any} />;
  }

  return <WelcomeWidget />;
}
