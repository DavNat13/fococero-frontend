// app/_layout.tsx
import React, { useEffect, useRef, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useSession } from '@/features/auth';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { AlertBanner } from '@/shared/ui/molecules/AlertBanner';
import { ConfirmAlertProvider } from '@/shared/ui/molecules/ConfirmAlert';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import '../global.css';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

function SessionVerifier() {
  useSession();
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

  const prevStatusRef = useRef(useAuthStore.getState().status);

  useEffect(() => {
    const unsub = useAuthStore.subscribe((state) => {
      const prev = prevStatusRef.current;
      const curr = state.status;
      if (prev !== 'unauthenticated' && curr === 'unauthenticated') {
        console.log('[RootLayout] Auth status → unauthenticated, navegando a /');
        InteractionManager.runAfterInteractions(() => {
          router.navigate('/');
        });
      }
      prevStatusRef.current = curr;
    });
    return unsub;
  }, []);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmAlertProvider>
        <View className="flex-1 bg-[#0C0F17]">
          {/* SessionVerifier refresca token Firebase al iniciar la app */}
          <SessionVerifier />
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
      </ConfirmAlertProvider>
    </QueryClientProvider>
  );
}
