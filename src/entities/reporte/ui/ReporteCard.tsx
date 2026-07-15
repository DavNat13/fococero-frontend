import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getEstadoColor, getEstadoLabel } from '@/shared/utils/emergencia.utils';
import { formatearFecha } from '@/shared/utils/formatters';
import type { Reporte } from '../api/reporte.api';

interface ReporteCardProps {
  reporte: Reporte;
  onPress?: () => void;
}

export function ReporteCard({ reporte, onPress }: ReporteCardProps) {
  return (
    <View className="rounded-2xl bg-slate-800 p-5">
      <View className="flex-row items-center justify-between">
        <View
          className="rounded-lg px-3 py-1"
          style={{ backgroundColor: getEstadoColor(reporte.estado) }}
        >
          <Typography variant="caption" className="text-white">
            {getEstadoLabel(reporte.estado)}
          </Typography>
        </View>
        <Typography variant="caption" className="text-gray-500">
          {formatearFecha(reporte.created_at)}
        </Typography>
      </View>
      <Typography variant="h3" className="mt-3 text-white">
        {reporte.titulo}
      </Typography>
      <Typography variant="body" className="mt-2 text-gray-400">
        {reporte.descripcion}
      </Typography>
      <View className="mt-4 flex-row items-center border-t border-gray-700 pt-4">
        <MaterialCommunityIcons name="map-marker" size={16} color="#9CA3AF" />
        <Typography variant="caption" className="ml-1 flex-1 text-gray-400">
          {reporte.latitud.toFixed(4)}, {reporte.longitud.toFixed(4)}
        </Typography>
        <TouchableOpacity
          className="min-h-11 min-w-11 flex-row items-center justify-center p-2"
          onPress={onPress}
          accessibilityLabel="Ver detalle del reporte"
          accessibilityRole="button"
        >
          <Typography variant="body" className="text-red-500">
            Ver detalle
          </Typography>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
