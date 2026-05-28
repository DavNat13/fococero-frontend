// app/(ciudadano)/perfil.tsx - Perfil de ciudadano
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/features/auth';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';
import { useQueryClient } from '@tanstack/react-query';

export default function Perfil() {
  const { user, logout } = useAuthStore();
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { misReportes, isLoading: loadingReportes } = useReporteFeature();
  const { misAlertas, isLoading: loadingAlertas } = useAlertaFeature();

  const statsLoading = loadingReportes || loadingAlertas;

  const menuItems = [
    { id: 'notifications', label: 'Notificaciones', icon: 'bell-outline' as const },
    { id: 'location', label: 'Ubicación', icon: 'map-marker-outline' as const },
    { id: 'privacy', label: 'Privacidad', icon: 'shield-outline' as const },
    { id: 'help', label: 'Ayuda', icon: 'help-circle-outline' as const },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['alertas'] });
    await queryClient.invalidateQueries({ queryKey: ['reportes'] });
    setRefreshing(false);
  }, [queryClient]);

  const handleLogout = () => {
    try {
      logout();
    } catch {
      setError('Error al cerrar sesión. Intenta nuevamente.');
    }
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        {isLoading ? (
          <View style={styles.header}>
            <LoadingSkeleton lines={4} lineHeight={20} />
          </View>
        ) : (
          <>
            {error && (
              <View style={styles.errorContainer}>
                <ErrorBanner message={error} onRetry={() => setError(null)} />
              </View>
            )}
            {/* Header de perfil */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="account" size={48} color="#FFFFFF" />
              </View>
              <Typography variant="h2" className="mt-4 text-white">
                {user?.nombre || 'Ciudadano'}
              </Typography>
              <Typography variant="body" className="mt-1 text-gray-400">
                {user?.email || 'Sin email'}
              </Typography>
              <View style={styles.roleBadge}>
                <Typography variant="caption" className="text-white">
                  {user?.rol === 'brigadista'
                    ? 'Brigadista'
                    : user?.rol === 'admin'
                      ? 'Administrador'
                      : 'Ciudadano'}
                </Typography>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Typography variant="h2" className="text-white">
                  {statsLoading ? '-' : misReportes.length}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Reportes
                </Typography>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typography variant="h2" className="text-white">
                  {statsLoading ? '-' : misAlertas.length}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Alertas
                </Typography>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typography variant="h2" className="text-white">
                  0
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Contribuciones
                </Typography>
              </View>
            </View>

            {/* Menú */}
            <View style={styles.menuSection}>
              <Typography variant="h3" className="mb-4 text-white">
                Configuración
              </Typography>
              <View style={styles.menuList}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    accessibilityLabel={item.label}
                    accessibilityRole="button"
                  >
                    <MaterialCommunityIcons
                      name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={24}
                      color="#9CA3AF"
                    />
                    <Typography variant="body" className="ml-4 flex-1 text-white">
                      {item.label}
                    </Typography>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botón de cerrar sesión */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessibilityLabel="Cerrar sesión"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
              <Typography variant="body" className="ml-3 text-red-500">
                Cerrar sesión
              </Typography>
            </TouchableOpacity>
          </>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuList: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    minWidth: 44,
    minHeight: 44,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    minWidth: 44,
    minHeight: 44,
  },
  errorContainer: {
    marginBottom: 16,
  },
});
