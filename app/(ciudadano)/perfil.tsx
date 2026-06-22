// app/(ciudadano)/perfil.tsx - Perfil de ciudadano
import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore, authApi } from '@/features/auth';
import { performLogout } from '@/features/auth/utils/logout.utils';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';
import { UserRole } from '@/entities/usuario';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function Perfil() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { misReportes, isLoading: loadingReportes } = useReporteFeature();
  const { misAlertas, isLoading: loadingAlertas } = useAlertaFeature();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const statsLoading = loadingReportes || loadingAlertas;

  const upgradeMutation = useMutation({
    mutationFn: (pwd: string) => authApi.setPassword({ password: pwd }),
    onSuccess: () => {
      Alert.alert('Cuenta actualizada', 'Tu cuenta ha sido actualizada correctamente.');
      setPassword('');
      setConfirmPassword('');
      setUpgradeError(null);
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
    },
    onError: (err: Error) => {
      setUpgradeError(err.message || 'Error al actualizar la cuenta');
    },
  });

  const infoItems = [
    { id: 'nombre', label: 'Nombre', value: user?.nombre || '', icon: 'account-outline' as const },
    { id: 'email', label: 'Email', value: user?.email || '', icon: 'email-outline' as const },
    { id: 'rut', label: 'RUT', value: user?.rut || '', icon: 'badge-account-outline' as const },
    {
      id: 'telefono',
      label: 'Teléfono',
      value: user?.telefono || '',
      icon: 'phone-outline' as const,
    },
  ];

  const configItems = [
    { id: 'notifications', label: 'Notificaciones', icon: 'bell-outline' as const },
    { id: 'location', label: 'Ubicación', icon: 'map-marker-outline' as const },
    { id: 'privacy', label: 'Privacidad', icon: 'shield-outline' as const },
    { id: 'help', label: 'Ayuda', icon: 'help-circle-outline' as const },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['alertas'] }),
      queryClient.invalidateQueries({ queryKey: ['reportes'] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await performLogout();
          } catch {
            console.error('Error al cerrar sesión');
          } finally {
            router.replace('/');
          }
        },
      },
    ]);
  };

  const handleInfoPress = (item: (typeof infoItems)[0]) => {
    Alert.alert(item.label, item.value || 'No disponible', [
      { text: 'Cerrar', style: 'cancel' },
      {
        text: 'Editar',
        onPress: () =>
          Alert.alert('Próximamente', 'La edición de perfil estará disponible pronto.'),
      },
    ]);
  };

  const handleConfigPress = (item: (typeof configItems)[0]) => {
    Alert.alert(item.label, 'Esta funcionalidad estará disponible próximamente.');
  };

  const handleUpgrade = () => {
    setUpgradeError(null);

    if (!password) {
      setUpgradeError('La contraseña es requerida');
      return;
    }
    if (password.length < 6) {
      setUpgradeError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setUpgradeError('Las contraseñas no coinciden');
      return;
    }

    upgradeMutation.mutate(password);
  };

  const getRoleBadgeStyle = () => {
    switch (user?.rol) {
      case UserRole.BRIGADISTA:
        return 'bg-blue-600';
      case UserRole.ADMIN:
        return 'bg-red-600';
      case UserRole.INVITADO:
        return 'bg-yellow-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getRoleLabel = () => {
    switch (user?.rol) {
      case UserRole.BRIGADISTA:
        return 'Brigadista';
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.INVITADO:
        return 'Invitado';
      default:
        return 'Ciudadano';
    }
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="flex-1 px-4 pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        {/* Profile Header */}
        <View className="mb-6 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-slate-700">
            <MaterialCommunityIcons name="account" size={48} color="#FFFFFF" />
          </View>
          <Typography variant="h2" className="mt-4 text-white">
            {user?.nombre || 'Ciudadano'}
          </Typography>
          <Typography variant="body" className="mt-1 text-gray-400">
            {user?.email || 'Sin email'}
          </Typography>
          <View className={`mt-3 rounded-full px-4 py-1 ${getRoleBadgeStyle()}`}>
            <Typography variant="caption" className="text-white">
              {getRoleLabel()}
            </Typography>
          </View>
        </View>

        {/* Stats Row */}
        <View className="mb-6 flex-row rounded-2xl bg-slate-800 p-5">
          <View className="flex-1 items-center">
            <Typography variant="h2" className="text-white">
              {statsLoading ? '-' : misReportes.length}
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Reportes
            </Typography>
          </View>
          <View className="h-12 w-px bg-slate-700" />
          <View className="flex-1 items-center">
            <Typography variant="h2" className="text-white">
              {statsLoading ? '-' : misAlertas.length}
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Alertas
            </Typography>
          </View>
          <View className="h-12 w-px bg-slate-700" />
          <View className="flex-1 items-center">
            <Typography variant="h2" className="text-white">
              0
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Contribuciones
            </Typography>
          </View>
        </View>

        {/* Información personal */}
        <View className="mb-6">
          <Typography variant="h3" className="mb-4 text-white">
            Información personal
          </Typography>
          <View className="overflow-hidden rounded-2xl bg-slate-800">
            {infoItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center border-b border-slate-700 p-4"
                onPress={() => handleInfoPress(item)}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name={item.icon} size={24} color="#9CA3AF" />
                <View className="ml-4 flex-1">
                  <Typography variant="caption" className="text-gray-400">
                    {item.label}
                  </Typography>
                  <Typography variant="body" className="mt-0.5 text-white">
                    {item.value || 'No disponible'}
                  </Typography>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Configuración */}
        <View className="mb-6">
          <Typography variant="h3" className="mb-4 text-white">
            Configuración
          </Typography>
          <View className="overflow-hidden rounded-2xl bg-slate-800">
            {configItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center border-b border-slate-700 p-4"
                onPress={() => handleConfigPress(item)}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name={item.icon} size={24} color="#9CA3AF" />
                <Typography variant="body" className="ml-4 flex-1 text-white">
                  {item.label}
                </Typography>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upgrade from Invitado */}
        {user?.rol === UserRole.INVITADO && (
          <View className="mb-6 rounded-2xl border border-yellow-700/50 bg-yellow-900/50 p-5">
            <Typography variant="body" className="font-semibold text-yellow-400">
              ¿Quieres convertirte en ciudadano?
            </Typography>
            <Typography variant="body" className="mt-2 text-gray-400">
              Crea una contraseña para tener una cuenta completa
            </Typography>

            <View className="mt-4">
              <View className="mb-3 h-14 flex-row items-center rounded-2xl border border-slate-700 bg-slate-900/50 px-4">
                <TextInput
                  className="flex-1 text-base text-slate-100"
                  placeholder="Contraseña"
                  placeholderTextColor="#64748B"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View className="mb-3 h-14 flex-row items-center rounded-2xl border border-slate-700 bg-slate-900/50 px-4">
                <TextInput
                  className="flex-1 text-base text-slate-100"
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#64748B"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              {upgradeError && (
                <Typography variant="caption" className="mb-2 text-red-500">
                  {upgradeError}
                </Typography>
              )}

              <TouchableOpacity
                className="h-14 items-center justify-center rounded-2xl bg-yellow-600"
                onPress={handleUpgrade}
                disabled={upgradeMutation.isPending}
                accessibilityLabel="Crear cuenta completa"
                accessibilityRole="button"
              >
                <Typography variant="body" className="font-semibold text-white">
                  {upgradeMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta completa'}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Cerrar sesión */}
        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-2xl bg-slate-800 p-4"
          onPress={handleLogout}
          accessibilityLabel="Cerrar sesión"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
          <Typography variant="body" className="ml-3 text-red-500">
            Cerrar sesión
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaLayout>
  );
}
