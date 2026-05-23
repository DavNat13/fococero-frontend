// app/(brigadista)/reportes.tsx - Lista de reportes para brigadista
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
  fecha: string;
  ubicacion: string;
}

const reportesMock: Reporte[] = [
  {
    id: 1,
    titulo: 'Incendio en sector norte',
    descripcion: 'Se observa humo denso en zona boscosa',
    estado: 'pendiente',
    fecha: '12 May 2026 - 14:30',
    ubicacion: 'Sector Norte, Cerro Colorado',
  },
  {
    id: 2,
    titulo: 'Foco靠近 urbanization',
    descripcion: 'Fuego cercano a zona residencial',
    estado: 'en_proceso',
    fecha: '12 May 2026 - 13:15',
    ubicacion: 'Av. Principal 245',
  },
];

export default function Reportes() {
  const [reportes] = useState<Reporte[]>(reportesMock);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '#F97316';
      case 'en_proceso':
        return '#3B82F6';
      case 'resuelto':
        return '#22C55E';
      default:
        return '#6B7280';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En proceso';
      case 'resuelto':
        return 'Resuelto';
      default:
        return 'Desconocido';
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
            Reportes
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-2">
            Gestiona los reportes de tu zona
          </Typography>
        </View>

        {reportes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={64}
              color="#4B5563"
            />
            <Typography variant="body" className="text-gray-400 mt-4">
              No hay reportes aún
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-2">
              Los reportes aparecerán aquí cuando se generen
            </Typography>
          </View>
        ) : (
          <View style={styles.reportesList}>
            {reportes.map((reporte) => (
              <View key={reporte.id} style={styles.reporteCard}>
                <View style={styles.reporteHeader}>
                  <View
                    style={[
                      styles.estadoBadge,
                      { backgroundColor: getEstadoColor(reporte.estado) },
                    ]}
                  >
                    <Typography variant="caption" className="text-white">
                      {getEstadoLabel(reporte.estado)}
                    </Typography>
                  </View>
                  <Typography variant="caption" className="text-gray-500">
                    {reporte.fecha}
                  </Typography>
                </View>
                <Typography variant="h3" className="text-white mt-3">
                  {reporte.titulo}
                </Typography>
                <Typography variant="body" className="text-gray-400 mt-2">
                  {reporte.descripcion}
                </Typography>
                <View style={styles.reporteFooter}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={16}
                    color="#9CA3AF"
                  />
                  <Typography variant="caption" className="text-gray-400 ml-1 flex-1">
                    {reporte.ubicacion}
                  </Typography>
                  <TouchableOpacity style={styles.actionButton}>
                    <Typography variant="body" className="text-red-500">
                      Ver detalle
                    </Typography>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Botón flotante para nuevo reporte */}
        <TouchableOpacity style={styles.fabButton}>
          <MaterialCommunityIcons
            name="plus"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
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
  reportesList: {
    gap: 16,
  },
  reporteCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  reporteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reporteFooter: {
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
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
