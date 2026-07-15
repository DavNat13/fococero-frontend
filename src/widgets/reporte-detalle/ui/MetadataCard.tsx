import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatearFecha } from '@/shared/utils/formatters';
import type { Reporte } from '@/entities/reporte';

interface MetadataCardProps {
  reporte: Reporte;
}

export function MetadataCard({ reporte }: MetadataCardProps) {
  return (
    <View className="mx-4 rounded-2xl bg-slate-800 p-4">
      <View className="mb-3 flex-row items-center">
        <MaterialCommunityIcons name="information" size={18} color="#94A3B8" />
        <Typography variant="h3" className="ml-2 text-white">
          Información
        </Typography>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="tag" size={16} color="#64748B" />
          <View className="ml-3 flex-1">
            <Typography variant="caption" color="tertiary">
              Categoría
            </Typography>
            <Typography variant="body" className="mt-0.5 text-white">
              {reporte.categoria_id || 'Sin categoría'}
            </Typography>
          </View>
        </View>

        <View className="h-px bg-slate-700" />

        <View className="flex-row items-center">
          <MaterialCommunityIcons name="account" size={16} color="#64748B" />
          <View className="ml-3 flex-1">
            <Typography variant="caption" color="tertiary">
              Reportado por
            </Typography>
            <Typography variant="body" className="mt-0.5 text-white">
              {reporte.id_ciudadano.slice(0, 12)}...
            </Typography>
          </View>
        </View>

        <View className="h-px bg-slate-700" />

        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar" size={16} color="#64748B" />
          <View className="ml-3 flex-1">
            <Typography variant="caption" color="tertiary">
              Fecha de creación
            </Typography>
            <Typography variant="body" className="mt-0.5 text-white">
              {formatearFecha(reporte.created_at)}
            </Typography>
          </View>
        </View>

        {reporte.updated_at && reporte.updated_at !== reporte.created_at ? (
          <>
            <View className="h-px bg-slate-700" />
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="update" size={16} color="#64748B" />
              <View className="ml-3 flex-1">
                <Typography variant="caption" color="tertiary">
                  Última actualización
                </Typography>
                <Typography variant="body" className="mt-0.5 text-white">
                  {formatearFecha(reporte.updated_at)}
                </Typography>
              </View>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}
