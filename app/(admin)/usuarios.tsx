// app/(admin)/usuarios.tsx - Gestión de Usuarios
import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { SearchBar } from '@/shared/ui/molecules/SearchBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { apiClient } from '@/core/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserCard } from '@/entities/usuario/ui/UserCard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UsuarioItem {
  id: number;
  nombre: string;
  rut: string;
  rol: string;
  estado: string;
}

type FilterType = 'todos' | 'brigadista' | 'usuario';

// ---------------------------------------------------------------------------
// Filters config
// ---------------------------------------------------------------------------

interface FilterOption {
  label: string;
  value: FilterType;
  activeBg: string;
}

const FILTERS: FilterOption[] = [
  { label: 'Todos', value: 'todos', activeBg: 'bg-red-600' },
  { label: 'Brigadistas', value: 'brigadista', activeBg: 'bg-amber-600' },
  { label: 'Usuarios', value: 'usuario', activeBg: 'bg-blue-600' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GestionUsuarios() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: usuarios,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await apiClient.get<UsuarioItem[]>('/api/auth/users');
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });

  // ── Pull-to-refresh ──────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    setRefreshing(false);
  }, [queryClient]);

  // ── Tap handler ──────────────────────────────────────────────────────
  const handleUserPress = useCallback((user: UsuarioItem) => {
    Alert.alert('Usuario', `Seleccionado: ${user.nombre}\nRol: ${user.rol}`);
  }, []);

  // ── Local filter + search ────────────────────────────────────────────
  const filteredUsuarios = (usuarios ?? []).filter((user) => {
    if (activeFilter === 'brigadista' && user.rol !== 'brigadista') return false;
    if (activeFilter === 'usuario' && user.rol !== 'usuario') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return user.nombre.toLowerCase().includes(q) || user.rut.toLowerCase().includes(q);
    }

    return true;
  });

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerClassName="px-4 pt-4 pb-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EF4444"
            colors={['#EF4444']}
            progressBackgroundColor="#1E293B"
          />
        }
      >
        {/* ─── Header ─────────────────────────────────────────────── */}
        <View className="mb-4">
          <Typography variant="h1">Gestión de Usuarios</Typography>
          <Typography variant="body" color="secondary">
            Administra usuarios del sistema
          </Typography>
        </View>

        {/* ─── Error Banner ───────────────────────────────────────── */}
        {error && (
          <View className="mb-4">
            <ErrorBanner message={(error as Error).message} onRetry={() => refetch()} />
          </View>
        )}

        {/* ─── Search ─────────────────────────────────────────────── */}
        <SearchBar
          placeholder="Buscar por nombre o RUT..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* ─── Filter chips ───────────────────────────────────────── */}
        <View className="my-4 flex-row gap-2">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => setActiveFilter(f.value)}
                accessibilityLabel={`Filtrar: ${f.label}`}
                accessibilityRole="button"
                className={
                  isActive
                    ? `${f.activeBg} rounded-full px-4 py-2`
                    : 'rounded-full border border-slate-700 bg-slate-800 px-4 py-2'
                }
              >
                <Typography variant="caption" className={isActive ? 'text-white' : 'text-gray-400'}>
                  {f.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Content ────────────────────────────────────────────── */}
        {isLoading ? (
          <LoadingSkeleton lines={4} lineHeight={72} lastLineWidth={100} />
        ) : filteredUsuarios.length === 0 ? (
          <View className="items-center justify-center py-16">
            <MaterialCommunityIcons name="account-search" size={64} color="#6B7280" />
            <Typography variant="body" className="mt-4 text-gray-400">
              No se encontraron usuarios
            </Typography>
          </View>
        ) : (
          <View className="gap-3">
            {filteredUsuarios.map((user) => (
              <UserCard key={user.id} user={user} onPress={handleUserPress} />
            ))}
          </View>
        )}

        {/* ─── Add User Button ────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => Alert.alert('Nuevo usuario', 'Formulario de registro')}
          className="mb-4 mt-6 items-center rounded-2xl bg-red-600 p-4"
          accessibilityLabel="Agregar Usuario"
          accessibilityRole="button"
        >
          <Typography variant="body" className="font-semibold text-white">
            Agregar Usuario
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaLayout>
  );
}
