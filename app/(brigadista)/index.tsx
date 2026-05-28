// app/(brigadista)/index.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';
import { useAuthStore } from '@/features/auth';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BrigadistaDashboard() {
  const { user } = useAuthStore();
  const { misReportes, isLoading: loadingReportes, error: errorReportes } = useReporteFeature();
  const { misAlertas, isLoading: loadingAlertas, error: errorAlertas } = useAlertaFeature();

  const isLoading = loadingReportes || loadingAlertas;
  const error = errorReportes || errorAlertas;

  return (
    <SafeAreaLayout variant="background">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={error} onRetry={() => {}} />
          </View>
        )}

        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Dashboard Brigadista
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Bienvenido, {user?.nombre || 'Brigadista'}
          </Typography>
        </View>

        {isLoading ? (
          <View style={styles.kpiGrid}>
            <LoadingSkeleton lines={4} lineHeight={80} />
          </View>
        ) : (
          <>
            <View style={styles.kpiGrid}>
              <Card style={styles.kpiCard}>
                <MaterialCommunityIcons name="clipboard-list" size={24} color="#3B82F6" />
                <Typography variant="h2" className="mt-2">
                  {misReportes.length}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Mis Reportes
                </Typography>
              </Card>
              <Card style={styles.kpiCard}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
                <Typography variant="h2" className="mt-2">
                  {misAlertas.length}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Alertas Activas
                </Typography>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 24 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiCard: { width: '47%', padding: 16, alignItems: 'center' },
  errorContainer: { marginBottom: 16 },
});
