// app/(admin)/index.tsx - Admin Dashboard
import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useGetKpisAdmin } from '@/entities/analitica';
import { useGetTodasAlertas } from '@/entities/alerta/api/queries';
import { useAuthStore } from '@/features/auth';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

const ESTADO_BADGE: Record<string, { container: string; text: string }> = {
  REPORTADA: { container: 'bg-amber-500/20', text: 'text-amber-500' },
  EN_REVISION: { container: 'bg-blue-500/20', text: 'text-blue-500' },
  DERIVADA: { container: 'bg-purple-500/20', text: 'text-purple-500' },
  RESUELTA: { container: 'bg-green-500/20', text: 'text-green-500' },
  DESCARTADA: { container: 'bg-gray-500/20', text: 'text-gray-500' },
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useGetKpisAdmin();
  const { data: alertas, isLoading: alertasLoading } = useGetTodasAlertas();

  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['analitica'] }),
      queryClient.invalidateQueries({ queryKey: ['alertas'] }),
      queryClient.invalidateQueries({ queryKey: ['reportes'] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const isLoading = kpisLoading || alertasLoading;
  const latestAlertas = (alertas ?? []).slice(0, 3);

  const quickActions = [
    {
      title: 'Gestionar Usuarios',
      icon: 'account-cog' as const,
      route: '/(admin)/usuarios' as const,
    },
    { title: 'Ver Mapa', icon: 'map' as const, route: '/(admin)/mapa' as const },
    { title: 'Configuración', icon: 'cog' as const, route: '/(admin)/config' as const },
    { title: 'Alertas', icon: 'bell-ring' as const, route: '/(admin)/mapa' as const },
  ];

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        {/* ─── Header ─── */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Typography variant="h1">Panel de Administración</Typography>
            <Typography variant="body" color="secondary" className="mt-1">
              Bienvenido, {user?.nombre ?? 'Admin'}
            </Typography>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-800">
            <MaterialCommunityIcons name="shield-crown" size={24} color="#F59E0B" />
          </View>
        </View>

        {/* ─── Error ─── */}
        {kpisError && (
          <View className="mb-4">
            <ErrorBanner
              message={
                kpisError instanceof Error ? kpisError.message : 'Error al cargar indicadores'
              }
              onRetry={() => queryClient.invalidateQueries({ queryKey: ['analitica'] })}
            />
          </View>
        )}

        {/* ─── Loading / Content ─── */}
        {isLoading && !kpisError ? (
          <View className="flex-row flex-wrap">
            <View className="w-full">
              <LoadingSkeleton lines={4} lineHeight={80} />
            </View>
          </View>
        ) : (
          <>
            {/* ─── KPI Grid (2×2) ─── */}
            <View className="flex-row flex-wrap justify-between">
              {/* Total Alertas */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="rounded-full bg-blue-500/20 p-3">
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#3B82F6" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.totalAlertas ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Total Alertas
                </Typography>
              </View>

              {/* Focos Activos */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="rounded-full bg-red-500/20 p-3">
                  <MaterialCommunityIcons name="fire" size={24} color="#EF4444" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.focosActivos ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Focos Activos
                </Typography>
              </View>

              {/* Alertas Resueltas */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="rounded-full bg-green-500/20 p-3">
                  <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.alertasResueltas ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Alertas Resueltas
                </Typography>
              </View>

              {/* Despachos Enviados */}
              <View className="mb-3 w-[48%] items-start rounded-2xl bg-slate-800 p-4">
                <View className="rounded-full bg-amber-500/20 p-3">
                  <MaterialCommunityIcons name="send" size={24} color="#F59E0B" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.dispatchEnviados ?? '—'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Despachos Enviados
                </Typography>
              </View>
            </View>

            {/* ─── Acciones Rápidas (2×2) ─── */}
            <Typography variant="h3" className="mb-4 mt-2">
              Acciones Rápidas
            </Typography>
            <View className="flex-row flex-wrap justify-between">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  className="mb-3 w-[48%] items-center rounded-2xl bg-slate-800 p-5"
                  onPress={() => router.push(action.route)}
                  accessibilityLabel={action.title}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons name={action.icon} size={28} color="#EF4444" />
                  <Typography variant="body" className="mt-2 text-center">
                    {action.title}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            {/* ─── Alertas Recientes ─── */}
            <Typography variant="h3" className="mb-4 mt-2">
              Alertas recientes
            </Typography>

            {latestAlertas.length === 0 && (
              <View className="mb-3 rounded-2xl bg-slate-800 p-4">
                <Typography variant="body" color="secondary">
                  No hay alertas recientes
                </Typography>
              </View>
            )}

            {latestAlertas.map((alerta) => {
              const badge = ESTADO_BADGE[alerta.estado ?? ''] ?? {
                container: 'bg-slate-700',
                text: 'text-slate-300',
              };
              return (
                <View key={alerta.id} className="mb-3 rounded-2xl bg-slate-800 p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-3">
                      <MaterialCommunityIcons name="alert-outline" size={20} color="#94A3B8" />
                      <Typography variant="body" className="flex-1">
                        {alerta.tipo}
                      </Typography>
                    </View>
                    <View className={`rounded-full px-3 py-1 ${badge.container}`}>
                      <Typography variant="caption" className={badge.text}>
                        {alerta.estado}
                      </Typography>
                    </View>
                  </View>
                  {alerta.fecha_creacion && (
                    <Typography variant="caption" color="tertiary" className="ml-9 mt-1">
                      {new Date(alerta.fecha_creacion).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* Bottom spacer for scroll */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaLayout>
  );
}
