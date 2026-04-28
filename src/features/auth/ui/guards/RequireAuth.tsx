// src/features/auth/ui/guards/RequireAuth.tsx

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useIsHydrated, useIsAuthenticated } from '../../model/auth.selectors';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const isHydrated = useIsHydrated();
  const isAuthenticated = useIsAuthenticated();

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};
