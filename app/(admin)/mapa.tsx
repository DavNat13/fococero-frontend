// app/(admin)/mapa.tsx - Mapa de Gestión Admin
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminMapa() {
  return (
    <SafeAreaLayout variant="background">
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1">Mapa de Gestión</Typography>
          <Typography variant="body" color="secondary">
            Vista completa de todas las alertas
          </Typography>
        </View>

        <Card style={styles.mapPlaceholder}>
          <MaterialCommunityIcons name="map" size={64} color="#9CA3AF" />
          <Typography variant="h3" className="mt-4">
            Mapa Interactivo
          </Typography>
          <Typography variant="body" color="secondary" className="mt-2 text-center">
            El mapa interactivo se mostrará aquí con todas las capas de información
          </Typography>
        </Card>

        <View style={styles.legend}>
          <Typography variant="h3" className="mb-3">
            Leyenda
          </Typography>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Typography variant="body">Crítico</Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Typography variant="body">Alto</Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Typography variant="body">Controlado</Typography>
          </View>
        </View>
      </View>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 24 },
  mapPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  legend: { marginTop: 24 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
});
