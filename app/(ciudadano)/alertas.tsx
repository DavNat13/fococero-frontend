// app/(ciudadano)/alertas.tsx - Lista de alertas
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAlertaFeature } from '@/entities/alerta';
import { AlertaCard } from '@/entities/alerta/ui/AlertaCard';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useQueryClient } from '@tanstack/react-query';

export default function Alertas() {
  const { todasAlertas, isLoading, error } = useAlertaFeature();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['alertas'] });
    setRefreshing(false);
  }, [queryClient]);

  if (isLoading) {
    return (
      <SafeAreaLayout variant="background">
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Typography variant="h1" className="text-white">
              Alertas
            </Typography>
          </View>
          <LoadingSkeleton lines={4} />
        </View>
      </SafeAreaLayout>
    );
  }

  if (error) {
    return (
      <SafeAreaLayout variant="background">
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Typography variant="h1" className="text-white">
              Alertas
            </Typography>
          </View>
          <ErrorBanner message={error} />
        </View>
      </SafeAreaLayout>
    );
  }

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Alertas
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Mantente informado sobre tu zona
          </Typography>
        </View>

        {todasAlertas.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={64} color="#4B5563" />
            <Typography variant="body" className="mt-4 text-gray-400">
              No hay alertas activas
            </Typography>
            <Typography variant="caption" className="mt-2 text-gray-500">
              Tu zona está segura por el momento
            </Typography>
          </View>
        ) : (
          <View style={styles.alertasList}>
            {todasAlertas.map((alerta) => (
              <AlertaCard key={alerta.id} alerta={alerta} />
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  alertasList: {
    gap: 16,
  },
});
