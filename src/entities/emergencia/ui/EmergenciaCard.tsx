import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/ui/atoms/Typography';
import {
  getNivelColor,
  getNivelIcon,
  getEstadoColor,
  getEstadoIcon,
} from '@/shared/utils/emergencia.utils';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

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
    <View style={styles.emergenciaCard}>
      <View style={styles.emergenciaHeader}>
        <View style={styles.badgesRow}>
          <View style={[styles.nivelBadge, { backgroundColor: getNivelColor(emergencia.nivel) }]}>
            <MaterialCommunityIcons
              name={getNivelIcon(emergencia.nivel) as IconName}
              size={14}
              color="#FFFFFF"
            />
            <Typography variant="caption" className="ml-1 text-white">
              {emergencia.nivel.toUpperCase()}
            </Typography>
          </View>
          <View
            style={[styles.estadoBadge, { backgroundColor: getEstadoColor(emergencia.estado) }]}
          >
            <MaterialCommunityIcons
              name={getEstadoIcon(emergencia.estado) as IconName}
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

      <View style={styles.emergenciaStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#9CA3AF" />
          <Typography variant="caption" className="ml-2 text-gray-400">
            {emergencia.inicio}
          </Typography>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#9CA3AF" />
          <Typography variant="caption" className="ml-2 flex-1 text-gray-400">
            {emergencia.ubicacion}
          </Typography>
        </View>
      </View>

      <View style={styles.emergenciaFooter}>
        <View style={styles.brigadistasInfo}>
          <MaterialCommunityIcons name="account-group" size={16} color="#EF4444" />
          <Typography variant="caption" className="ml-1 text-red-400">
            {emergencia.brigadistas} brigadistas asignados
          </Typography>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          accessibilityLabel="Ver detalle de emergencia"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emergenciaCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  emergenciaHeader: {
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  nivelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  emergenciaStats: {
    marginTop: 16,
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergenciaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  brigadistasInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
