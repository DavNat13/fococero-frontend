import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ruta no encontrada' }} />

      {/* Estructura NativeWind con soporte Dark Mode automático */}
      <View className="bg-surface dark:bg-brand-municipalidad flex-1 items-center justify-center p-5">
        <Text className="dark:text-surface-muted text-2xl font-bold text-gray-900">
          404 - Territorio Desconocido
        </Text>

        <Text className="mt-3 text-center text-base text-gray-600 dark:text-gray-400">
          Parece que te has desviado de la ruta segura. Esta coordenada no existe en los registros
          de FocoCero.
        </Text>

        <Link href={'/'} className="mt-8 py-4">
          <Text className="text-primary dark:text-primary-light font-bold">
            Volver a la base (Inicio)
          </Text>
        </Link>
      </View>
    </>
  );
}
