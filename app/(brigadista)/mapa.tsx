// app/(brigadista)/mapa.tsx - Mapa de focos para brigadista
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import MapView, { Marker } from 'react-native-maps';

const SANTIAGO_COORDS = { latitude: -33.4489, longitude: -70.6693 };

export default function Mapa() {
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <SafeAreaLayout variant="background">
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Mapa de Focos
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Vista de incidentes activos
          </Typography>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={error} onRetry={() => setError(null)} />
          </View>
        )}

        {isLoading ? (
          <View style={styles.mapContainer}>
            <LoadingSkeleton lines={3} lineHeight={24} />
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                ...SANTIAGO_COORDS,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={SANTIAGO_COORDS}
                title="Foco activo"
                description="Incendio forestal activo"
                pinColor="#EF4444"
              />
              <Marker
                coordinate={{ latitude: -33.456, longitude: -70.678 }}
                title="Alerta moderada"
                description="Zona con riesgo elevado"
                pinColor="#F97316"
              />
              <Marker
                coordinate={{ latitude: -33.44, longitude: -70.66 }}
                title="Zona segura"
                description="Área despejada"
                pinColor="#22C55E"
              />
            </MapView>

            {/* Controls overlay */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.controlBtn}
                accessibilityLabel="Filtrar mapa"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name="filter-variant" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlBtn}
                accessibilityLabel="Capas del mapa"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name="layers" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlBtn}
                accessibilityLabel="Ir a mi ubicación"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 400,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controlsRow: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  controlBtn: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    flex: 1,
  },
  errorContainer: {
    marginBottom: 16,
  },
});
