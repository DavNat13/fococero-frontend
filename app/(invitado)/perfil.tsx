import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/features/auth';
import { authApi } from '@/features/auth/api/auth.api';
import { performLogout } from '@/features/auth/utils/logout.utils';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '@/shared/ui/molecules/ConfirmAlert';

export default function InvitadoPerfil() {
  const { user, setAuthData } = useAuthStore();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgradeError(null);
    if (!password || password.length < 6) {
      setUpgradeError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setUpgradeError('Las contraseñas no coinciden');
      return;
    }
    setIsUpgrading(true);
    try {
      const response = await authApi.convertirCuenta({ password });
      if (!response.success) {
        throw new Error(response.error.message || 'Error al crear cuenta');
      }
      setAuthData(response.data);
      showAlert({
        title: 'Cuenta creada',
        description: 'Ahora eres un ciudadano de FocoCero',
        variant: 'success',
        confirmOnly: true,
        confirmLabel: 'Aceptar',
        onConfirm: () => {},
      });
      await queryClient.invalidateQueries();
      router.replace('/(ciudadano)');
    } catch (err) {
      setUpgradeError(err instanceof Error ? err.message : 'Error al crear cuenta');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleLogout = () => {
    showAlert({
      title: 'Cerrar sesión',
      description: '¿Estás seguro?',
      variant: 'danger',
      confirmLabel: 'Cerrar sesión',
      onConfirm: async () => {
        try {
          await performLogout();
          router.replace('/');
        } catch {
          console.error('Error al cerrar sesión');
        }
      },
    });
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView className="flex-1 px-4 pb-8" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="mb-6 mt-4 items-center pt-8">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-slate-700">
            <MaterialCommunityIcons name="account-question" size={48} color="#FFFFFF" />
          </View>
          <Typography variant="h2" className="mt-4 text-white">
            {user?.nombre || 'Invitado'}
          </Typography>
          <Typography variant="body" className="mt-1 text-gray-400">
            {user?.email || 'Sin email'}
          </Typography>
          <View className="mt-3 flex-row items-center rounded-full bg-yellow-600 px-4 py-1">
            <MaterialCommunityIcons name="account-clock" size={14} color="#FFFFFF" />
            <Typography variant="caption" className="ml-1 text-white">
              Invitado
            </Typography>
          </View>
        </View>

        {/* Upgrade Card */}
        <View className="mb-6 rounded-2xl border border-yellow-700/50 bg-yellow-900/50 p-5">
          <Typography variant="body" className="font-semibold text-yellow-400">
            ¿Quieres convertirte en ciudadano?
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Crea una contraseña para tener una cuenta completa y acceder a todas las funciones
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
              disabled={isUpgrading}
              accessibilityLabel="Crear cuenta completa"
              accessibilityRole="button"
            >
              <Typography variant="body" className="font-semibold text-white">
                {isUpgrading ? 'Creando cuenta...' : 'Crear cuenta completa'}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View className="overflow-hidden rounded-2xl bg-slate-800">
          <TouchableOpacity
            className="flex-row items-center border-b border-slate-700 p-4"
            onPress={() => router.push('/(auth)/login')}
            accessibilityLabel="Iniciar sesión"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="login" size={22} color="#9CA3AF" />
            <Typography variant="body" className="ml-3 flex-1 text-white">
              Iniciar sesión
            </Typography>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center border-b border-slate-700 p-4"
            onPress={() => router.push('/(auth)/register')}
            accessibilityLabel="Crear cuenta"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="account-plus" size={22} color="#9CA3AF" />
            <Typography variant="body" className="ml-3 flex-1 text-white">
              Crear cuenta
            </Typography>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={handleLogout}
            accessibilityLabel="Cerrar sesión"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
            <Typography variant="body" className="ml-3 flex-1 text-red-500">
              Cerrar sesión
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
}
