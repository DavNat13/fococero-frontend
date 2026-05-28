// app/_layout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { useAuthStore } from '@/features/auth';
import { UserRole } from '@entities/usuario';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { AlertBanner } from '@/shared/ui/molecules/AlertBanner';
import '../global.css';

SplashScreen.preventAutoHideAsync();

function getRouteByRole(rol?: UserRole): string {
  switch (rol) {
    case UserRole.ADMIN:
      return '/(admin)';
    case UserRole.BRIGADISTA:
      return '/(brigadista)';
    case UserRole.INVITADO:
    case UserRole.USUARIO:
    default:
      return '/(ciudadano)';
  }
}

function AuthRedirect() {
  const router = useRouter();
  const { status, user } = useAuthStore();
  const isNavigating = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isNavigating.current) return;

    if ((status === 'authenticated' || status === 'guest') && user) {
      isNavigating.current = true;

      const route = getRouteByRole(user.rol);

      const timeout = setTimeout(() => {
        router.replace(route as Href);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [status, user, isMounted, router]);

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
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#0C0F17]">
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
  );
}
