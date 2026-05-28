// app/(brigadista)/perfil.tsx - Perfil Brigadista
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { Avatar } from '@/shared/ui/atoms/Avatar';
import { Card } from '@/shared/ui/atoms/Card';
import { Divider } from '@/shared/ui/atoms/Divider';
import { useAuthStore } from '@/features/auth';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export default function BrigadistaPerfil() {
  const { user, logout } = useAuthStore();
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { misReportes, isLoading: loadingReportes } = useReporteFeature();
  const { misAlertas, isLoading: loadingAlertas } = useAlertaFeature();

  const statsLoading = loadingReportes || loadingAlertas;

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de abandonar el terreno?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar',
        style: 'destructive',
        onPress: () => {
          try {
            logout();
            router.replace('/(auth)/login');
          } catch {
            setError('Error al cerrar sesión. Intenta nuevamente.');
          }
        },
      },
    ]);
  };

  const menuItems: { icon: IconName; label: string; onPress: () => void; danger?: boolean }[] = [
    { icon: 'account-edit', label: 'Editar Perfil', onPress: () => {} },
    { icon: 'bell-outline', label: 'Notificaciones', onPress: () => {} },
    { icon: 'map-marker-radius', label: 'Mi Zona', onPress: () => {} },
    { icon: 'account-hard-hat', label: 'Estado Brigadista', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Ayuda', onPress: () => {} },
    { icon: 'logout', label: 'Cerrar Sesión', onPress: handleLogout, danger: true },
  ];

  return (
    <SafeAreaLayout variant="background">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.header}>
            <LoadingSkeleton lines={5} lineHeight={20} />
          </View>
        ) : (
          <>
            {error && (
              <View style={styles.errorContainer}>
                <ErrorBanner message={error} onRetry={() => setError(null)} />
              </View>
            )}
            <View style={styles.header}>
              <Typography variant="h1">Mi Perfil</Typography>
            </View>

            <View style={styles.profileCard}>
              <Avatar size="xl" fallbackInitials={user?.nombre ? user.nombre[0] : 'B'} />
              <Typography variant="h2" className="mt-4">
                {user?.nombre || 'Brigadista'} {user?.apellido || ''}
              </Typography>
              <View style={styles.rolBadge}>
                <MaterialCommunityIcons name="shield-account" size={14} color="#FFF" />
                <Typography variant="caption" className="ml-1 text-white">
                  Brigadista
                </Typography>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Typography variant="h2">{statsLoading ? '-' : misAlertas.length}</Typography>
                <Typography variant="caption" color="secondary">
                  Alertas Atendidas
                </Typography>
              </Card>
              <Card style={styles.statCard}>
                <Typography variant="h2">{statsLoading ? '-' : misReportes.length}</Typography>
                <Typography variant="caption" color="secondary">
                  Reportes
                </Typography>
              </Card>
            </View>

            <View style={styles.statusCard}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
              <View style={styles.statusContent}>
                <Typography variant="body">Estado: Activo</Typography>
                <Typography variant="caption" color="secondary">
                  Disponible para emergencias
                </Typography>
              </View>
            </View>

            <Card style={styles.menuCard}>
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                    accessibilityLabel={item.label}
                    accessibilityRole="button"
                  >
                    <MaterialCommunityIcons
                      name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={22}
                      color={item.danger ? '#EF4444' : '#6B7280'}
                    />
                    <Typography
                      variant="body"
                      className="ml-3 flex-1"
                      style={item.danger ? { color: '#EF4444' } : {}}
                    >
                      {item.label}
                    </Typography>
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
                  </TouchableOpacity>
                  {index < menuItems.length - 1 && <Divider className="my-2" />}
                </React.Fragment>
              ))}
            </Card>

            <Button
              variant="outline"
              label="Abandonar Terreno"
              className="mt-6"
              onPress={handleLogout}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 16 },
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  rolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statCard: { flex: 1, alignItems: 'center', padding: 16 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  statusContent: { marginLeft: 12 },
  menuCard: { marginTop: 24, padding: 0 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minWidth: 44,
    minHeight: 44,
  },
  errorContainer: {
    marginBottom: 16,
  },
});
