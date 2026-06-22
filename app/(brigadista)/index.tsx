// app/(brigadista)/index.tsx
import React, { useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/features/auth';
import { useGetKpisBrigadista } from '@/entities/analitica';
import { useGetMisAlertas } from '@/entities/alerta/api/queries';
import { useTodosReportes } from '@/entities/reporte';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

export default function BrigadistaDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: kpis,
    isLoading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis,
  } = useGetKpisBrigadista();

  const {
    data: misAlertas,
    isLoading: alertasLoading,
    error: alertasError,
    refetch: refetchAlertas,
  } = useGetMisAlertas();

  const {
    isLoading: reportesLoading,
    error: reportesError,
    refetch: refetchReportes,
  } = useTodosReportes();

  const [refreshing, setRefreshing] = React.useState(false);

  const isLoading = kpisLoading || alertasLoading || reportesLoading;
  const error = kpisError?.message || alertasError?.message || reportesError;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['analitica'] }),
      queryClient.invalidateQueries({ queryKey: ['alertas'] }),
      queryClient.invalidateQueries({ queryKey: ['reportes'] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const alertasRecientes = misAlertas?.slice(0, 3) ?? [];

  const getEstadoBadge = (estado?: string) => {
    switch (estado) {
      case 'REPORTADA':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Reportada' };
      case 'EN_REVISION':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'En revisión' };
      case 'DERIVADA':
        return { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Derivada' };
      case 'RESUELTA':
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Resuelta' };
      case 'DESCARTADA':
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Descartada' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: estado || 'Desconocido' };
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRetry = () => {
    refetchKpis();
    refetchAlertas();
    refetchReportes();
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#94A3B8"
            colors={['#EA580C']}
          />
        }
      >
        {/* Error Banner */}
        {error ? (
          <View className="mb-4">
            <ErrorBanner message={error} onRetry={handleRetry} />
          </View>
        ) : null}

        {/* ─── Header ─────────────────────────────────── */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Typography variant="h1" className="text-white">
              Dashboard Brigadista
            </Typography>
            <Typography variant="body" className="mt-1 text-gray-400">
              Bienvenido, {user?.nombre || 'Brigadista'}
            </Typography>
          </View>
          <MaterialCommunityIcons name="shield-account" size={32} color="#EA580C" />
        </View>

        {/* ─── Loading ────────────────────────────────── */}
        {isLoading ? (
          <LoadingSkeleton lines={6} lineHeight={80} />
        ) : (
          <>
            {/* ─── KPIs Grid (2x2) ──────────────────── */}
            <View className="mb-6 flex-row flex-wrap justify-between">
              {/* Total Alertas */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="mb-3 rounded-full bg-red-500/20 p-2.5">
                  <MaterialCommunityIcons name="alert-circle" size={22} color="#EF4444" />
                </View>
                <Typography variant="h2" className="text-white">
                  {kpis?.totalAlertas ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-1">
                  Total alertas
                </Typography>
              </View>

              {/* Alertas Activas */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="mb-3 rounded-full bg-orange-500/20 p-2.5">
                  <MaterialCommunityIcons name="fire" size={22} color="#F97316" />
                </View>
                <Typography variant="h2" className="text-white">
                  {kpis?.alertasActivas ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-1">
                  Alertas activas
                </Typography>
              </View>

              {/* Focos Activos */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="mb-3 rounded-full bg-yellow-500/20 p-2.5">
                  <MaterialCommunityIcons name="map-marker" size={22} color="#EAB308" />
                </View>
                <Typography variant="h2" className="text-white">
                  {kpis?.focosActivos ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-1">
                  Focos activos
                </Typography>
              </View>

              {/* Dispatch Enviados */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="mb-3 rounded-full bg-blue-500/20 p-2.5">
                  <MaterialCommunityIcons name="send" size={22} color="#3B82F6" />
                </View>
                <Typography variant="h2" className="text-white">
                  {kpis?.dispatchEnviados ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-1">
                  Dispatch enviados
                </Typography>
              </View>
            </View>

            {/* ─── Estado Operativo ──────────────────── */}
            <View className="mb-6 flex-row items-center rounded-2xl bg-slate-800 p-5">
              <View className="mr-4">
                <MaterialCommunityIcons name="check-circle" size={28} color="#22C55E" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <View className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500" />
                  <Typography variant="body" className="font-semibold text-white">
                    Estado: Activo
                  </Typography>
                </View>
                <Typography variant="caption" color="secondary" className="mt-1">
                  Disponible para emergencias
                </Typography>
              </View>
            </View>

            {/* ─── Acciones Rápidas ──────────────────── */}
            <View className="mb-6 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 items-center rounded-xl bg-blue-600 p-4"
                onPress={() => router.push('/(brigadista)/mapa')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Ver mapa"
              >
                <MaterialCommunityIcons name="map" size={24} color="#FFFFFF" />
                <Typography variant="label" className="mt-2 text-white">
                  Ver mapa
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center rounded-xl bg-orange-600 p-4"
                onPress={() => router.push('/(brigadista)/reportes')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Ir a reportes"
              >
                <MaterialCommunityIcons name="file-document" size={24} color="#FFFFFF" />
                <Typography variant="label" className="mt-2 text-white">
                  Reportes
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center rounded-xl bg-red-600 p-4"
                onPress={() => router.push('/(brigadista)/emergencias')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Ir a emergencias"
              >
                <MaterialCommunityIcons name="alert-octagon" size={24} color="#FFFFFF" />
                <Typography variant="label" className="mt-2 text-white">
                  Emergencias
                </Typography>
              </TouchableOpacity>
            </View>

            {/* ─── Alertas Recientes ──────────────────── */}
            <View className="mb-6">
              <Typography variant="h3" className="mb-4 text-white">
                Alertas recientes
              </Typography>

              {alertasRecientes.length === 0 ? (
                <View className="items-center rounded-2xl bg-slate-800 p-6">
                  <MaterialCommunityIcons name="bell-off" size={32} color="#64748B" />
                  <Typography variant="body" color="secondary" className="mt-2">
                    No hay alertas recientes
                  </Typography>
                </View>
              ) : (
                alertasRecientes.map((alerta, index) => {
                  const badge = getEstadoBadge(alerta.estado);
                  return (
                    <View
                      key={alerta.id ?? `alerta-${index}`}
                      className="mb-3 flex-row items-center rounded-2xl bg-slate-800 p-4"
                    >
                      <View className="mr-3">
                        <MaterialCommunityIcons name="bell" size={20} color="#F97316" />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <View className={`rounded-full px-2.5 py-0.5 ${badge.bg}`}>
                            <Typography variant="caption" className={badge.text}>
                              {badge.label}
                            </Typography>
                          </View>
                          <Typography variant="caption" color="tertiary">
                            {formatFecha(alerta.fecha_creacion)}
                          </Typography>
                        </View>
                        <Typography variant="body" className="mt-1 text-white" numberOfLines={1}>
                          {alerta.tipo}
                        </Typography>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={20} color="#64748B" />
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}
