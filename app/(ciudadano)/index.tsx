// app/(ciudadano)/index.tsx - Pantalla de inicio ciudadano
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { useAuthStore } from '@/features/auth';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { router } from 'expo-router';

export default function CiudadanoHome() {
  const { user } = useAuthStore();
  const { misReportes, isLoading: loadingReportes, error: errorReportes } = useReporteFeature();
  const { misAlertas, isLoading: loadingAlertas, error: errorAlertas } = useAlertaFeature();

  const isLoading = loadingReportes || loadingAlertas;
  const error = errorReportes || errorAlertas;

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={error} onRetry={() => {}} />
          </View>
        )}

        {/* Header de bienvenida */}
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Hola, {user?.nombre || 'Ciudadano'}
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Bienvenido a FocoCero
          </Typography>
        </View>

        {/* Stats básicos */}
        {isLoading ? (
          <View style={styles.statsContainer}>
            <LoadingSkeleton lines={3} lineHeight={60} />
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Typography variant="h2" className="text-red-500">
                {misReportes.length}
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Mis reportes
              </Typography>
            </View>
            <View style={styles.statCard}>
              <Typography variant="h2" className="text-orange-500">
                {misAlertas.length}
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Alertas cercanas
              </Typography>
            </View>
            <View style={styles.statCard}>
              <Typography variant="h2" className="text-green-500">
                0
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Zonas seguras
              </Typography>
            </View>
          </View>
        )}

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Typography variant="h3" className="mb-4 text-white">
            Acciones rápidas
          </Typography>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardPrimary]}
              onPress={() => router.push('/(ciudadano)/crear-reporte')}
              accessibilityLabel="Reportar incendio"
              accessibilityRole="button"
            >
              <Typography variant="body" className="font-semibold text-white">
                Reportar incendio
              </Typography>
              <Typography variant="caption" className="mt-1 text-white/70">
                Notifica un nuevo foco
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardSecondary]}
              onPress={() => router.push('/(ciudadano)/alertas')}
              accessibilityLabel="Ver alertas"
              accessibilityRole="button"
            >
              <Typography variant="body" className="font-semibold text-white">
                Ver alertas
              </Typography>
              <Typography variant="caption" className="mt-1 text-white/70">
                Alertas en tu zona
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de estado */}
        <View style={styles.statusCard}>
          <Typography variant="body" className="font-semibold text-white">
            Estado de alerta actual
          </Typography>
          <View style={styles.statusRow}>
            <View style={styles.statusIndicator} />
            <Typography variant="body" className="text-green-400">
              Sin alertas activas en tu zona
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
  },
  actionCardPrimary: {
    backgroundColor: '#DC2626',
  },
  actionCardSecondary: {
    backgroundColor: '#F97316',
  },
  statusCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
});
