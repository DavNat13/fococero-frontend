import { useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useGetTodasAlertas } from '@/entities/alerta/api/queries';
import { useTodosReportes } from '@/entities/reporte';
import type { AlertaEstado } from '@/entities/alerta';
import {
  MapContainer,
  MapHeader,
  MapBanner,
  MapLegend,
  GpsButton,
  CalloutContent,
  MarkerPin,
  FabButton,
  ActionSheet,
  LayerSelector,
  MarkerCountBadge,
  RefreshButton,
} from '@/shared/ui/map';
import { MAP_STYLES, DEFAULT_LAYER } from '@/shared/ui/map/map-styles.config';

const ACTIVE: AlertaEstado[] = ['REPORTADA', 'EN_REVISION', 'DERIVADA'];
const RESOLVED: AlertaEstado[] = ['RESUELTA', 'DESCARTADA'];
type Filtro = 'TODOS' | 'ALERTAS' | 'REPORTES';

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const router = useRouter();
  const [userLoc, setUL] = useState<{ lat: number; lng: number } | null>(null);
  const [permBanner, setPerm] = useState<string | null>(null);
  const [fetchError, setErr] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [selected, setSel] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [isLocating, setLocating] = useState(false);
  const [selectedLayer, setLayer] = useState(DEFAULT_LAYER);
  const mapStyle = MAP_STYLES[selectedLayer];

  useEffect(() => {
    let m = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!m) return;
      if (status !== 'granted') {
        setPerm('Permiso de ubicación denegado');
        return;
      }
      try {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (!m) return;
        cameraRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 13,
          duration: 500,
        });
        setUL({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        if (m) setPerm('Error al obtener ubicación');
      }
    })();
    return () => {
      m = false;
    };
  }, []);

  const {
    data: alts = [],
    error: altErr,
    isLoading: lAlt,
    refetch: refAlt,
  } = useGetTodasAlertas({ refetchInterval: 20000 });
  const {
    todosReportes: reps = [],
    error: repErr,
    isLoading: lRep,
    refetch: refRep,
  } = useTodosReportes({ refetchInterval: 20000 });

  useEffect(() => {
    const e = [altErr?.message, repErr].filter(Boolean);
    setErr(e.length ? (e[0] ?? null) : null);
  }, [altErr, repErr]);

  const centerOnUser = useCallback(async () => {
    setLocating(true);
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setUL({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      cameraRef.current?.flyTo({
        center: [pos.coords.longitude, pos.coords.latitude],
        zoom: 13,
        duration: 500,
      });
    } catch {
      if (userLoc)
        cameraRef.current?.flyTo({ center: [userLoc.lng, userLoc.lat], zoom: 13, duration: 500 });
    }
    setLocating(false);
  }, [userLoc]);

  const acciones = [
    {
      icon: 'fire' as const,
      label: 'Reportar incendio',
      color: '#EF4444',
      onPress: () => router.push('/(brigadista)/crear-reporte?tipo=incendio' as any),
    },
    {
      icon: 'fire' as const,
      label: 'Reportar quema controlada',
      color: '#F59E0B',
      onPress: () => router.push('/(brigadista)/crear-reporte?tipo=quema_controlada' as any),
    },
    {
      icon: 'smoke-detector' as const,
      label: 'Reportar columna de humo',
      color: '#F97316',
      onPress: () => router.push('/(brigadista)/crear-reporte?tipo=columna_humo' as any),
    },
    {
      icon: 'map-marker-plus' as const,
      label: 'Marcar punto de interés',
      color: '#3B82F6',
      onPress: () => router.push('/(brigadista)/puntos-interes/crear' as any),
    },
    {
      icon: 'radar' as const,
      label: 'Iniciar patrullaje',
      color: '#8B5CF6',
      onPress: () => router.push('/(brigadista)/patrullaje/nuevo' as any),
    },
  ];
  const mostrarAlts = filtro === 'TODOS' || filtro === 'ALERTAS';
  const mostrarReps = filtro === 'TODOS' || filtro === 'REPORTES';
  const banners = [!!permBanner, !!fetchError].filter(Boolean).length;

  return (
    <View className="flex-1 bg-[#0C0F17]">
      <MapContainer cameraRef={cameraRef} mapStyle={mapStyle}>
        {!lAlt &&
          mostrarAlts &&
          alts.map((a) => {
            if (!a.ubicacion?.coordinates) return null;
            const [lng, lat] = a.ubicacion.coordinates;
            const es = a.estado;
            const activa = es ? ACTIVE.includes(es) : false;
            const resuelta = es ? RESOLVED.includes(es) : false;
            const color = activa ? '#EF4444' : resuelta ? '#22C55E' : '#F97316';
            const id = `a-${a.id}`;
            return (
              <MapLibreGL.Marker
                key={id}
                id={id}
                lngLat={[Number(lng), Number(lat)]}
                anchor="center"
                onPress={() => setSel(id)}
              >
                <View>
                  <MarkerPin color={color} />
                  {selected === id && (
                    <MapLibreGL.Callout title="">
                      <CalloutContent
                        title={a.tipo}
                        description={a.descripcion}
                        statusLabel={a.estado}
                        statusColor={activa ? 'bg-red-500' : 'bg-green-500'}
                      />
                    </MapLibreGL.Callout>
                  )}
                </View>
              </MapLibreGL.Marker>
            );
          })}
        {!lRep &&
          mostrarReps &&
          reps.map((r) => (
            <MapLibreGL.Marker
              key={`r-${r.id}`}
              id={`r-${r.id}`}
              lngLat={[Number(r.longitud), Number(r.latitud)]}
              anchor="center"
              onPress={() => setSel(`r-${r.id}`)}
            >
              <View>
                <MarkerPin color="#F97316" />
                {selected === `r-${r.id}` && (
                  <MapLibreGL.Callout title="">
                    <CalloutContent
                      title={r.titulo}
                      description={r.descripcion}
                      statusLabel={r.estado}
                      statusColor="bg-orange-500"
                    />
                  </MapLibreGL.Callout>
                )}
              </View>
            </MapLibreGL.Marker>
          ))}
      </MapContainer>

      <MapHeader title="Mapa de Focos" subtitle="Alertas y reportes de incendios" />
      {permBanner && <MapBanner message={permBanner} type="permission" topOffset={112} />}
      {fetchError && (
        <MapBanner message={fetchError} type="error" topOffset={banners > 1 ? 160 : 112} />
      )}

      <LayerSelector selectedLayer={selectedLayer} onLayerChange={setLayer} top={insets.top + 12} />
      <RefreshButton
        onRefresh={() => {
          refAlt();
          refRep();
        }}
        top={insets.top + 12}
      />
      <MarkerCountBadge count={alts.length + reps.length} />
      <GpsButton
        onPress={centerOnUser}
        isLocating={isLocating}
        className="absolute bottom-36 left-4"
      />
      <View className="absolute bottom-20 right-4">
        <FabButton
          onPress={() => setSheetVisible(true)}
          icon="plus"
          label="Reportar foco de incendio"
        />
      </View>
      <ActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        actions={acciones}
      />
      <MapLegend
        items={[
          { color: '#EF4444', label: 'Alerta activa' },
          { color: '#22C55E', label: 'Alerta resuelta' },
          { color: '#F97316', label: 'Reporte' },
        ]}
      />

      <View className="absolute bottom-8 left-4 right-4 flex-row items-center justify-center gap-2">
        {(['TODOS', 'ALERTAS', 'REPORTES'] as Filtro[]).map((f) => {
          const active = filtro === f;
          const label = f === 'TODOS' ? 'Todos' : f === 'ALERTAS' ? 'Alertas' : 'Reportes';
          return (
            <TouchableOpacity
              key={f}
              className={`rounded-full px-5 py-2.5 ${active ? 'bg-red-600' : 'bg-slate-700/80'}`}
              onPress={() => setFiltro(f)}
              activeOpacity={0.8}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-300'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
