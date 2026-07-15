import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import type { Reporte } from '@/entities/reporte';

const ESTADO_BADGE: Record<string, { bg: string; text: string }> = {
  PENDIENTE: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  EN_PROCESO: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  RESUELTO: { bg: 'bg-green-500/20', text: 'text-green-400' },
  FALSA_ALARMA: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  RESUELTO: 'Resuelto',
  FALSA_ALARMA: 'Falsa Alarma',
};

interface InfoHeaderProps {
  reporte: Reporte;
}

export function InfoHeader({ reporte }: InfoHeaderProps) {
  const badge = ESTADO_BADGE[reporte.estado] ?? ESTADO_BADGE.PENDIENTE;
  const label = ESTADO_LABEL[reporte.estado] ?? reporte.estado;

  return (
    <View className="px-4 pt-2">
      <View className="mb-3 flex-row items-center gap-3">
        <View className={`rounded-full px-3 py-1 ${badge.bg}`}>
          <Typography variant="caption" className={badge.text}>
            {label}
          </Typography>
        </View>
        <Typography variant="caption" color="tertiary">
          ID: {reporte.id.slice(0, 8)}...
        </Typography>
      </View>

      <Typography variant="h2" className="text-white">
        {reporte.titulo}
      </Typography>

      {reporte.descripcion ? (
        <Typography variant="body" color="secondary" className="mt-3 leading-6">
          {reporte.descripcion}
        </Typography>
      ) : null}
    </View>
  );
}
