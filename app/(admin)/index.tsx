// app/(admin)/index.tsx - Dashboard Admin
import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const kpiCards = [
  { title: 'Usuarios Total', value: '1,234', icon: 'account-group', color: '#3B82F6' },
  { title: 'Alertas Activas', value: '23', icon: 'alert-circle', color: '#EF4444' },
  { title: 'Reportes Hoy', value: '45', icon: 'file-document', color: '#10B981' },
  { title: 'Brigadistas', value: '89', icon: 'firefighter', color: '#F59E0B' },
];

const quickActions = [
  { title: 'Gestionar Usuarios', icon: 'account-cog', screen: 'usuarios' },
  { title: 'Ver Mapa', icon: 'map', screen: 'mapa' },
  { title: 'Configuración', icon: 'cog', screen: 'config' },
  { title: 'Reportes', icon: 'file-chart', screen: 'reportes' },
];

export default function AdminDashboard() {
  return (
    <SafeAreaLayout variant="background">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1">Panel de Administración</Typography>
          <Typography variant="body" color="secondary">Bienvenido, Administrador</Typography>
        </View>

        <View style={styles.kpiGrid}>
          {kpiCards.map((kpi, index) => (
            <Card key={index} style={styles.kpiCard}>
              <View style={[styles.kpiIcon, { backgroundColor: kpi.color + '20' }]}>
                <MaterialCommunityIcons name={kpi.icon as any} size={24} color={kpi.color} />
              </View>
              <Typography variant="h2" className="mt-2">{kpi.value}</Typography>
              <Typography variant="caption" color="secondary">{kpi.title}</Typography>
            </Card>
          ))}
        </View>

        <Typography variant="h3" className="mt-6 mb-4">Acciones Rápidas</Typography>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name={action.icon as any} size={28} color="#EF4444" />
              </View>
              <Typography variant="body" className="mt-2 text-center">{action.title}</Typography>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Typography variant="h3" className="mb-4">Actividad Reciente</Typography>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="account-plus" size={20} color="#10B981" />
              <View style={styles.activityContent}>
                <Typography variant="body">Nuevo usuario registrado</Typography>
                <Typography variant="caption" color="secondary">Hace 5 minutos</Typography>
              </View>
            </View>
          </Card>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="alert" size={20} color="#EF4444" />
              <View style={styles.activityContent}>
                <Typography variant="body">Alerta críticas en sector norte</Typography>
                <Typography variant="caption" color="secondary">Hace 15 minutos</Typography>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 24 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiCard: { width: '47%', padding: 16, alignItems: 'center' },
  kpiIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '47%', padding: 16, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12 },
  actionIcon: { marginBottom: 8 },
  recentSection: { marginTop: 8 },
  activityCard: { marginBottom: 8, padding: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center' },
  activityContent: { marginLeft: 12, flex: 1 },
});
