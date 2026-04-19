// app/_layout.tsx

import '../global.css'; // IMPORTANTE: Debe ser la primera línea para NativeWind v4
import { useEffect } from 'react';
import { useColorScheme, LogBox } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// 1. Capa de Infraestructura: Validación de Entorno y Configuración
import { validateEnv } from '@/core/config/env.config';

// Ignorar logs de advertencia de librerías externas que no comprometen la lógica
LogBox.ignoreLogs(['Reading as-yet-unfocused']);

// Mantener el Splash Screen visible hasta que los activos estén listos
SplashScreen.preventAutoHideAsync();

// 2. Configuración de TanStack Query (Resiliencia de Red)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reintentos automáticos en caso de fallo de red
      staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
    },
  },
});

export {
  // Exportación del ErrorBoundary nativo para capturar fallos catastróficos
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  // EJECUCIÓN CRÍTICA: Validar que el .env esté correcto antes de renderizar
  validateEnv();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Manejo de errores en la carga de fuentes
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Ocultar Splash Screen una vez que los activos están hidratados
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom', // Transiciones fluidas nivel premium
        }}
      >
        {/* 3. Definición de Segmentos de Navegación por Roles  */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(ciudadano)" />
        <Stack.Screen name="(brigadista)" />

        {/* Pantalla modal global para alertas o reportes rápidos  */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', headerShown: true, title: 'Información' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
