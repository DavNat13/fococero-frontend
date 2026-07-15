import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UbicacionCardProps {
  latitud: number;
  longitud: number;
  onVerMapa?: () => void;
}

export function UbicacionCard({ latitud, longitud, onVerMapa }: UbicacionCardProps) {
  const isValid = latitud !== 0 && longitud !== 0;

  return (
    <View className="mx-4 rounded-2xl bg-slate-800 p-4">
      <View className="mb-3 flex-row items-center">
        <MaterialCommunityIcons name="map-marker" size={18} color="#3B82F6" />
        <Typography variant="h3" className="ml-2 text-white">
          Ubicación
        </Typography>
      </View>

      {isValid ? (
        <View className="gap-2">
          <View className="flex-row items-center">
            <Typography variant="caption" color="tertiary" className="w-20">
              Latitud:
            </Typography>
            <Typography variant="body" color="primary" className="font-mono">
              {latitud.toFixed(6)}
            </Typography>
          </View>
          <View className="flex-row items-center">
            <Typography variant="caption" color="tertiary" className="w-20">
              Longitud:
            </Typography>
            <Typography variant="body" color="primary" className="font-mono">
              {longitud.toFixed(6)}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={onVerMapa}
            className="mt-2 flex-row items-center justify-center rounded-xl bg-blue-500/20 py-3"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="map" size={18} color="#3B82F6" />
            <Typography variant="label" className="ml-2 text-blue-400">
              Ver en mapa
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <Typography variant="caption" color="tertiary">
          Sin coordenadas disponibles
        </Typography>
      )}
    </View>
  );
}
