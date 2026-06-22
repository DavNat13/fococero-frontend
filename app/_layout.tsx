// app/_layout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useRootNavigationState, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useSession } from '@/features/auth';
import { UserRole } from '@entities/usuario';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { AlertBanner } from '@/shared/ui/molecules/AlertBanner';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import '../global.css';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

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

function SessionVerifier() {
  useSession();
  return null;
}

function AuthRedirect() {
  const router = useRouter();
  const { status, user } = useAuthStore();
  const navigationState = useRootNavigationState();
  const isNavigating = useRef(false);

  useEffect(() => {
    if (!navigationState?.key || isNavigating.current) return;

    if ((status === 'authenticated' || status === 'guest') && user) {
      isNavigating.current = true;
      const route = getRouteByRole(user.rol);
      router.replace(route as Href);
    }
  }, [navigationState?.key, status, user, router]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });
  const { isConnected } = useNetworkStatus();

  useEffect(() => {
    if (error) {
      console.error('Error cargando fuentes:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1 bg-[#0C0F17]">
        {/* SessionVerifier refresca token Firebase al iniciar la app */}
        <SessionVerifier />
        {/* AuthRedirect debe estar como hijo directo del View, no dentro del Stack */}
        <AuthRedirect />
        {!isConnected && (
          <View className="px-4 pt-12">
            <AlertBanner
              message="Sin conexión a internet. Algunas funciones pueden no estar disponibles."
              type="warning"
            />
          </View>
        )}
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(brigadista)" />
          <Stack.Screen name="(ciudadano)" />
          <Stack.Screen
            name="(auth)"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
