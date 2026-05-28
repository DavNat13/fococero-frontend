// app/(brigadista)/emergencias.tsx - Seguimiento de emergencias
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { EmergenciaCard } from '@/entities/emergencia/ui/EmergenciaCard';
import { EmergenciaEmptyState } from '@/entities/emergencia/ui/EmergenciaEmptyState';
import type { Emergencia as EmergenciaType } from '@/entities/emergencia/ui/EmergenciaCard';
import { apiClient } from '@/core/api';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';

export default function Emergencias() {
  const [emergencias, setEmergencias] = useState<EmergenciaType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmergencias = useCallback(async () => {
    try {
      setError(null);
      const response = await apiClient.get<EmergenciaType[]>('/api/emergencias');
      if (response.success) {
        setEmergencias(response.data);
      } else {
        setError(response.error?.message || 'Error al cargar emergencias');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al cargar emergencias');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEmergencias();
  }, [fetchEmergencias]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEmergencias();
  }, [fetchEmergencias]);

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Emergencias
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Seguimiento de emergencias activas
          </Typography>
        </View>

        {isLoading ? (
          <LoadingSkeleton lines={4} />
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchEmergencias} />
        ) : emergencias.length === 0 ? (
          <EmergenciaEmptyState />
        ) : (
          <View style={styles.emergenciasList}>
            {emergencias.map((emergencia) => (
              <EmergenciaCard key={emergencia.id} emergencia={emergencia} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  emergenciasList: {
    gap: 16,
  },
});
