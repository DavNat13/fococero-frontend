// c:/Users/David/Desktop/FocoCero/fococero-frontend/app/modal.tsx

import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text } from 'react-native';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6 dark:bg-brand-municipalidad">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        Información de Brigada
      </Text>

      {/* Separador estilizado con Tailwind */}
      <View className="my-6 h-[1px] w-4/5 bg-surface-border dark:bg-gray-700" />

      <Text className="text-center text-base text-gray-600 dark:text-gray-300">
        Este es el modal global del sistema FocoCero. Úsalo para mostrar reportes rápidos, alertas
        climáticas o información crítica sin perder el contexto de la navegación actual.
      </Text>

      {/* Manejo inteligente de la barra de estado superior (batería/hora) en iOS */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

