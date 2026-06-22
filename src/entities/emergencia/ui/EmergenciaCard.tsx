import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/ui/atoms/Typography';
import {
  getNivelColor,
  getNivelIcon,
  getEstadoColor,
  getEstadoIcon,
} from '@/shared/utils/emergencia.utils';

export interface Emergencia {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  estado: string;
  inicio: string;
  ubicacion: string;
  brigadistas: number;
}

interface EmergenciaCardProps {
  emergencia: Emergencia;
}

export const EmergenciaCard = ({ emergencia }: EmergenciaCardProps) => {
  return (
    <View className="rounded-2xl bg-slate-800 p-5">
      <View className="mb-2">
        <View className="flex-row gap-2">
          <View
            className="flex-row items-center rounded-lg px-2.5 py-1"
            style={{ backgroundColor: getNivelColor(emergencia.nivel) }}
          >
            <MaterialCommunityIcons
              name={getNivelIcon(emergencia.nivel) as any}
              size={14}
              color="#FFFFFF"
            />
            <Typography variant="caption" className="ml-1 text-white">
              {emergencia.nivel.toUpperCase()}
            </Typography>
          </View>
          <View
            className="flex-row items-center rounded-lg px-2.5 py-1"
            style={{ backgroundColor: getEstadoColor(emergencia.estado) }}
          >
            <MaterialCommunityIcons
              name={getEstadoIcon(emergencia.estado) as any}
              size={14}
              color="#FFFFFF"
            />
            <Typography variant="caption" className="ml-1 text-white">
              {emergencia.estado.toUpperCase()}
            </Typography>
          </View>
        </View>
      </View>

      <Typography variant="h3" className="mt-3 text-white">
        {emergencia.titulo}
      </Typography>
      <Typography variant="body" className="mt-2 text-gray-400">
        {emergencia.descripcion}
      </Typography>

      <View className="mt-4 gap-2">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="clock-outline" size={16} color="#9CA3AF" />
          <Typography variant="caption" className="ml-2 text-gray-400">
            {emergencia.inicio}
          </Typography>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="map-marker" size={16} color="#9CA3AF" />
          <Typography variant="caption" className="ml-2 flex-1 text-gray-400">
            {emergencia.ubicacion}
          </Typography>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-gray-700 pt-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="account-group" size={16} color="#EF4444" />
          <Typography variant="caption" className="ml-1 text-red-400">
            {emergencia.brigadistas} brigadistas asignados
          </Typography>
        </View>
        <View className="min-h-11 min-w-11 items-center justify-center p-1">
          <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
        </View>
      </View>
    </View>
  );
};
