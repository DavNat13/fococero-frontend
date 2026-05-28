import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getEstadoColor, getEstadoLabel } from '@/shared/utils/emergencia.utils';
import { formatearFecha } from '@/shared/utils/formatters';

interface ReporteCardProps {
  reporte: {
    id: string;
    titulo: string;
    descripcion: string;
    estado: string;
    direccion?: string;
    latitud: number;
    longitud: number;
    createdAt: string;
  };
}

export function ReporteCard({ reporte }: ReporteCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(reporte.estado) }]}>
          <Typography variant="caption" className="text-white">
            {getEstadoLabel(reporte.estado)}
          </Typography>
        </View>
        <Typography variant="caption" style={styles.date}>
          {formatearFecha(reporte.createdAt)}
        </Typography>
      </View>
      <Typography variant="h3" className="mt-3 text-white">
        {reporte.titulo}
      </Typography>
      <Typography variant="body" className="mt-2 text-gray-400">
        {reporte.descripcion}
      </Typography>
      <View style={styles.footer}>
        <MaterialCommunityIcons name="map-marker" size={16} color="#9CA3AF" />
        <Typography variant="caption" className="ml-1 flex-1 text-gray-400">
          {reporte.direccion || `${reporte.latitud.toFixed(4)}, ${reporte.longitud.toFixed(4)}`}
        </Typography>
        <TouchableOpacity
          style={styles.actionButton}
          accessibilityLabel="Ver detalle del reporte"
          accessibilityRole="button"
        >
          <Typography variant="body" style={styles.actionText}>
            Ver detalle
          </Typography>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#EF4444" />
        </TouchableOpacity>
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
  estadoBadge: {
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
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    padding: 8,
  },
  actionText: {
    color: '#EF4444',
  },
});
