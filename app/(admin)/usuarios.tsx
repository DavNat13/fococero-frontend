// app/(admin)/usuarios.tsx - Gestión de Usuarios
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { Button } from '@/shared/ui/atoms/Button';
import { SearchBar } from '@/shared/ui/molecules/SearchBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mockUsers = [
  { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', rol: 'Brigadista', estado: 'Activo' },
  { id: 2, nombre: 'María González', rut: '11.222.333-4', rol: 'Usuario', estado: 'Activo' },
  { id: 3, nombre: 'Carlos López', rut: '10.111.222-3', rol: 'Brigadista', estado: 'Inactivo' },
  { id: 4, nombre: 'Ana Martínez', rut: '09.000.111-2', rol: 'Admin', estado: 'Activo' },
];

export default function GestionUsuarios() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserPress = (user: typeof mockUsers[0]) => {
    Alert.alert('Usuario', `Seleccionado: ${user.nombre}\nRol: ${user.rol}`);
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1">Gestión de Usuarios</Typography>
          <Typography variant="body" color="secondary">Administra usuarios del sistema</Typography>
        </View>

        <SearchBar
          placeholder="Buscar por nombre o RUT..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterChip}>
            <Typography variant="caption" className="text-white">Todos</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
            <Typography variant="caption">Brigadistas</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
            <Typography variant="caption">Usuarios</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.userList}>
          {mockUsers.map((user) => (
            <TouchableOpacity key={user.id} onPress={() => handleUserPress(user)}>
              <Card style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <MaterialCommunityIcons name="account" size={24} color="#6B7280" />
                </View>
                <View style={styles.userInfo}>
                  <Typography variant="body" className="font-medium">{user.nombre}</Typography>
                  <Typography variant="caption" color="secondary">{user.rut}</Typography>
                  <View style={styles.userBadges}>
                    <View style={[styles.badge, user.rol === 'Admin' ? styles.badgeAdmin : styles.badgeBrigadista]}>
                      <Typography variant="caption" className="text-white">{user.rol}</Typography>
                    </View>
                    <View style={[styles.badge, styles.badgeEstado, user.estado === 'Activo' ? styles.badgeActivo : styles.badgeInactivo]}>
                      <Typography variant="caption">{user.estado}</Typography>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          variant="solid"
          label="Agregar Usuario"
          className="mt-4"
          onPress={() => Alert.alert('Agregar', 'Formulario de nuevo usuario')}
        />
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 16 },
  filters: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EF4444' },
  filterChipOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D1D5DB' },
  userList: { gap: 12 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 12 },
  userBadges: { flexDirection: 'row', gap: 8, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeAdmin: { backgroundColor: '#7C3AED' },
  badgeBrigadista: { backgroundColor: '#F59E0B' },
  badgeEstado: { backgroundColor: '#E5E7EB' },
  badgeActivo: { backgroundColor: '#10B981' },
  badgeInactivo: { backgroundColor: '#EF4444' },
});
