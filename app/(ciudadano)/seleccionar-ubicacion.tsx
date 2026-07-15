import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DARK_MATTER_STYLE, SANTIAGO_CENTER } from '@/shared/ui/map';
import { useUbicacionPickerStore } from '@/shared/store/ubicacionPickerStore';

export default function SeleccionarUbicacionScreen() {
  const { lat: paramLat, lng: paramLng } = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const setPending = useUbicacionPickerStore((s) => s.setPendingLocation);

  const initialLat = parseFloat(paramLat ?? '-33.4489');
  const initialLng = parseFloat(paramLng ?? '-70.6693');
  const [selectedLat, setSelectedLat] = useState(
    !isNaN(initialLat) ? initialLat : SANTIAGO_CENTER[1],
  );
  const [selectedLng, setSelectedLng] = useState(
    !isNaN(initialLng) ? initialLng : SANTIAGO_CENTER[0],
  );

  const handleConfirm = () => {
    setPending({ lat: selectedLat, lng: selectedLng });
    router.back();
  };

  return (
    <View className="flex-1 bg-[#0C0F17]">
      <MapLibreGL.Map
        style={{ flex: 1 }}
        mapStyle={DARK_MATTER_STYLE}
        compass={false}
        attribution={false}
        logo={false}
        onPress={(e: any) => {
          if (e?.geometry?.coordinates) {
            const [lng, lat] = e.geometry.coordinates;
            setSelectedLat(lat);
            setSelectedLng(lng);
          }
        }}
      >
        <MapLibreGL.Camera ref={cameraRef} center={[selectedLng, selectedLat]} zoom={14} />
        <MapLibreGL.Marker id="selected" lngLat={[selectedLng, selectedLat]}>
          <View className="items-center">
            <MaterialCommunityIcons name="map-marker" size={40} color="#EA580C" />
          </View>
        </MapLibreGL.Marker>
      </MapLibreGL.Map>

      <View className="absolute left-0 right-0 top-0 bg-[#0C0F17]/90 px-4 pb-4 pt-14">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full active:bg-slate-800/50"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Typography variant="h3" className="flex-1 text-white">
            Seleccionar ubicación
          </Typography>
        </View>
      </View>

      <View className="absolute bottom-8 left-4 right-4">
        <View className="mb-3 flex-row items-center justify-center rounded-xl bg-slate-800/90 px-4 py-3">
          <MaterialCommunityIcons name="information" size={16} color="#94A3B8" />
          <Typography variant="caption" color="secondary" className="ml-2">
            Toca cualquier punto del mapa para colocar el marcador
          </Typography>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          className="w-full flex-row items-center justify-center rounded-2xl bg-[#EA580C] py-4 shadow-lg shadow-[#EA580C]/30"
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="check-circle" size={22} color="#FFFFFF" />
          <Typography variant="h3" className="ml-2 font-semibold text-white">
            Confirmar ubicación
          </Typography>
        </TouchableOpacity>

        <View className="mt-2 flex-row items-center justify-center">
          <MaterialCommunityIcons name="map-marker" size={14} color="#94A3B8" />
          <Typography variant="caption" color="tertiary" className="ml-1">
            {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
          </Typography>
        </View>
      </View>
    </View>
  );
}
