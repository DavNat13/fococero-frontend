import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { router } from 'expo-router';
import { OfflineBanner } from '@/shared/ui/molecules/OfflineBanner';
import { useGetReportePorId, useGetHistorialReporte } from '@/entities/reporte';
import { InfoHeader } from './ui/InfoHeader';
import { MetadataCard } from './ui/MetadataCard';
import { UbicacionCard } from './ui/UbicacionCard';
import { HistorialTimeline } from './ui/HistorialTimeline';
import { AccionesCard } from './ui/AccionesCard';

type UserRole = 'CIUDADANO' | 'BRIGADISTA' | 'ADMIN';

interface ReporteDetalleProps {
  reporteId: string;
  userRole: UserRole;
}

export function ReporteDetalle({ reporteId, userRole }: ReporteDetalleProps) {
  const queryClient = useQueryClient();
  const { data: reporte, isLoading, error, refetch } = useGetReportePorId(reporteId);
  const isOperativo = userRole === 'BRIGADISTA' || userRole === 'ADMIN';
  const { data: historial = [] } = useGetHistorialReporte(isOperativo ? reporteId : '');
  const [refreshing, setRefreshing] = React.useState(false);

  const mapaRoute =
    userRole === 'CIUDADANO'
      ? '/(ciudadano)/mapa'
      : userRole === 'BRIGADISTA'
        ? '/(brigadista)/mapa'
        : '/(admin)/mapa';

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['reportes', reporteId] });
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaLayout variant="background">
        <View className="p-4">
          <LoadingSkeleton lines={6} />
        </View>
      </SafeAreaLayout>
    );
  }

  if (error || !reporte) {
    return (
      <SafeAreaLayout variant="background">
        <View className="flex-1 items-center justify-center p-4">
          <ErrorBanner
            message={error?.message ?? 'Error al cargar reporte'}
            onRetry={() => refetch()}
          />
        </View>
      </SafeAreaLayout>
    );
  }

  return (
    <SafeAreaLayout variant="background" edges={['bottom', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        <View className="pt-2">
          <OfflineBanner />
        </View>
        <InfoHeader reporte={reporte} />
        <View className="my-4">
          <MetadataCard reporte={reporte} />
        </View>
        <View className="mb-4">
          <UbicacionCard
            latitud={reporte.latitud}
            longitud={reporte.longitud}
            onVerMapa={() => router.push(mapaRoute)}
          />
        </View>
        {isOperativo && historial.length > 0 ? (
          <View className="mb-4">
            <HistorialTimeline historial={historial} />
          </View>
        ) : null}
        {isOperativo ? <AccionesCard reporte={reporte} /> : null}
      </ScrollView>
    </SafeAreaLayout>
  );
}
