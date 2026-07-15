import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { useAuthStore } from '@/features/auth';
import { useReporteFeature } from '@/entities/reporte';
import { useAlertaFeature } from '@/entities/alerta';
import { useGetKpisCiudadano } from '@/entities/analitica';
import { router, useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

export default function CiudadanoHome() {
  const user = useAuthStore((s) => s.user);
  const { misReportes, isLoading: lr, error: er } = useReporteFeature();
  const { misAlertas, isLoading: la, error: ea } = useAlertaFeature();
  const { data: kpis, isLoading: lk, error: ek } = useGetKpisCiudadano();
  const qc = useQueryClient();
  const isLoading = lr || la || lk;
  const errorMsg = er || ea || (ek instanceof Error ? ek.message : null);
  const [refreshing, setRefreshing] = useState(false);
  const activeAlertas = misAlertas.filter(
    (a) => a.estado !== 'RESUELTA' && a.estado !== 'DESCARTADA',
  ).length;

  const wa = useRef(new Animated.Value(0)).current;
  const pa = useRef(new Animated.Value(0.3)).current;
  const ka = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const wr = wa.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '25deg'] });

  useFocusEffect(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(wa, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(wa, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );
  useFocusEffect(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      if (!isLoading) return;
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pa, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(pa, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }, [isLoading]), // eslint-disable-line react-hooks/exhaustive-deps
  );
  useFocusEffect(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      if (!isLoading && kpis)
        ka.forEach((a, i) =>
          Animated.spring(a, {
            toValue: 1,
            delay: i * 100,
            friction: 6,
            useNativeDriver: true,
          }).start(),
        );
    }, [isLoading, kpis]), // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({ queryKey: ['reportes'] }),
      qc.invalidateQueries({ queryKey: ['alertas'] }),
      qc.invalidateQueries({ queryKey: ['analitica'] }),
    ]);
    setRefreshing(false);
  }, [qc]);

  const h = new Date().getHours();
  const saludo = h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches';
  const nombre = user?.nombre || 'Ciudadano';
  const kpis_arr = [
    {
      icon: 'fire' as const,
      value: kpis?.total_reportadas ?? misReportes.length,
      label: 'Reportes',
      accent: 'bg-red-500',
      col: '#EF4444',
    },
    {
      icon: 'bell-ring' as const,
      value: kpis?.activas ?? activeAlertas,
      label: 'Alertas',
      accent: 'bg-orange-500',
      col: '#F97316',
    },
    {
      icon: 'handshake' as const,
      value: kpis?.resueltas ?? 0,
      label: 'Contribuciones',
      accent: 'bg-green-500',
      col: '#22C55E',
    },
  ] as const;
  const actions = [
    {
      icon: 'fire',
      label: 'Reportar incendio',
      route: '/(ciudadano)/crear-reporte' as const,
      col: '#EF4444',
    },
    {
      icon: 'map' as const,
      label: 'Ver mapa',
      route: '/(ciudadano)/mapa' as const,
      col: '#3B82F6',
    },
    {
      icon: 'bell' as const,
      label: 'Mis alertas',
      route: '/(ciudadano)/alertas' as const,
      col: '#F97316',
    },
    {
      icon: 'account-circle' as const,
      label: 'Perfil',
      route: '/(ciudadano)/perfil' as const,
      col: '#8B5CF6',
    },
  ] as const;
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (!errorMsg) {
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
    setShowToast(true);
  }, [errorMsg]);

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        <View className="mb-10 rounded-3xl bg-slate-900 px-6 pb-8 pt-8">
          <View className="flex-row items-center">
            <Animated.View style={{ transform: [{ rotate: wr }] }}>
              <MaterialCommunityIcons name="hand-wave" size={32} color="#FCD34D" />
            </Animated.View>
            <View className="ml-3 flex-1">
              <Typography variant="h1" className="text-white">
                ¡Hola, {nombre}!
              </Typography>
              <Typography variant="body" className="mt-0.5 text-gray-400">
                {saludo}, bienvenido a FocoCero
              </Typography>
            </View>
          </View>
          <View className="mt-5 h-0.5 w-20 rounded-full bg-white/20" />
        </View>
        {isLoading ? (
          <View className="mb-10 flex-row">
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                className="mr-2 flex-1 rounded-2xl bg-slate-800 p-4"
                style={{ opacity: pa }}
              >
                <View className="mb-8 h-4 w-12 rounded bg-slate-700" />
                <View className="h-8 w-16 rounded bg-slate-700" />
              </Animated.View>
            ))}
          </View>
        ) : (
          <View className="mb-10 flex-row">
            {kpis_arr.map((k, i) => (
              <Animated.View
                key={k.label}
                className={`relative flex-1 overflow-hidden rounded-2xl bg-[#1E293B] p-4 ${i === 1 ? 'mx-2' : i === 2 ? '' : ''}`}
                style={{ transform: [{ scale: ka[i] }] }}
              >
                <View className={`absolute left-0 top-0 h-full w-1 ${k.accent}`} />
                <MaterialCommunityIcons name={k.icon} size={20} color={k.col} />
                <Typography
                  variant="h2"
                  className={`mt-3 font-bold ${k.accent === 'bg-red-500' ? 'text-red-500' : k.accent === 'bg-orange-500' ? 'text-orange-500' : 'text-green-500'}`}
                >
                  {k.value}
                </Typography>
                <Typography variant="caption" className="mt-0.5 text-gray-400">
                  {k.label}
                </Typography>
              </Animated.View>
            ))}
          </View>
        )}
        <View className="mb-10 flex-row flex-wrap justify-between">
          {actions.map((a) => (
            <TouchableOpacity
              key={a.label}
              className="mb-3 w-[48%] flex-row items-center rounded-2xl bg-slate-800/80 p-4"
              activeOpacity={0.7}
              onPress={() => router.push(a.route)}
            >
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-700/60">
                <MaterialCommunityIcons name={a.icon} size={22} color={a.col} />
              </View>
              <Typography variant="body" className="flex-1 text-sm font-medium text-white">
                {a.label}
              </Typography>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#475569" />
            </TouchableOpacity>
          ))}
        </View>
        {misReportes.length === 0 && !isLoading ? (
          <View className="mb-10 items-center rounded-2xl bg-slate-800/50 py-14">
            <MaterialCommunityIcons name="clipboard-text-outline" size={52} color="#475569" />
            <Typography variant="body" className="mt-4 text-gray-500">
              Aún no hay reportes
            </Typography>
            <Typography variant="caption" className="mt-1 text-gray-600">
              Tus reportes aparecerán aquí
            </Typography>
          </View>
        ) : (
          <View className="mb-10">
            <Typography variant="h3" className="mb-4 font-semibold text-white">
              Mis reportes recientes
            </Typography>
            {misReportes.slice(0, 3).map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() =>
                  router.push({ pathname: '/(ciudadano)/reporte/[id]', params: { id: r.id } })
                }
                className="mb-3 rounded-xl bg-slate-800 p-4 active:opacity-80"
              >
                <Typography variant="body" className="font-medium text-white">
                  {r.titulo}
                </Typography>
                <View className="mt-3 flex-row items-center justify-between">
                  <Typography
                    variant="caption"
                    className={`rounded-full px-3 py-1 text-white ${r.estado === 'PENDIENTE' ? 'bg-yellow-500' : r.estado === 'EN_PROCESO' ? 'bg-blue-500' : r.estado === 'RESUELTO' ? 'bg-green-500' : 'bg-gray-500'}`}
                  >
                    {r.estado.replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {showToast && errorMsg && (
          <View className="mb-6 rounded-2xl bg-red-500/90 px-5 py-4">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="alert-circle" size={20} color="white" />
              <Typography variant="body" className="ml-2 flex-1 text-sm text-white">
                {errorMsg}
              </Typography>
              <TouchableOpacity onPress={() => setShowToast(false)}>
                <MaterialCommunityIcons name="close" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}
