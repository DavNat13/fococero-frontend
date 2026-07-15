import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ResumenUbicacionProps {
  latitud: number;
  longitud: number;
  hasLocation: boolean;
  direccion?: string | null;
}

export function ResumenUbicacion({
  latitud,
  longitud,
  hasLocation,
  direccion,
}: ResumenUbicacionProps) {
  if (!hasLocation) {
    return (
      <View className="mt-3 flex-row items-center gap-2 rounded-xl bg-slate-800/30 px-4 py-3">
        <MaterialCommunityIcons name="map-marker-off" size={18} color="#64748B" />
        <Typography variant="caption" color="tertiary" className="flex-1">
          Selecciona una ubicación en el mapa o usa tu GPS
        </Typography>
      </View>
    );
  }

  return (
    <View className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
      {direccion && (
        <View className="mb-2 flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="map-marker"
            size={18}
            color="#3B82F6"
            style={{ marginTop: 2 }}
          />
          <Typography variant="caption" color="primary" className="flex-1 leading-5">
            {direccion}
          </Typography>
        </View>
      )}
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#64748B" />
        <Typography variant="caption" color="tertiary" className="text-[11px]">
          {latitud.toFixed(6)}, {longitud.toFixed(6)}
        </Typography>
        <View className="ml-auto rounded-full bg-blue-500/20 px-2 py-0.5">
          <Typography variant="caption" color="brand" className="text-[10px]">
            GPS
          </Typography>
        </View>
      </View>
    </View>
  );
}
