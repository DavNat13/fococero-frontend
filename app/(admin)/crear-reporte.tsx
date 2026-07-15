import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Toast } from '@/shared/ui/molecules/Toast';
import { FormularioAlerta } from '@/widgets/formulario-alerta';

export default function AdminCrearReporte() {
  const { tipo } = useLocalSearchParams<{ tipo?: string }>();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'danger') => {
    setToastMsg(message);
    setToastType(type);
    setToastVisible(true);
  }, []);

  const handleSuccess = useCallback(() => {
    showToast('Reporte creado exitosamente', 'success');
    setTimeout(() => router.replace('/(admin)'), 1200);
  }, [showToast]);

  const handleError = useCallback(
    (message: string) => {
      showToast(message, 'danger');
    },
    [showToast],
  );

  return (
    <SafeAreaLayout variant="background">
      <View className="flex-row items-center px-2 pt-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-full active:bg-slate-800/50"
          accessibilityLabel="Volver atrás"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Typography variant="h3" className="ml-2 text-white">
          Nuevo Reporte
        </Typography>
      </View>

      <FormularioAlerta initialTipo={tipo} onSuccess={handleSuccess} onError={handleError} />

      <Toast
        message={toastMsg ?? ''}
        type={toastType}
        isVisible={toastVisible}
        onHide={() => setToastVisible(false)}
        duration={3000}
      />
    </SafeAreaLayout>
  );
}
