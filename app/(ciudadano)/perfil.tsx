// app/(ciudadano)/perfil.tsx - Perfil de ciudadano
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/features/auth';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
}

const menuItems: MenuItem[] = [
  { id: 'notifications', label: 'Notificaciones', icon: 'bell-outline' },
  { id: 'location', label: 'Ubicación', icon: 'map-marker-outline' },
  { id: 'privacy', label: 'Privacidad', icon: 'shield-outline' },
  { id: 'help', label: 'Ayuda', icon: 'help-circle-outline' },
];

export default function Perfil() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account"
              size={48}
              color="#FFFFFF"
            />
          </View>
          <Typography variant="h2" className="text-white mt-4">
            {user?.nombre || 'Ciudadano'}
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-1">
            {user?.email || 'Sin email'}
          </Typography>
          <View style={styles.roleBadge}>
            <Typography variant="caption" className="text-white">
              {user?.rol === 'brigadista' ? 'Brigadista' : user?.rol === 'admin' ? 'Administrador' : 'Ciudadano'}
            </Typography>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Typography variant="h2" className="text-white">0</Typography>
            <Typography variant="caption" className="text-gray-400">
              Reportes
            </Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Typography variant="h2" className="text-white">0</Typography>
            <Typography variant="caption" className="text-gray-400">
              Alertas
            </Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Typography variant="h2" className="text-white">0</Typography>
            <Typography variant="caption" className="text-gray-400">
              Contribuciones
            </Typography>
          </View>
        </View>

        {/* Menú */}
        <View style={styles.menuSection}>
          <Typography variant="h3" className="text-white mb-4">
            Configuración
          </Typography>
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color="#9CA3AF"
                />
                <Typography variant="body" className="text-white flex-1 ml-4">
                  {item.label}
                </Typography>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color="#EF4444"
          />
          <Typography variant="body" className="text-red-500 ml-3">
            Cerrar sesión
          </Typography>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuList: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
  },
});
