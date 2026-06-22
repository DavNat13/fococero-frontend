import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';
import { MaterialCommunityIcons as M } from '@expo/vector-icons';
import type { Alerta, AlertaEstado } from '@/entities/alerta';
const SV: Record<string, string> = {
  crítica: 'bg-red-500',
  alta: 'bg-amber-500',
  media: 'bg-blue-500',
  baja: 'bg-green-500',
};
const TI: Record<string, any> = {
  incendio: 'fire',
  humo: 'smoke-detector',
  quema: 'fire',
  inundacion: 'flood',
  accidente: 'car-wreck',
};
const ES = {
  REPORTADA: { d: 'bg-yellow-400', b: 'bg-yellow-500/15', t: 'text-yellow-400', l: 'Reportada' },
  EN_REVISION: { d: 'bg-blue-400', b: 'bg-blue-500/15', t: 'text-blue-400', l: 'En revisión' },
  DERIVADA: { d: 'bg-purple-400', b: 'bg-purple-500/15', t: 'text-purple-400', l: 'Derivada' },
  RESUELTA: { d: 'bg-green-400', b: 'bg-green-500/15', t: 'text-green-400', l: 'Resuelta' },
  DESCARTADA: { d: 'bg-gray-400', b: 'bg-gray-500/15', t: 'text-gray-400', l: 'Descartada' },
} as const;
const TC: Record<string, { bg: string; ic: string }> = {
  incendio: { bg: 'bg-red-500/20', ic: '#EF4444' },
  quema: { bg: 'bg-red-500/20', ic: '#EF4444' },
  humo: { bg: 'bg-orange-500/20', ic: '#F97316' },
  inundacion: { bg: 'bg-blue-500/20', ic: '#3B82F6' },
  accidente: { bg: 'bg-amber-500/20', ic: '#F59E0B' },
};
function ta(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60),
    d = Math.floor(h / 24);
  if (h < 24) return `hace ${h}h`;
  return d < 30 ? `hace ${d}d` : `${Math.floor(d / 30)}m`;
}
function hv(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371,
    r = (d: number) => (d * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function AlertaCard({
  alerta,
  userLocation,
  onDelete,
}: {
  alerta: Alerta;
  userLocation?: { lat: number; lng: number } | null;
  onDelete?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const tx = useRef(new Animated.Value(0)).current;
  const estado = (alerta.estado || 'REPORTADA') as AlertaEstado;
  const s = ES[estado],
    c = TC[alerta.tipo] || { bg: 'bg-slate-500/20', ic: '#94A3B8' };
  const sevColor = SV[alerta.gravedad || ''] || 'bg-gray-500';

  const dist = useMemo(() => {
    if (!userLocation || !alerta.ubicacion?.coordinates) return null;
    const [lng, lat] = alerta.ubicacion.coordinates;
    const d = hv(userLocation.lat, userLocation.lng, lat, lng);
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
  }, [userLocation, alerta.ubicacion]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) tx.setValue(Math.max(g.dx, -100));
      },
      onPanResponderRelease: (_, g) => {
        Animated.spring(tx, { toValue: g.dx < -50 ? -100 : 0, useNativeDriver: true }).start();
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const showMenu = () => {
    Alert.alert('Opciones', alerta.tipo, [
      { text: 'Editar', onPress: () => {} },
      { text: 'Eliminar', onPress: () => onDelete?.(alerta.id || ''), style: 'destructive' },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View className="mb-3 overflow-hidden rounded-2xl">
      <View className="absolute bottom-0 right-0 top-0 w-[100px] items-center justify-center rounded-r-2xl bg-red-500">
        <TouchableOpacity onPress={() => onDelete?.(alerta.id || '')} className="items-center">
          <M name="delete" size={22} color="white" />
          <Text className="mt-1 text-xs font-bold text-white">Eliminar</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={{ transform: [{ translateX: tx }] }} {...pan.panHandlers}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onLongPress={showMenu}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <View className="flex-row overflow-hidden rounded-2xl border border-white/5 bg-[#1E293B]">
              <View className={`w-1 ${sevColor}`} />
              <View className="flex-1 p-4">
                <View className="flex-row items-center">
                  <View className={`h-9 w-9 rounded-full ${c.bg} items-center justify-center`}>
                    <M name={TI[alerta.tipo] || 'alert-circle'} size={18} color={c.ic} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-base font-bold capitalize text-white" numberOfLines={1}>
                      {alerta.tipo}
                    </Text>
                  </View>
                  <Text className="mr-2 text-xs text-gray-400">
                    {ta(alerta.fecha_creacion || '')}
                  </Text>
                  <TouchableOpacity onPress={showMenu} className="p-1">
                    <M name="dots-vertical" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <View className="mt-3">
                  <Text
                    numberOfLines={expanded ? undefined : 2}
                    className="text-sm leading-5 text-gray-300"
                    onPress={() => setExpanded(!expanded)}
                  >
                    {alerta.descripcion || 'Sin descripción'}
                  </Text>
                  {!expanded && (alerta.descripcion?.length || 0) > 80 && (
                    <TouchableOpacity onPress={() => setExpanded(true)} className="mt-1">
                      <Text className="text-xs font-medium text-purple-400">Ver más</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View className="mt-4 flex-row items-center justify-between border-t border-white/5 pt-3">
                  <View className={`flex-row items-center rounded-full px-3 py-1.5 ${s.b}`}>
                    <View className={`h-2 w-2 rounded-full ${s.d} mr-2`} />
                    <Text className={`text-xs font-semibold ${s.t}`}>{s.l}</Text>
                  </View>
                  {dist && (
                    <View className="flex-row items-center">
                      <M name="map-marker" size={13} color="#64748B" />
                      <Text className="ml-1 text-xs text-gray-400">A {dist}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
