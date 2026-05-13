// app/(ciudadano)/alertas.tsx - Lista de alertas
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Alerta {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: 'bajo' | 'medio' | 'alto';
  distancia: string;
  hora: string;
}

const alertasMock: Alerta[] = [];

export default function Alertas() {
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'alto':
        return '#EF4444';
      case 'medio':
        return '#F97316';
      default:
        return '#22C55E';
    }
  };

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'alto':
        return 'alert-circle';
      case 'medio':
        return 'alert';
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
            Alertas
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-2">
            Mantente informado sobre tu zona
          </Typography>
        </View>

        {alertasMock.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={64}
              color="#4B5563"
            />
            <Typography variant="body" className="text-gray-400 mt-4">
              No hay alertas activas
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-2">
              Tu zona está segura por el momento
            </Typography>
          </View>
        ) : (
          <View style={styles.alertasList}>
            {alertasMock.map((alerta) => (
              <View key={alerta.id} style={styles.alertaCard}>
                <View style={styles.alertaHeader}>
                  <View
                    style={[
                      styles.nivelBadge,
                      { backgroundColor: getNivelColor(alerta.nivel) },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getNivelIcon(alerta.nivel)}
                      size={16}
                      color="#FFFFFF"
                    />
                    <Typography variant="caption" className="text-white ml-1">
                      {alerta.nivel.toUpperCase()}
                    </Typography>
                  </View>
                  <Typography variant="caption" className="text-gray-500">
                    {alerta.hora}
                  </Typography>
                </View>
                <Typography variant="h3" className="text-white mt-3">
                  {alerta.titulo}
                </Typography>
                <Typography variant="body" className="text-gray-400 mt-2">
                  {alerta.descripcion}
                </Typography>
                <View style={styles.alertaFooter}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={16}
                    color="#9CA3AF"
                  />
                  <Typography variant="caption" className="text-gray-400 ml-1">
                    {alerta.distancia}
                  </Typography>
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
  alertasList: {
    gap: 16,
  },
  alertaCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  alertaHeader: {
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
  alertaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
});
