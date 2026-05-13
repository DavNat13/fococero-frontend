// app/(admin)/perfil.tsx - Perfil Admin
import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { Avatar } from '@/shared/ui/atoms/Avatar';
import { Card } from '@/shared/ui/atoms/Card';
import { Divider } from '@/shared/ui/atoms/Divider';
import { useAuthStore } from '@/features/auth';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminPerfil() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const menuItems = [
    { icon: 'account-cog', label: 'Editar Perfil', onPress: () => {} },
    { icon: 'shield-account', label: 'Permisos', onPress: () => {} },
    { icon: 'cog', label: 'Configuración Global', onPress: () => router.push('/(admin)/config') },
    { icon: 'database', label: 'Gestión de Datos', onPress: () => {} },
    { icon: 'help-circle', label: 'Ayuda y Soporte', onPress: () => {} },
    { icon: 'logout', label: 'Cerrar Sesión', onPress: handleLogout, danger: true },
  ];

  return (
    <SafeAreaLayout variant="background">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1">Mi Perfil</Typography>
        </View>

        <View style={styles.profileCard}>
          <Avatar size="xl" fallbackInitials={user?.nombre ? user.nombre[0] : 'A'} />
          <Typography variant="h2" className="mt-4">{user?.nombre || 'Admin'} {user?.apellido || ''}</Typography>
          <View style={styles.rolBadge}>
            <Typography variant="caption" className="text-white">Administrador</Typography>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Typography variant="h2">24</Typography>
            <Typography variant="caption" color="secondary">Usuarios</Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="h2">156</Typography>
            <Typography variant="caption" color="secondary">Alertas</Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="h2">89</Typography>
            <Typography variant="caption" color="secondary">Reportes</Typography>
          </Card>
        </View>

        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons 
                  name={item.icon as any} 
                  size={22} 
                  color={item.danger ? '#EF4444' : '#6B7280'} 
                />
                <Typography 
                  variant="body" 
                  className="flex-1 ml-3" 
                  style={item.danger ? { color: '#EF4444' } : {}}
                >
                  {item.label}
                </Typography>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
              </View>
              {index < menuItems.length - 1 && <Divider className="my-2" />}
            </React.Fragment>
          ))}
        </Card>

        <Button variant="outline" label="Cerrar Sesión" className="mt-6" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 16 },
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  rolBadge: { backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statCard: { flex: 1, alignItems: 'center', padding: 12 },
  menuCard: { marginTop: 24, padding: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
});
