import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { useGetTodasAlertas } from '@/entities/alerta/api/queries';
import { useGetTodosReportes } from '@/entities/reporte/api/queries';
import {
  MapContainer,
  MapHeader,
  FilterBar,
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
import type { AlertaEstado } from '@/entities/alerta';
import type { Reporte } from '@/entities/reporte';

const ESTADOS_ACTIVOS: AlertaEstado[] = ['REPORTADA', 'EN_REVISION', 'DERIVADA'];
function pinColor(estado?: AlertaEstado) {
  return estado && ESTADOS_ACTIVOS.includes(estado) ? '#EF4444' : '#22C55E';
}
function estadoLabel(estado?: string) {
  const m: Record<string, string> = {
    REPORTADA: 'Reportada',
    EN_REVISION: 'En Revisión',
    DERIVADA: 'Derivada',
    RESUELTA: 'Resuelta',
    DESCARTADA: 'Descartada',
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En Proceso',
    RESUELTO: 'Resuelto',
    FALSA_ALARMA: 'Falsa Alarma',
  };
  return estado ? (m[estado] ?? estado) : '—';
}

const FILTERS = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ALERTAS', label: 'Alertas' },
  { key: 'REPORTES', label: 'Reportes' },
];

export default function AdminMapa() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const router = useRouter();
  const [userLoc, setUL] = useState<{ lat: number; lng: number } | null>(null);
  const [permStatus, setPS] = useState<Location.PermissionStatus | null>(null);
  const [locError, setLE] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('TODOS');
  const [selected, setSel] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [isLocating, setLocating] = useState(false);
  const [selectedLayer, setLayer] = useState(DEFAULT_LAYER);
  const mapStyle = MAP_STYLES[selectedLayer];

  const {
    data: alertas,
    isLoading: altLoad,
    error: altErr,
    refetch: refAlt,
  } = useGetTodasAlertas({ refetchInterval: 20000 });
  const {
    data: reportes,
    isLoading: repLoad,
    error: repErr,
    refetch: refRep,
  } = useGetTodosReportes({ refetchInterval: 20000 });
  const fetchError = altErr ?? repErr;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPS(status);
      if (status !== 'granted') {
        setLE('Permiso de ubicación denegado');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUL({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } catch (err: any) {
        setLE(err?.message ?? 'Error al obtener ubicación');
      }
    })();
  }, []);

  const filtAlt = useMemo(
    () => (!alertas || filter === 'REPORTES' ? [] : alertas),
    [alertas, filter],
  );
  const filtRep = useMemo(
    () => (!reportes || filter === 'ALERTAS' ? [] : reportes),
    [reportes, filter],
  );
  const actions = [
    {
      icon: 'fire' as const,
      label: 'Reportar incendio',
      color: '#EF4444',
      onPress: () => router.push('/(admin)/crear-reporte?tipo=incendio'),
    },
    {
      icon: 'fire' as const,
      label: 'Reportar quema controlada',
      color: '#F59E0B',
      onPress: () => router.push('/(admin)/crear-reporte?tipo=quema_controlada'),
    },
    {
      icon: 'smoke-detector' as const,
      label: 'Reportar columna de humo',
      color: '#F97316',
      onPress: () => router.push('/(admin)/crear-reporte?tipo=columna_humo'),
    },
    {
      icon: 'map-marker-plus' as const,
      label: 'Marcar punto de interés',
      color: '#3B82F6',
      onPress: () => router.push('/(admin)/puntos-interes/crear'),
    },
    {
      icon: 'radar' as const,
      label: 'Iniciar patrullaje',
      color: '#8B5CF6',
      onPress: () => router.push('/(admin)/patrullaje/nuevo'),
    },
  ];
  const reCenter = useCallback(async () => {
    setLocating(true);
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
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

  return (
    <SafeAreaLayout variant="background" className="p-0">
      <View className="relative flex-1">
        <MapContainer
          cameraRef={cameraRef}
          mapStyle={mapStyle}
          showCompass={false}
          trackUser={false}
        >
          {filtAlt.map((a) => {
            const c = a.ubicacion?.coordinates;
            if (!c || c.length < 2) return null;
            const id = `a-${a.id ?? Math.random()}`;
            return (
              <MapLibreGL.Marker
                key={id}
                id={id}
                lngLat={[Number(c[0]), Number(c[1])]}
                anchor="center"
                onPress={() => setSel(id)}
              >
                <View>
                  <MarkerPin color={pinColor(a.estado)} />
                  {selected === id && (
                    <MapLibreGL.Callout title="">
                      <CalloutContent
                        title={a.tipo}
                        description={a.descripcion}
                        statusLabel={estadoLabel(a.estado)}
                        statusColor={pinColor(a.estado)}
                      />
                    </MapLibreGL.Callout>
                  )}
                </View>
              </MapLibreGL.Marker>
            );
          })}
          {filtRep.map((r: Reporte) => (
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
                      statusLabel={estadoLabel(r.estado)}
                      statusColor="bg-[#F97316]"
                    />
                  </MapLibreGL.Callout>
                )}
              </View>
            </MapLibreGL.Marker>
          ))}
        </MapContainer>

        <MapHeader
          title="Mapa General"
          subtitle="Vista completa de todas las alertas"
          className="border-b border-[#1F2938]"
        />

        {permStatus === 'denied' && !fetchError && (
          <MapBanner message="Permiso de ubicación denegado" type="error" topOffset={72} />
        )}
        {locError && permStatus === 'granted' && !fetchError && (
          <MapBanner message={locError} type="warning" topOffset={72} />
        )}
        {fetchError && (
          <MapBanner message="Error al cargar datos del mapa" type="error" topOffset={72} />
        )}
        {(altLoad || repLoad) && (
          <View className="absolute right-4 top-[72px] z-10 rounded-full bg-[#0C0F17]/80 p-2.5">
            <ActivityIndicator size="small" color="#EA580C" />
          </View>
        )}

        <MapLegend
          items={[
            { color: '#EF4444', label: 'Alerta activa' },
            { color: '#22C55E', label: 'Alerta resuelta' },
            { color: '#F97316', label: 'Reporte' },
          ]}
        />
        <FilterBar options={FILTERS} activeKey={filter} onSelect={setFilter} />
        <LayerSelector
          selectedLayer={selectedLayer}
          onLayerChange={setLayer}
          top={insets.top + 12}
        />
        <RefreshButton
          onRefresh={() => {
            refAlt();
            refRep();
          }}
          top={insets.top + 12}
        />
        <MarkerCountBadge count={(alertas?.length ?? 0) + (reportes?.length ?? 0)} />
        <GpsButton
          onPress={reCenter}
          isLocating={isLocating}
          className="absolute bottom-24 left-4"
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
          actions={actions}
        />
      </View>
    </SafeAreaLayout>
  );
}
