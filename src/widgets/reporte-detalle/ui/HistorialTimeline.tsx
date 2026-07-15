import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatearFecha } from '@/shared/utils/formatters';
import type { HistorialEntry } from '@/entities/reporte';

const ESTADO_DOT: Record<string, string> = {
  PENDIENTE: 'bg-yellow-400',
  EN_PROCESO: 'bg-blue-400',
  RESUELTO: 'bg-green-400',
  FALSA_ALARMA: 'bg-gray-400',
};

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  RESUELTO: 'Resuelto',
  FALSA_ALARMA: 'Falsa Alarma',
};

interface HistorialTimelineProps {
  historial: HistorialEntry[];
}

export function HistorialTimeline({ historial }: HistorialTimelineProps) {
  if (!historial.length) return null;

  return (
    <View className="mx-4 rounded-2xl bg-slate-800 p-4">
      <View className="mb-4 flex-row items-center">
        <MaterialCommunityIcons name="history" size={18} color="#F97316" />
        <Typography variant="h3" className="ml-2 text-white">
          Historial de estados
        </Typography>
      </View>

      {historial.map((entry, index) => {
        const isLast = index === historial.length - 1;
        const dotColor = ESTADO_DOT[entry.estado_nuevo] ?? 'bg-gray-400';
        const label = ESTADO_LABEL[entry.estado_nuevo] ?? entry.estado_nuevo;

        return (
          <View key={entry.id} className="flex-row">
            <View className="mr-3 items-center">
              <View className={`h-3 w-3 rounded-full ${dotColor}`} />
              {!isLast && <View className="mt-0.5 h-full w-0.5 bg-slate-600" />}
            </View>
            <View className={`flex-1 ${isLast ? '' : 'pb-5'}`}>
              <View className="flex-row items-center gap-2">
                <Typography variant="body" className="font-medium text-white">
                  {label}
                </Typography>
              </View>
              <Typography variant="caption" color="tertiary" className="mt-0.5">
                {formatearFecha(entry.created_at)}
                {entry.id_usuario_modificador
                  ? ` — por ${entry.id_usuario_modificador.slice(0, 8)}...`
                  : ''}
              </Typography>
              {entry.comentarios ? (
                <Typography variant="caption" color="secondary" className="mt-1 italic">
                  {entry.comentarios}
                </Typography>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
