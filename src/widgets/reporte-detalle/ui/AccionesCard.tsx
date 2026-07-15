import React from 'react';
import { View, Alert } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/shared/ui/atoms/Button';
import { useCambiarEstadoReporte } from '@/entities/reporte';
import type { Reporte, ReporteEstado } from '@/entities/reporte';

const ESTADO_ACTION_LABELS: Record<string, string> = {
  EN_PROCESO: 'en proceso',
  RESUELTO: 'resuelto',
  FALSA_ALARMA: 'falsa alarma',
};

interface AccionesCardProps {
  reporte: Reporte;
}

export function AccionesCard({ reporte }: AccionesCardProps) {
  const { mutate: cambiarEstado } = useCambiarEstadoReporte();

  const handleAction = (nuevoEstado: ReporteEstado) => {
    Alert.alert(
      'Confirmar cambio',
      `¿Marcar este reporte como "${ESTADO_ACTION_LABELS[nuevoEstado]}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () =>
            cambiarEstado({
              id: reporte.id,
              payload: {
                nuevoEstado,
                comentarios: `Cambio desde detalle de reporte`,
              },
            }),
        },
      ],
    );
  };

  const puedeMarcarEnProceso = reporte.estado === 'PENDIENTE';
  const puedeResolver = reporte.estado === 'EN_PROCESO';
  const puedeMarcarFalsaAlarma = reporte.estado !== 'FALSA_ALARMA';

  if (!puedeMarcarEnProceso && !puedeResolver && !puedeMarcarFalsaAlarma) return null;

  return (
    <View className="mx-4 rounded-2xl bg-slate-800 p-4">
      <View className="mb-4 flex-row items-center">
        <MaterialCommunityIcons name="lightning-bolt" size={18} color="#F97316" />
        <Typography variant="h3" className="ml-2 text-white">
          Acciones
        </Typography>
      </View>

      <View className="gap-3">
        {puedeMarcarEnProceso ? (
          <Button
            label="Marcar en proceso"
            onPress={() => handleAction('EN_PROCESO')}
            variant="outline"
            size="md"
            leftIcon={<MaterialCommunityIcons name="progress-check" size={18} color="#FFFFFF" />}
          />
        ) : null}

        {puedeResolver ? (
          <Button
            label="Resolver"
            onPress={() => handleAction('RESUELTO')}
            variant="solid"
            size="md"
            leftIcon={<MaterialCommunityIcons name="check-circle" size={18} color="#FFFFFF" />}
          />
        ) : null}

        {puedeMarcarFalsaAlarma ? (
          <Button
            label="Marcar falsa alarma"
            onPress={() => handleAction('FALSA_ALARMA')}
            variant="danger"
            size="md"
            leftIcon={<MaterialCommunityIcons name="alert-octagon" size={18} color="#EF4444" />}
          />
        ) : null}
      </View>
    </View>
  );
}
