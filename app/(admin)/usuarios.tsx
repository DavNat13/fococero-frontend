// app/(admin)/usuarios.tsx - Gestión de Usuarios
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { SearchBar } from '@/shared/ui/molecules/SearchBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { apiClient } from '@/core/api';
import { UserCard } from '@/entities/usuario/ui/UserCard';

interface UsuarioItem {
  id: number;
  nombre: string;
  rut: string;
  rol: string;
  estado: string;
}

export default function GestionUsuarios() {
  const [searchQuery, setSearchQuery] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarUsuarios();
    setRefreshing(false);
  }, []);

  const cargarUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<UsuarioItem[]>('/api/auth/usuarios');
      if (response.success) {
        setUsuarios(response.data);
      } else {
        setError(response.error?.message || 'Error al cargar usuarios');
      }
    } catch {
      setError('Error de conexión al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserPress = (user: UsuarioItem) => {
    Alert.alert('Usuario', `Seleccionado: ${user.nombre}\nRol: ${user.rol}`);
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        <View style={styles.header}>
          <Typography variant="h1">Gestión de Usuarios</Typography>
          <Typography variant="body" color="secondary">
            Administra usuarios del sistema
          </Typography>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={error} onRetry={() => cargarUsuarios()} />
          </View>
        )}

        <SearchBar
          placeholder="Buscar por nombre o RUT..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filters}>
          <TouchableOpacity
            style={styles.filterChip}
            accessibilityLabel="Filtrar: Todos"
            accessibilityRole="button"
          >
            <Typography variant="caption" className="text-white">
              Todos
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, styles.filterChipOutline]}
            accessibilityLabel="Filtrar: Brigadistas"
            accessibilityRole="button"
          >
            <Typography variant="caption">Brigadistas</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, styles.filterChipOutline]}
            accessibilityLabel="Filtrar: Usuarios"
            accessibilityRole="button"
          >
            <Typography variant="caption">Usuarios</Typography>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.userList}>
            <LoadingSkeleton lines={4} lineHeight={72} lastLineWidth={100} />
          </View>
        ) : (
          <View style={styles.userList}>
            {usuarios.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="account-search" size={64} color="#4B5563" />
                <Typography variant="body" className="mt-4 text-gray-400">
                  No se encontraron usuarios
                </Typography>
              </View>
            ) : (
              usuarios.map((user) => (
                <UserCard key={user.id} user={user} onPress={handleUserPress} />
              ))
            )}
          </View>
        )}

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
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterChipOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D1D5DB' },
  userList: { gap: 12 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 12, minHeight: 44 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  errorContainer: {
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: { flex: 1, marginLeft: 12 },
  userBadges: { flexDirection: 'row', gap: 8, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeAdmin: { backgroundColor: '#7C3AED' },
  badgeBrigadista: { backgroundColor: '#F59E0B' },
  badgeEstado: { backgroundColor: '#E5E7EB' },
  badgeActivo: { backgroundColor: '#10B981' },
  badgeInactivo: { backgroundColor: '#EF4444' },
});
