import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNivelColor, getNivelIcon } from '@/shared/utils/emergencia.utils';
import { formatearFecha } from '@/shared/utils/formatters';

interface AlertaCardProps {
  alerta: {
    id: string;
    tipo: string;
    descripcion?: string;
    estado: string;
    direccion?: string;
    latitud: number;
    longitud: number;
    createdAt: string;
  };
}

export function AlertaCard({ alerta }: AlertaCardProps) {
  const nivel = (() => {
    switch (alerta.estado) {
      case 'CRITICA':
      case 'EN_PROCESO':
        return 'alto';
      case 'PENDIENTE':
      case 'REPORTADA':
        return 'medio';
      case 'VERIFICADA':
      case 'RESUELTA':
      case 'DESCARTADA':
        return 'bajo';
      default:
        return 'medio';
    }
  })();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.nivelBadge, { backgroundColor: getNivelColor(nivel) }]}>
          <MaterialCommunityIcons
            name={getNivelIcon(nivel) as keyof typeof MaterialCommunityIcons.glyphMap}
            size={16}
            color="#FFFFFF"
          />
          <Typography variant="caption" className="ml-1 text-white">
            {nivel.toUpperCase()}
          </Typography>
        </View>
        <Typography variant="caption" style={styles.date}>
          {formatearFecha(alerta.createdAt)}
        </Typography>
      </View>
      <Typography variant="h3" className="mt-3 text-white">
        {alerta.tipo}
      </Typography>
      <Typography variant="body" className="mt-2 text-gray-400">
        {alerta.descripcion || 'Sin descripción'}
      </Typography>
      <View style={styles.footer}>
        <MaterialCommunityIcons name="map-marker" size={16} color="#9CA3AF" />
        <Typography variant="caption" className="ml-1 text-gray-400">
          {alerta.direccion || `${alerta.latitud.toFixed(4)}, ${alerta.longitud.toFixed(4)}`}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nivelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  date: {
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
});
