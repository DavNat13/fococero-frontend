import { useAlertasCercanas } from '@/entities/alerta';
import { useGetMisReportes } from '@/entities/reporte';
import {
  ActionSheet,
  CalloutContent,
  FabButton,
  GpsButton,
  LayerSelector,
  MapBanner,
  MapContainer,
  MapHeader,
  MapLegend,
  MarkerCountBadge,
  MarkerPin,
  RefreshButton,
} from '@/shared/ui/map';
import { DEFAULT_LAYER, MAP_STYLES } from '@/shared/ui/map/map-styles.config';
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RADIO_BUSQUEDA = 5000;

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const router = useRouter();
  const [userLoc, setUL] = useState<{ lat: number; lng: number } | null>(null);
  const [permBanner, setPerm] = useState<string | null>(null);
  const [fetchError, setErr] = useState<string | null>(null);
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
    data: reps = [],
    error: repErr,
    isLoading: lRep,
    refetch: refRep,
  } = useGetMisReportes({ refetchInterval: 20000 });
  const clat = userLoc?.lat ?? 0,
    clng = userLoc?.lng ?? 0;
  const valid = !isNaN(clat) && !isNaN(clng);
  const {
    alertas: alts = [],
    error: alErr,
    refetch: refAlt,
  } = useAlertasCercanas(valid ? clat : 0, valid ? clng : 0, RADIO_BUSQUEDA, {
    refetchInterval: 20000,
  });

  useEffect(() => {
    const e = [repErr?.message, alErr].filter(Boolean);
    setErr(e.length ? (e[0] ?? null) : null);
  }, [repErr, alErr]);

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

  const actions = [
    {
      icon: 'fire' as const,
      label: 'Reportar incendio',
      color: '#EF4444',
      onPress: () => router.push('/(ciudadano)/crear-reporte?tipo=incendio'),
    },
    {
      icon: 'fire' as const,
      label: 'Reportar quema controlada',
      color: '#F59E0B',
      onPress: () => router.push('/(ciudadano)/crear-reporte?tipo=quema_controlada'),
    },
    {
      icon: 'smoke-detector' as const,
      label: 'Reportar columna de humo',
      color: '#F97316',
      onPress: () => router.push('/(ciudadano)/crear-reporte?tipo=columna_humo'),
    },
  ];
  const markerCount = reps.length + alts.length;
  const banners = [!!permBanner, !!fetchError].filter(Boolean).length;

  return (
    <View className="flex-1 bg-[#0C0F17]">
      <MapContainer cameraRef={cameraRef} mapStyle={mapStyle}>
        {!lRep &&
          reps.map((r) => (
            <MapLibreGL.Marker
              key={`r-${r.id}`}
              id={`r-${r.id}`}
              lngLat={[Number(r.longitud), Number(r.latitud)]}
              anchor="center"
              onPress={() => setSel(`r-${r.id}`)}
            >
              <View>
                <MarkerPin color="#EF4444" />
                {selected === `r-${r.id}` && (
                  <MapLibreGL.Callout title="">
                    <CalloutContent title={r.titulo} description={r.descripcion} />
                  </MapLibreGL.Callout>
                )}
              </View>
            </MapLibreGL.Marker>
          ))}
        {alts.map((a) => (
          <MapLibreGL.Marker
            key={`a-${a.id}`}
            id={`a-${a.id}`}
            lngLat={[Number(a.ubicacion.coordinates[0]), Number(a.ubicacion.coordinates[1])]}
            anchor="center"
            onPress={() => setSel(`a-${a.id}`)}
          >
            <View>
              <MarkerPin color="#F97316" />
              {selected === `a-${a.id}` && (
                <MapLibreGL.Callout title="">
                  <CalloutContent title={a.tipo} description={a.descripcion} />
                </MapLibreGL.Callout>
              )}
            </View>
          </MapLibreGL.Marker>
        ))}
      </MapContainer>
      <MapHeader title="Mapa de incidentes" subtitle="Reportes y alertas en tu zona" />
      {permBanner && <MapBanner message={permBanner} type="permission" topOffset={96} />}
      {fetchError && (
        <MapBanner message={fetchError} type="error" topOffset={banners > 1 ? 144 : 96} />
      )}
      <MapLegend
        items={[
          { color: '#EF4444', label: 'Mis reportes' },
          { color: '#F97316', label: 'Alertas cercanas' },
        ]}
      />
      <LayerSelector selectedLayer={selectedLayer} onLayerChange={setLayer} top={insets.top + 12} />
      <RefreshButton
        onRefresh={() => {
          refRep();
          refAlt();
        }}
        top={insets.top + 12}
      />
      <MarkerCountBadge count={markerCount} />
      <GpsButton
        onPress={centerOnUser}
        isLocating={isLocating}
        className="absolute bottom-8 self-center"
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
  );
}
