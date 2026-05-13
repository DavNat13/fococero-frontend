// app/_layout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { useAuthStore } from '@/features/auth';
import '../global.css';

SplashScreen.preventAutoHideAsync();

function AuthRedirect() {
  const router = useRouter();
  const { status, user } = useAuthStore();
  const isNavigating = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  // Solo empezar a escuchar después de que el componente esté montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo navegar después de montar Y cuando esté autenticado
    if (!isMounted || isNavigating.current) return;
    
    if (status === 'authenticated' && user) {
      isNavigating.current = true;
      
      // Usar setImmediate para ejecutar en el siguiente ciclo de eventos
      // Esto garantiza que el contexto de navegación esté disponible
      const timeout = setTimeout(() => {
        router.replace('/(brigadista)');
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