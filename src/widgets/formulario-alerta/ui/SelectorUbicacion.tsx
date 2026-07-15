import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResumenUbicacion } from './ResumenUbicacion';
import { useUbicacionPickerStore } from '@/shared/store/ubicacionPickerStore';

interface SelectorUbicacionProps {
  latitud: number;
  longitud: number;
  onUbicacionChange: (lat: number, lng: number) => void;
}

export function SelectorUbicacion({
  latitud,
  longitud,
  onUbicacionChange,
}: SelectorUbicacionProps) {
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [editingLat, setEditingLat] = useState(latitud !== 0 ? latitud.toString() : '');
  const [editingLng, setEditingLng] = useState(longitud !== 0 ? longitud.toString() : '');
  const hasLocation = latitud !== 0 && longitud !== 0;

  const pendingLocation = useUbicacionPickerStore((s) => s.pendingLocation);
  const setPendingLocation = useUbicacionPickerStore((s) => s.setPendingLocation);

  React.useEffect(() => {
    if (pendingLocation) {
      const { lat, lng } = pendingLocation;
      setEditingLat(lat.toString());
      setEditingLng(lng.toString());
      onUbicacionChange(lat, lng);
      reverseGeocode(lat, lng);
      setPendingLocation(null);
    }
  }, [pendingLocation, onUbicacionChange, setPendingLocation]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const r = results[0];
        const parts = [
          r.name,
          r.street,
          r.streetNumber,
          r.district,
          r.city,
          r.region,
          r.country,
        ].filter(Boolean);
        setDireccion(parts.join(', '));
      } else {
        setDireccion(null);
      }
    } catch {
      setDireccion(null);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    setLocError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocError('Permiso de ubicación denegado');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setEditingLat(lat.toString());
      setEditingLng(lng.toString());
      onUbicacionChange(lat, lng);
      reverseGeocode(lat, lng);
    } catch {
      setLocError('Error al obtener ubicación');
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapPick = () => {
    router.push({
      pathname: '/(ciudadano)/seleccionar-ubicacion',
      params: { lat: (latitud || -33.4489).toString(), lng: (longitud || -70.6693).toString() },
    });
  };

  const handleManualLat = (text: string) => {
    setEditingLat(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= -90 && parsed <= 90) {
      const lng = parseFloat(editingLng);
      if (!isNaN(lng) && lng >= -180 && lng <= 180) {
        onUbicacionChange(parsed, lng);
        reverseGeocode(parsed, lng);
      }
    }
  };

  const handleManualLng = (text: string) => {
    setEditingLng(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= -180 && parsed <= 180) {
      const lat = parseFloat(editingLat);
      if (!isNaN(lat) && lat >= -90 && lat <= 90) {
        onUbicacionChange(lat, parsed);
        reverseGeocode(lat, parsed);
      }
    }
  };

  return (
    <View className="w-full">
      <TouchableOpacity
        onPress={handleGetCurrentLocation}
        disabled={isLocating}
        className={`mb-3 flex-row items-center justify-center rounded-2xl border-2 p-4 ${
          isLocating ? 'border-slate-700 bg-slate-800/50' : 'border-[#EA580C] bg-[#EA580C]/10'
        }`}
        activeOpacity={0.7}
        accessibilityLabel="Usar mi ubicación actual"
        accessibilityRole="button"
      >
        {isLocating ? (
          <ActivityIndicator size="small" color="#EA580C" />
        ) : (
          <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#EA580C" />
        )}
        <Typography
          variant="body"
          className="ml-3 font-medium"
          color={isLocating ? 'tertiary' : 'brand'}
        >
          {isLocating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleMapPick}
        className="mb-3 flex-row items-center justify-center rounded-2xl border-2 border-slate-700 bg-slate-800/30 p-4"
        activeOpacity={0.7}
        accessibilityLabel="Elegir ubicación en el mapa"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="map-search" size={22} color="#94A3B8" />
        <Typography variant="body" className="ml-3 font-medium text-slate-300">
          Elegir en el mapa
        </Typography>
      </TouchableOpacity>

      {locError && (
        <View className="mb-3 flex-row items-center rounded-xl bg-red-500/10 px-4 py-3">
          <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
          <Typography variant="caption" color="danger" className="ml-2 flex-1">
            {locError}
          </Typography>
        </View>
      )}

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Typography variant="caption" color="tertiary" className="mb-1 ml-1">
            Latitud
          </Typography>
          <TextInput
            value={editingLat}
            onChangeText={handleManualLat}
            placeholder="-33.456"
            placeholderTextColor="#64748B"
            keyboardType="decimal-pad"
            className="h-12 rounded-xl border-2 border-slate-700 bg-slate-800/50 px-4 font-inter text-base text-slate-100"
          />
        </View>
        <View className="flex-1">
          <Typography variant="caption" color="tertiary" className="mb-1 ml-1">
            Longitud
          </Typography>
          <TextInput
            value={editingLng}
            onChangeText={handleManualLng}
            placeholder="-70.654"
            placeholderTextColor="#64748B"
            keyboardType="decimal-pad"
            className="h-12 rounded-xl border-2 border-slate-700 bg-slate-800/50 px-4 font-inter text-base text-slate-100"
          />
        </View>
      </View>

      <ResumenUbicacion
        latitud={latitud}
        longitud={longitud}
        hasLocation={hasLocation}
        direccion={direccion}
      />
    </View>
  );
}
