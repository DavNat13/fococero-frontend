// app/(ciudadano)/index.tsx - Pantalla de inicio ciudadano
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { useAuthStore } from '@/features/auth';

export default function CiudadanoHome() {
  const { user } = useAuthStore();

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de bienvenida */}
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Hola, {user?.nombre || 'Ciudadano'}
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-2">
            Bienvenido a FocoCero
          </Typography>
        </View>

        {/* Stats básicos */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Typography variant="h2" className="text-red-500">0</Typography>
            <Typography variant="caption" className="text-gray-400">
              Reportes activos
            </Typography>
          </View>
          <View style={styles.statCard}>
            <Typography variant="h2" className="text-orange-500">0</Typography>
            <Typography variant="caption" className="text-gray-400">
              Alertas cercanas
            </Typography>
          </View>
          <View style={styles.statCard}>
            <Typography variant="h2" className="text-green-500">0</Typography>
            <Typography variant="caption" className="text-gray-400">
              Zonas seguras
            </Typography>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Typography variant="h3" className="text-white mb-4">
            Acciones rápidas
          </Typography>
          <View style={styles.actionsGrid}>
            <View style={[styles.actionCard, styles.actionCardPrimary]}>
              <Typography variant="body" className="text-white font-semibold">
                Reportar incendio
              </Typography>
              <Typography variant="caption" className="text-white/70 mt-1">
                Notifica un nuevo foco
              </Typography>
            </View>
            <View style={[styles.actionCard, styles.actionCardSecondary]}>
              <Typography variant="body" className="text-white font-semibold">
                Ver alertas
              </Typography>
              <Typography variant="caption" className="text-white/70 mt-1">
                Alertas en tu zona
              </Typography>
            </View>
          </View>
        </View>

        {/* Información de estado */}
        <View style={styles.statusCard}>
          <Typography variant="body" className="text-white font-semibold">
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
