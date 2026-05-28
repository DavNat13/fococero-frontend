// app/(admin)/index.tsx - Dashboard Admin
import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { ActivityItem } from '@/shared/ui/molecules/ActivityItem';
import { useDashboardMetrics } from '@/entities/analitica';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

interface QuickAction {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  screen: string;
}

const quickActions: QuickAction[] = [
  { title: 'Gestionar Usuarios', icon: 'account-cog', screen: 'usuarios' },
  { title: 'Ver Mapa', icon: 'map', screen: 'mapa' },
  { title: 'Configuración', icon: 'cog', screen: 'config' },
];

export default function AdminDashboard() {
  const { kpis, isLoading, error } = useDashboardMetrics();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['analitica'] });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        <View style={styles.header}>
          <Typography variant="h1">Panel de Administración</Typography>
          <Typography variant="body" color="secondary">
            Bienvenido, Administrador
          </Typography>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={error} onRetry={() => {}} />
          </View>
        )}

        {isLoading ? (
          <View style={styles.kpiGrid}>
            <LoadingSkeleton lines={4} lineHeight={80} />
          </View>
        ) : (
          <>
            <View style={styles.kpiGrid}>
              <Card style={styles.kpiCard}>
                <View style={[styles.kpiIcon, { backgroundColor: '#3B82F6' + '20' }]}>
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#3B82F6" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.totalAlertas ?? 0}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Total Alertas
                </Typography>
              </Card>
              <Card style={styles.kpiCard}>
                <View style={[styles.kpiIcon, { backgroundColor: '#EF4444' + '20' }]}>
                  <MaterialCommunityIcons name="fire" size={24} color="#EF4444" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.focosActivos ?? 0}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Focos Activos
                </Typography>
              </Card>
              <Card style={styles.kpiCard}>
                <View style={[styles.kpiIcon, { backgroundColor: '#10B981' + '20' }]}>
                  <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.alertasResueltas ?? 0}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Alertas Resueltas
                </Typography>
              </Card>
              <Card style={styles.kpiCard}>
                <View style={[styles.kpiIcon, { backgroundColor: '#F59E0B' + '20' }]}>
                  <MaterialCommunityIcons name="truck-delivery" size={24} color="#F59E0B" />
                </View>
                <Typography variant="h2" className="mt-2">
                  {kpis?.dispatchEnviados ?? 0}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Despachos
                </Typography>
              </Card>
            </View>

            <Typography variant="h3" className="mb-4 mt-6">
              Acciones Rápidas
            </Typography>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => {
                    const routes = {
                      usuarios: '/(admin)/usuarios',
                      mapa: '/(admin)/mapa',
                      config: '/(admin)/config',
                    } as const;
                    const route = routes[action.screen as keyof typeof routes];
                    if (route) router.push(route);
                  }}
                  accessibilityLabel={action.title}
                  accessibilityRole="button"
                >
                  <View style={styles.actionIcon}>
                    <MaterialCommunityIcons
                      name={action.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={28}
                      color="#EF4444"
                    />
                  </View>
                  <Typography variant="body" className="mt-2 text-center">
                    {action.title}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.recentSection}>
              <Typography variant="h3" className="mb-4">
                Actividad Reciente
              </Typography>
              <ActivityItem
                icon="account-plus"
                iconColor="#10B981"
                title="Nuevo usuario registrado"
                time="Hace 5 minutos"
              />
              <ActivityItem
                icon="alert"
                iconColor="#EF4444"
                title="Alerta críticas en sector norte"
                time="Hace 15 minutos"
              />
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
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    minWidth: 44,
    minHeight: 44,
  },
  errorContainer: {
    marginBottom: 16,
  },
  actionIcon: { marginBottom: 8 },
  recentSection: { marginTop: 8 },
  activityCard: { marginBottom: 8, padding: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center' },
  activityContent: { marginLeft: 12, flex: 1 },
});
