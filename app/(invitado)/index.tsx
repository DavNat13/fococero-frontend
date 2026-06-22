import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { useQueryClient } from '@tanstack/react-query';

const FEATURES = [
  {
    icon: 'bell-ring',
    title: 'Alertas en tiempo real',
    desc: 'Recibe notificaciones de incendios y emergencias cerca de ti',
  },
  {
    icon: 'map',
    title: 'Mapa interactivo',
    desc: 'Visualiza focos activos y zonas de riesgo en tu área',
  },
  {
    icon: 'fire',
    title: 'Reportar incendios',
    desc: 'Ayuda a tu comunidad reportando fuegos o riesgos',
  },
  {
    icon: 'account-group',
    title: 'Trabajo en equipo',
    desc: 'Apoya a brigadistas y servicios de emergencia',
  },
];

export default function InvitadoHome() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="flex-1 px-4 pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        {/* Hero */}
        <View className="mb-8 mt-4 items-center pt-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <MaterialCommunityIcons name="fire" size={44} color="#EF4444" />
          </View>
          <Typography variant="h1" className="text-center text-white">
            FocoCero
          </Typography>
          <Typography variant="body" className="mt-2 text-center text-gray-400">
            Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}
          </Typography>
        </View>

        {/* CTA Buttons */}
        <View className="mb-8 gap-3">
          <TouchableOpacity
            className="rounded-2xl bg-red-600 p-5"
            onPress={() => router.push('/(auth)/login')}
            accessibilityLabel="Iniciar sesión"
            accessibilityRole="button"
          >
            <Typography variant="body" className="text-center font-semibold text-white">
              Iniciar sesión
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-2xl border border-slate-700 bg-slate-800 p-5"
            onPress={() => router.push('/(auth)/register')}
            accessibilityLabel="Crear cuenta"
            accessibilityRole="button"
          >
            <Typography variant="body" className="text-center font-semibold text-white">
              Crear cuenta
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <Typography variant="h3" className="mb-4 text-white">
          ¿Qué puedes hacer?
        </Typography>
        <View className="mb-8 gap-4">
          {FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-start rounded-2xl bg-slate-800 p-4">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                <MaterialCommunityIcons name={feature.icon as any} size={24} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Typography variant="body" className="font-semibold text-white">
                  {feature.title}
                </Typography>
                <Typography variant="caption" className="mt-1 text-gray-400">
                  {feature.desc}
                </Typography>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Typography variant="caption" className="mb-4 text-center text-gray-600">
          FocoCero © 2026
        </Typography>
      </ScrollView>
    </SafeAreaLayout>
  );
}
