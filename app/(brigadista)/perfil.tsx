// app/(brigadista)/perfil.tsx - Perfil Brigadista
import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { useAuthStore } from '@/features/auth';
import { performLogout } from '@/features/auth/utils/logout.utils';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';
import { useGetKpisBrigadista } from '@/entities/analitica';
import { authApi } from '@/features/auth';
import { PerfilBrigadista } from '@entities/usuario';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export default function BrigadistaPerfil() {
  const { user } = useAuthStore();
  const { misReportes, isLoading: loadingReportes } = useReporteFeature();
  const { isLoading: loadingAlertas } = useAlertaFeature();
  const { data: kpis, isLoading: loadingKpisBow } = useGetKpisBrigadista();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const [perfilBrigadista, setPerfilBrigadista] = useState<PerfilBrigadista | null>(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.getPerfilBrigadista();
        if (res.success && res.data?.usuario?.perfil_brigadista) {
          setPerfilBrigadista(res.data.usuario.perfil_brigadista);
        }
      } catch {
        // silencio
      } finally {
        setLoadingPerfil(false);
      }
    })();
  }, []);

  const isLoading = loadingKpisBow || loadingReportes || loadingAlertas || loadingPerfil;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['reportes'] }),
      queryClient.invalidateQueries({ queryKey: ['alertas'] }),
      queryClient.invalidateQueries({ queryKey: ['analitica'] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de abandonar el terreno?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await performLogout();
            router.replace('/');
          } catch {
            console.error('Error al cerrar sesión');
          }
        },
      },
    ]);
  };

  const menuItems: {
    icon: IconName;
    label: string;
    onPress: () => void;
    danger?: boolean;
  }[] = [
    {
      icon: 'account-edit',
      label: 'Editar Perfil',
      onPress: () => {
        router.push('/(brigadista)/editar-perfil-brigadista' as any);
      },
    },
    { icon: 'bell-outline', label: 'Notificaciones', onPress: () => {} },
    { icon: 'map-marker-radius', label: 'Mi Zona', onPress: () => {} },
    { icon: 'account-hard-hat', label: 'Estado Brigadista', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Ayuda', onPress: () => {} },
    { icon: 'logout', label: 'Cerrar Sesión', onPress: handleLogout, danger: true },
  ];

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="p-4 pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        {isLoading ? (
          <LoadingSkeleton lines={5} lineHeight={20} />
        ) : (
          <>
            {/* ── Profile Header ── */}
            <View className="items-center pt-4">
              <View className="h-24 w-24 items-center justify-center rounded-full bg-slate-700">
                <MaterialCommunityIcons name="account-hard-hat" size={48} color="#FFFFFF" />
              </View>
              <Typography variant="h2" className="mt-4 text-white">
                {user?.nombre || 'Brigadista'} {user?.apellido || ''}
              </Typography>
              <Typography variant="body" color="secondary" className="mt-1">
                {user?.email || ''}
              </Typography>
              <View className="mt-3 flex-row items-center rounded-full bg-amber-500 px-4 py-1">
                <MaterialCommunityIcons name="shield-account" size={14} color="#FFFFFF" />
                <Typography variant="caption" className="ml-1 text-white">
                  Brigadista
                </Typography>
              </View>
            </View>

            {/* ── Stats Row (3 columns) ── */}
            <View className="mt-6 flex-row gap-3">
              <View className="flex-1 items-center rounded-2xl bg-slate-800 p-5">
                <Typography variant="h2" className="text-white">
                  {kpis?.totalAlertas ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Alertas
                </Typography>
              </View>
              <View className="flex-1 items-center rounded-2xl bg-slate-800 p-5">
                <Typography variant="h2" className="text-white">
                  {misReportes.length}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Reportes
                </Typography>
              </View>
              <View className="flex-1 items-center rounded-2xl bg-slate-800 p-5">
                <Typography variant="h2" className="text-white">
                  {kpis?.dispatchEnviados ?? 0}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Despachos
                </Typography>
              </View>
            </View>

            {/* ── Estado Operativo ── */}
            <View className="mt-4 flex-row items-center rounded-2xl bg-slate-800 p-4">
              <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
              <View className="ml-3">
                <Typography variant="body" className="text-white">
                  Estado: Activo
                </Typography>
                <Typography variant="caption" color="secondary">
                  Disponible para emergencias
                </Typography>
              </View>
            </View>

            {/* ── Datos Brigadista ── */}
            {perfilBrigadista && (
              <View className="mt-4 rounded-2xl bg-slate-800 p-4">
                <Typography variant="h3" className="mb-3 text-white">
                  Datos del Brigadista
                </Typography>
                {[
                  { label: 'Organismo', value: perfilBrigadista.organismo },
                  { label: 'Rango', value: perfilBrigadista.rango },
                  { label: 'Zona Asignada', value: perfilBrigadista.zona_asignada },
                  { label: 'N° Placa', value: perfilBrigadista.numero_placa },
                ].map((item) =>
                  item.value ? (
                    <View key={item.label} className="mb-2 flex-row justify-between">
                      <Typography variant="caption" color="secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="caption" className="text-white">
                        {item.value}
                      </Typography>
                    </View>
                  ) : null,
                )}
              </View>
            )}

            {/* ── Menu Items ── */}
            <View className="mt-6 overflow-hidden rounded-2xl bg-slate-800">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index < menuItems.length - 1 ? 'border-b border-slate-700' : ''
                  }`}
                  onPress={item.onPress}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={item.danger ? '#EF4444' : '#9CA3AF'}
                  />
                  <Typography
                    variant="body"
                    className={`ml-3 flex-1 ${item.danger ? 'text-red-500' : 'text-white'}`}
                  >
                    {item.label}
                  </Typography>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#4B5563" />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}
