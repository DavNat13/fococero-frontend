// app/(brigadista)/reportes.tsx - Lista de reportes para brigadista
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReporteFeature } from '@/entities/reporte';
import type { Reporte as ReporteEntity } from '@/entities/reporte';
import { ReporteCard } from '@/entities/reporte/ui/ReporteCard';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useQueryClient } from '@tanstack/react-query';

export default function Reportes() {
  const { todosReportes, isLoading, error } = useReporteFeature();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['reportes'] });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <SafeAreaLayout variant="background">
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
          }
        >
          <View style={styles.header}>
            <Typography variant="h1" className="text-white">
              Reportes
            </Typography>
            <Typography variant="body" className="mt-2 text-gray-400">
              Gestiona los reportes de tu zona
            </Typography>
          </View>

          {isLoading ? (
            <LoadingSkeleton lines={4} />
          ) : error ? (
            <ErrorBanner message={error} />
          ) : todosReportes.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="file-document-outline" size={64} color="#4B5563" />
              <Typography variant="body" className="mt-4 text-gray-400">
                No hay reportes aún
              </Typography>
              <Typography variant="caption" className="mt-2 text-gray-500">
                Los reportes aparecerán aquí cuando se generen
              </Typography>
            </View>
          ) : (
            <View style={styles.reportesList}>
              {todosReportes.map((reporte: ReporteEntity) => (
                <ReporteCard key={reporte.id} reporte={reporte} />
              ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fabButton}
          accessibilityLabel="Crear nuevo reporte"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  reportesList: {
    gap: 16,
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
