// app/(brigadista)/mapa.tsx - Mapa de focos para brigadista
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Mapa() {
  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Mapa de Focos
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-2">
            Vista de incidentes activos
          </Typography>
        </View>

        {/* Placeholder del mapa */}
        <View style={styles.mapPlaceholder}>
          <MaterialCommunityIcons
            name="map"
            size={80}
            color="#4B5563"
          />
          <Typography variant="body" className="text-gray-400 mt-4">
            Mapa interactivo en construcción
          </Typography>
          <Typography variant="caption" className="text-gray-500 mt-2">
            Próximamente podrás visualizar la ubicación de todos los focos activos
          </Typography>
        </View>

        {/* Leyenda */}
        <View style={styles.legendSection}>
          <Typography variant="h3" className="text-white mb-4">
            Leyenda
          </Typography>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Typography variant="body" className="text-gray-300">
                Incendio activo
              </Typography>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
              <Typography variant="body" className="text-gray-300">
                Alerta moderada
              </Typography>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Typography variant="body" className="text-gray-300">
                Zonal 安全
              </Typography>
            </View>
          </View>
        </View>

        {/* Controles rápidos */}
        <View style={styles.controlsSection}>
          <Typography variant="h3" className="text-white mb-4">
            Controles
          </Typography>
          <View style={styles.controlsGrid}>
            <View style={styles.controlCard}>
              <MaterialCommunityIcons
                name="filter-variant"
                size={24}
                color="#EF4444"
              />
              <Typography variant="body" className="text-white mt-2">
                Filtrar
              </Typography>
            </View>
            <View style={styles.controlCard}>
              <MaterialCommunityIcons
                name="layers"
                size={24}
                color="#EF4444"
              />
              <Typography variant="body" className="text-white mt-2">
                Capas
              </Typography>
            </View>
            <View style={styles.controlCard}>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={24}
                color="#EF4444"
              />
              <Typography variant="body" className="text-white mt-2">
                Mi ubicación
              </Typography>
            </View>
          </View>
        </View>
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
  mapPlaceholder: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    marginBottom: 24,
  },
  legendSection: {
    marginBottom: 24,
  },
  legendItems: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  controlsSection: {
    marginBottom: 24,
  },
  controlsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  controlCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
});
