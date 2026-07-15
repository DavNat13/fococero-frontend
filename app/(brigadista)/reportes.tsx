// app/(brigadista)/reportes.tsx - Lista de reportes para brigadista
import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTodosReportes, useCambiarEstadoReporte } from '@/entities/reporte';
import type { Reporte, ReporteEstado } from '@/entities/reporte';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { OfflineBanner } from '@/shared/ui/molecules/OfflineBanner';
import { useQueryClient } from '@tanstack/react-query';
import { formatearFecha } from '@/shared/utils/formatters';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type FilterTab = 'TODOS' | 'PENDIENTE' | 'EN_PROCESO';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PENDIENTE', label: 'Pendientes' },
  { key: 'EN_PROCESO', label: 'En Proceso' },
];

const ESTADO_BADGE_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-yellow-500',
  EN_PROCESO: 'bg-blue-500',
  RESUELTO: 'bg-green-500',
  FALSA_ALARMA: 'bg-gray-500',
};

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  RESUELTO: 'Resuelto',
  FALSA_ALARMA: 'Falsa Alarma',
};

const ESTADO_ACTION_LABELS: Record<string, string> = {
  EN_PROCESO: 'en proceso',
  RESUELTO: 'resuelto',
  FALSA_ALARMA: 'falsa alarma',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Reportes() {
  const router = useRouter();
  const { todosReportes, isLoading, error, refetch } = useTodosReportes();
  const { mutate: cambiarEstado } = useCambiarEstadoReporte();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('TODOS');
  const queryClient = useQueryClient();

  // -- Pull to refresh -------------------------------------------------------
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['reportes'] });
    setRefreshing(false);
  }, [queryClient]);

  // -- Filter logic ----------------------------------------------------------
  const filteredReportes = useMemo(() => {
    if (activeTab === 'TODOS') return todosReportes;
    return todosReportes.filter((r: Reporte) => r.estado === activeTab);
  }, [todosReportes, activeTab]);

  // -- Estado change helpers -------------------------------------------------
  const handleEstadoAction = useCallback(
    (reporte: Reporte, nuevoEstado: ReporteEstado) => {
      Alert.alert(
        'Confirmar cambio',
        `¿Estás seguro de marcar este reporte como "${ESTADO_ACTION_LABELS[nuevoEstado]}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => {
              cambiarEstado({
                id: reporte.id,
                payload: {
                  nuevoEstado,
                  comentarios: `Cambio automático desde app brigadista a ${ESTADO_ACTION_LABELS[nuevoEstado]}`,
                },
              });
            },
          },
        ],
      );
    },
    [cambiarEstado],
  );

  const handleCardPress = useCallback(
    (reporte: Reporte) => {
      const buttons: {
        text: string;
        onPress?: () => void;
        style?: 'cancel' | 'destructive' | 'default';
      }[] = [];

      // "Marcar en proceso" solo si está PENDIENTE
      if (reporte.estado === 'PENDIENTE') {
        buttons.push({
          text: 'Marcar en proceso',
          onPress: () => handleEstadoAction(reporte, 'EN_PROCESO'),
        });
      }

      // "Resolver" solo si está EN_PROCESO
      if (reporte.estado === 'EN_PROCESO') {
        buttons.push({
          text: 'Resolver',
          onPress: () => handleEstadoAction(reporte, 'RESUELTO'),
        });
      }

      // "Marcar falsa alarma" disponible siempre que no lo sea ya
      if (reporte.estado !== 'FALSA_ALARMA') {
        buttons.push({
          text: 'Marcar falsa alarma',
          style: 'destructive',
          onPress: () => handleEstadoAction(reporte, 'FALSA_ALARMA'),
        });
      }

      buttons.unshift({
        text: 'Ver detalle',
        onPress: () =>
          router.push({ pathname: '/(brigadista)/reporte/[id]', params: { id: reporte.id } }),
      });

      buttons.push({ text: 'Cancelar', style: 'cancel' });

      Alert.alert(reporte.titulo, '¿Qué acción deseas realizar?', buttons);
    },
    [handleEstadoAction, router],
  );

  // -- Helpers ---------------------------------------------------------------
  const getCategoriaLabel = useCallback((reporte: Reporte): string => {
    return reporte.categoria_id || 'General';
  }, []);

  const truncateId = useCallback((id: string): string => {
    return `${id.slice(0, 8)}...`;
  }, []);

  // -- Empty state message ---------------------------------------------------
  const emptyMessage = useMemo(() => {
    if (activeTab === 'TODOS') return 'Aún no hay reportes en tu zona';
    const tabLabel = FILTER_TABS.find((t) => t.key === activeTab)?.label.toLowerCase();
    return `No hay reportes con estado "${tabLabel}"`;
  }, [activeTab]);

  // -- Render helpers -----------------------------------------------------------
  const renderReporte = useCallback(
    ({ item }: { item: Reporte }) => (
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        className="mb-4 rounded-2xl bg-slate-800 p-5 active:opacity-80"
        activeOpacity={0.7}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <View
            className={`rounded-lg px-3 py-1 ${ESTADO_BADGE_COLORS[item.estado] || 'bg-gray-500'}`}
          >
            <Typography variant="caption" className="text-white">
              {ESTADO_LABELS[item.estado] || item.estado}
            </Typography>
          </View>
          <Typography variant="caption" className="text-gray-500">
            {formatearFecha(item.created_at)}
          </Typography>
        </View>
        <Typography variant="h3" className="text-white">
          {item.titulo}
        </Typography>
        {item.descripcion ? (
          <Typography variant="body" className="mt-2 text-gray-400" numberOfLines={2}>
            {item.descripcion}
          </Typography>
        ) : null}
        <View className="mt-4 flex-row items-center gap-4 border-t border-slate-700 pt-3">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="tag" size={14} color="#6B7280" />
            <Typography variant="caption" className="ml-1 text-gray-500">
              {getCategoriaLabel(item)}
            </Typography>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account" size={14} color="#6B7280" />
            <Typography variant="caption" className="ml-1 text-gray-500">
              {truncateId(item.id_ciudadano)}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleCardPress, getCategoriaLabel, truncateId],
  );

  const ListHeader = useMemo(
    () => (
      <View>
        <OfflineBanner />
        <View className="mb-6">
          <Typography variant="h1" className="text-white">
            Reportes
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Gestiona los reportes de tu zona
          </Typography>
        </View>
        <View className="mb-6 flex-row gap-2">
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2 ${
                activeTab === tab.key ? 'bg-blue-600' : 'bg-slate-800'
              }`}
              accessibilityLabel={`Filtrar por ${tab.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === tab.key }}
            >
              <Typography
                variant="label"
                className={activeTab === tab.key ? 'text-white' : 'text-gray-400'}
              >
                {tab.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [activeTab],
  );

  const ListEmpty = useMemo(
    () => (
      <View className="items-center justify-center py-16">
        <MaterialCommunityIcons name="file-document-outline" size={64} color="#4B5563" />
        <Typography variant="body" className="mt-4 text-gray-400">
          No hay reportes
        </Typography>
        <Typography variant="caption" className="mt-2 text-gray-500">
          {emptyMessage}
        </Typography>
      </View>
    ),
    [emptyMessage],
  );

  // -- Render ----------------------------------------------------------------
  return (
    <SafeAreaLayout variant="background">
      <View className="relative flex-1">
        {isLoading ? (
          <View className="p-4">
            <LoadingSkeleton lines={4} />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-4">
            <ErrorBanner message={error} onRetry={() => refetch()} />
          </View>
        ) : (
          <FlatList
            data={filteredReportes}
            renderItem={renderReporte}
            keyExtractor={(item: Reporte) => item.id}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ListEmpty}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            windowSize={7}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
            }
          />
        )}

        <TouchableOpacity
          onPress={() => router.push('/(brigadista)/crear-reporte')}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-black/25"
          accessibilityLabel="Crear nuevo reporte"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaLayout>
  );
}
