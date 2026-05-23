// app/(brigadista)/emergencias.tsx - Seguimiento de emergencias
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Emergencia {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: 'bajo' | 'medio' | 'alto' | 'critico';
  estado: 'activa' | 'controlada' | 'extinguida';
  inicio: string;
  ubicacion: string;
  brigadistas: number;
}

const emergenciasMock: Emergencia[] = [
  {
    id: 1,
    titulo: 'Incendio forestall sector norte',
    descripcion: 'Fuego распространяющийся en zona boscosa con riesgo a viviendas cercanas',
    nivel: 'alto',
    estado: 'activa',
    inicio: '12 May 2026 - 10:30',
    ubicacion: 'Cerro Colorado, Sector Norte',
    brigadistas: 5,
  },
  {
    id: 2,
    titulo: 'Foco en zona rural',
    descripcion: 'Combustión de pastizal en área agrícola',
    nivel: 'medio',
    estado: 'controlada',
    inicio: '11 May 2026 - 18:00',
    ubicacion: 'Rinconada de los Baños',
    brigadistas: 3,
  },
];

export default function Emergencias() {
  const [emergencias] = useState<Emergencia[]>(emergenciasMock);

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'critico':
        return '#DC2626';
      case 'alto':
        return '#EF4444';
      case 'medio':
        return '#F97316';
      case 'bajo':
        return '#22C55E';
      default:
        return '#6B7280';
    }
  };

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'critico':
        return 'alert-octagon';
      case 'alto':
        return 'fire';
      case 'medio':
        return 'firelighter';
      case 'bajo':
        return 'fire-extinguisher';
      default:
        return 'alert';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return '#EF4444';
      case 'controlada':
        return '#F97316';
      case 'extinguida':
        return '#22C55E';
      default:
        return '#6B7280';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'alert-circle';
      case 'controlada':
        return 'progress-clock';
      case 'extinguida':
        return 'check-circle';
      default:
        return 'information';
    }
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Emergencias
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-2">
            Seguimiento de emergencias activas
          </Typography>
        </View>

        {emergencias.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={64}
              color="#4B5563"
            />
            <Typography variant="body" className="text-gray-400 mt-4">
              No hay emergencias activas
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-2">
              Todas las situaciones están bajo control
            </Typography>
          </View>
        ) : (
          <View style={styles.emergenciasList}>
            {emergencias.map((emergencia) => (
              <View key={emergencia.id} style={styles.emergenciaCard}>
                <View style={styles.emergenciaHeader}>
                  <View style={styles.badgesRow}>
                    <View
                      style={[
                        styles.nivelBadge,
                        { backgroundColor: getNivelColor(emergencia.nivel) },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={getNivelIcon(emergencia.nivel) as any}
                        size={14}
                        color="#FFFFFF"
                      />
                      <Typography variant="caption" className="text-white ml-1">
                        {emergencia.nivel.toUpperCase()}
                      </Typography>
                    </View>
                    <View
                      style={[
                        styles.estadoBadge,
                        { backgroundColor: getEstadoColor(emergencia.estado) },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={getEstadoIcon(emergencia.estado) as any}
                        size={14}
                        color="#FFFFFF"
                      />
                      <Typography variant="caption" className="text-white ml-1">
                        {emergencia.estado.toUpperCase()}
                      </Typography>
                    </View>
                  </View>
                </View>

                <Typography variant="h3" className="text-white mt-3">
                  {emergencia.titulo}
                </Typography>
                <Typography variant="body" className="text-gray-400 mt-2">
                  {emergencia.descripcion}
                </Typography>

                <View style={styles.emergenciaStats}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color="#9CA3AF"
                    />
                    <Typography variant="caption" className="text-gray-400 ml-2">
                      {emergencia.inicio}
                    </Typography>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={16}
                      color="#9CA3AF"
                    />
                    <Typography variant="caption" className="text-gray-400 ml-2 flex-1">
                      {emergencia.ubicacion}
                    </Typography>
                  </View>
                </View>

                <View style={styles.emergenciaFooter}>
                  <View style={styles.brigadistasInfo}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={16}
                      color="#EF4444"
                    />
                    <Typography variant="caption" className="text-red-400 ml-1">
                      {emergencia.brigadistas} brigadistas asignados
                    </Typography>
                  </View>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emergenciasList: {
    gap: 16,
  },
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
  },
});
