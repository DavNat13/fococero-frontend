// app/(admin)/perfil.tsx - Admin Profile
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useAuthStore } from '@/features/auth';
import { performLogout } from '@/features/auth/utils/logout.utils';
import { useGetKpisAdmin } from '@/entities/analitica';
import { useAlert } from '@/shared/ui/molecules/ConfirmAlert';
import { router } from 'expo-router';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export default function AdminPerfil() {
  const { user } = useAuthStore();
  const { data: kpis, isLoading, error: kpiError } = useGetKpisAdmin();
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || kpiError?.message || null;

  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      description: '¿Estás seguro de que deseas cerrar sesión?',
      variant: 'danger',
      confirmLabel: 'Cerrar sesión',
      onConfirm: async () => {
        try {
          await performLogout();
          router.replace('/');
        } catch {
          setLocalError('Error al cerrar sesión. Intenta nuevamente.');
        }
      },
    });
  };

  const menuItems: { icon: IconName; label: string; onPress: () => void; danger?: boolean }[] = [
    { icon: 'account-cog', label: 'Editar Perfil', onPress: () => {} },
    { icon: 'shield-account', label: 'Permisos', onPress: () => {} },
    { icon: 'cog', label: 'Configuración Global', onPress: () => router.push('/(admin)/config') },
    { icon: 'database', label: 'Gestión de Datos', onPress: () => {} },
    { icon: 'help-circle', label: 'Ayuda y Soporte', onPress: () => {} },
    { icon: 'logout', label: 'Cerrar Sesión', onPress: handleLogout, danger: true },
  ];

  const statItems: { label: string; value: number | undefined }[] = [
    { label: 'Total Alertas', value: kpis?.totalAlertas },
    { label: 'Focos Activos', value: kpis?.focosActivos },
    { label: 'Dispatch Enviados', value: kpis?.dispatchEnviados },
  ];

  return (
    <SafeAreaLayout variant="background">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="pt-8">
            <LoadingSkeleton lines={5} />
          </View>
        ) : displayError ? (
          <View className="mt-4">
            <ErrorBanner message={displayError} onRetry={() => setLocalError(null)} />
          </View>
        ) : (
          <>
            {/* Profile Header */}
            <View className="items-center pb-6 pt-8">
              <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-purple-700">
                <MaterialCommunityIcons name="shield-crown" size={48} color="white" />
              </View>
              <Typography variant="h2" className="text-center text-white">
                {user?.nombre || 'Admin'} {user?.apellido || ''}
              </Typography>
              <Typography variant="body" className="mt-1 text-center text-gray-400">
                {user?.email || 'email@ejemplo.com'}
              </Typography>
              <View className="mt-3 flex-row items-center rounded-full bg-purple-600 px-4 py-1">
                <MaterialCommunityIcons name="shield-check" size={16} color="white" />
                <Typography variant="caption" className="ml-1.5 text-white">
                  Administrador
                </Typography>
              </View>
            </View>

            {/* Stats Row */}
            <View className="mb-6 flex-row gap-3">
              {statItems.map((stat, index) => (
                <View key={index} className="flex-1 items-center rounded-2xl bg-slate-800 p-5">
                  <Typography variant="h2" className="text-white">
                    {kpis ? (stat.value ?? 0) : '—'}
                  </Typography>
                  <Typography variant="caption" className="mt-1 text-center text-gray-400">
                    {stat.label}
                  </Typography>
                </View>
              ))}
            </View>

            {/* Menu Items */}
            <View className="mb-8 overflow-hidden rounded-2xl bg-slate-800">
              {menuItems.map((item, index) => {
                const isLast = index === menuItems.length - 1;
                return (
                  <TouchableOpacity
                    key={index}
                    className={`flex-row items-center border-b border-slate-700 p-4 ${isLast ? 'border-b-0' : ''}`}
                    onPress={item.onPress}
                    accessibilityLabel={item.label}
                    accessibilityRole="button"
                  >
                    <MaterialCommunityIcons
                      name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={22}
                      color={item.danger ? '#EF4444' : '#94A3B8'}
                    />
                    <Typography
                      variant="body"
                      className={`ml-3 flex-1 ${item.danger ? 'text-red-500' : 'text-slate-200'}`}
                    >
                      {item.label}
                    </Typography>
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#475569" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}
