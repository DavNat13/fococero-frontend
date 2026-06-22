import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useCreateDespacho } from '@/entities/emergencia/api/queries';
import { useGetTodasAlertas } from '@/entities/alerta/api/queries';
import type { Despacho, OrganismoTipo } from '@/entities/emergencia/api/emergencia.api';
import { getOrganismoLabel, getEndpointUrl } from '@/entities/emergencia/api/emergencia.api';
import type { Alerta } from '@/entities/alerta/api/alerta.api';
import { generateUUID } from '@/shared/utils/uuid';

interface OrganismoOption {
  label: string;
  value: OrganismoTipo;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const ORGANISMOS: OrganismoOption[] = [
  { label: 'CONAF', value: 'CONAF', icon: 'pine-tree-fire' },
  { label: 'Bomberos', value: 'BOMBEROS', icon: 'fire-truck' },
  { label: 'Ambulancia', value: 'SAMU', icon: 'ambulance' },
  { label: 'Carabineros', value: 'CARABINEROS', icon: 'police-badge' },
  { label: 'Defensa Civil', value: 'SENAPRED', icon: 'shield-cross' },
];

const ESTADO_STYLES: Record<
  string,
  { badge: string; container: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  PENDIENTE: {
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    container: 'border-l-amber-500',
    icon: 'clock-outline',
  },
  PROCESANDO: {
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    container: 'border-l-blue-500',
    icon: 'send',
  },
  EXITOSO: {
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    container: 'border-l-green-500',
    icon: 'check-circle-outline',
  },
  FALLIDO: {
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    container: 'border-l-red-500',
    icon: 'close-circle-outline',
  },
  REINTENTANDO: {
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    container: 'border-l-purple-500',
    icon: 'refresh',
  },
  CANCELADO: {
    badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    container: 'border-l-gray-500',
    icon: 'cancel',
  },
};

function formatHora(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function formatFecha(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

function getEstadoAlertaColor(estado?: string): string {
  switch (estado) {
    case 'REPORTADA':
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'EN_REVISION':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'DERIVADA':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'RESUELTA':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'DESCARTADA':
      return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
}

export default function Emergencias() {
  const queryClient = useQueryClient();
  const [trackedDespachos, setTrackedDespachos] = useState<Despacho[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const createDespacho = useCreateDespacho();

  const {
    data: alertas = [],
    isLoading: alertasLoading,
    isError: alertasIsError,
    error: alertasError,
    refetch: refetchAlertas,
  } = useGetTodasAlertas();

  const isLoading = alertasLoading;
  const displayError =
    error ||
    (alertasIsError ? (alertasError as Error)?.message || 'Error al cargar alertas' : null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    queryClient.invalidateQueries({ queryKey: ['emergencias'] });
    queryClient.invalidateQueries({ queryKey: ['alertas'] });
    await refetchAlertas();
    setRefreshing(false);
  }, [queryClient, refetchAlertas]);

  const executeCreateDespacho = useCallback(
    async (alertaId: string, organismo: OrganismoTipo, organismoLabel: string) => {
      try {
        const correlationId = generateUUID();
        const despacho = await createDespacho.mutateAsync({
          alerta_id: alertaId,
          correlation_id: correlationId,
          organismo,
          prioridad: 'MEDIA',
          request_payload: {
            alerta_id: alertaId,
            mensaje: `Despacho automático a ${organismoLabel}`,
          },
          endpoint_url: getEndpointUrl(organismo),
        });

        setTrackedDespachos((prev) => [despacho, ...prev]);
        Alert.alert(
          'Despacho creado',
          `Despacho enviado a ${organismoLabel}.\n\nID de seguimiento:\n${despacho.correlation_id}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error inesperado al crear despacho';
        setError(msg);
        Alert.alert('Error', msg);
      }
    },
    [createDespacho],
  );

  const promptOrganismoSelection = useCallback(
    (alertaId?: string) => {
      const buttons: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' }[] =
        ORGANISMOS.map((org) => ({
          text: org.label,
          onPress: () => {
            if (alertaId) {
              executeCreateDespacho(alertaId, org.value, org.label);
            } else {
              const alertasList = alertas;
              if (alertasList.length > 0) {
                const alertaButtons: {
                  text: string;
                  onPress?: () => void;
                  style?: 'cancel' | 'destructive';
                }[] = alertasList.map((alerta) => ({
                  text: `${alerta.tipo} - ${(alerta.descripcion || '').substring(0, 28)}${(alerta.descripcion || '').length > 28 ? '…' : ''}`,
                  onPress: () => {
                    if (!alerta.id) {
                      Alert.alert('Error', 'Esta alerta no tiene un ID válido');
                      return;
                    }
                    executeCreateDespacho(alerta.id, org.value, org.label);
                  },
                }));
                alertaButtons.push({ text: 'Cancelar', style: 'cancel' });
                Alert.alert(
                  'Seleccionar alerta',
                  `¿A qué alerta asociar el despacho a ${org.label}?`,
                  alertaButtons,
                );
              }
            }
          },
        }));
      buttons.push({ text: 'Cancelar', style: 'cancel' });
      Alert.alert('Nuevo despacho', 'Selecciona el organismo destinatario:', buttons);
    },
    [alertas, executeCreateDespacho],
  );

  const handleDespacharAlerta = useCallback(
    (alerta: Alerta) => {
      const buttons: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' }[] =
        ORGANISMOS.map((org) => ({
          text: org.label,
          onPress: () => {
            if (!alerta.id) {
              Alert.alert('Error', 'Esta alerta no tiene un ID válido');
              return;
            }
            executeCreateDespacho(alerta.id, org.value, org.label);
          },
        }));
      buttons.push({ text: 'Cancelar', style: 'cancel' });
      Alert.alert('Despachar alerta', `Selecciona el organismo para "${alerta.tipo}":`, buttons);
    },
    [executeCreateDespacho],
  );

  const hasContent = trackedDespachos.length > 0 || alertas.length > 0;

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        className="flex-1 px-4 pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EF4444"
            colors={['#EF4444']}
            progressBackgroundColor="#1F2937"
          />
        }
      >
        <View className="mb-6 flex-row items-center gap-3 pt-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <MaterialCommunityIcons name="alert-decagram" size={28} color="#EF4444" />
          </View>
          <View className="flex-1">
            <Typography variant="h1" className="text-white">
              Emergencias
            </Typography>
            <Typography variant="body" color="secondary" className="mt-0.5">
              Seguimiento de emergencias activas
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => promptOrganismoSelection()}
          activeOpacity={0.8}
          disabled={createDespacho.isPending}
          className={`mb-6 flex-row items-center justify-center gap-3 rounded-2xl p-4 shadow-lg shadow-red-600/30 ${createDespacho.isPending ? 'bg-red-600/50' : 'bg-red-600'}`}
          accessibilityLabel="Crear nuevo despacho"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name={createDespacho.isPending ? 'progress-check' : 'plus-circle-outline'}
            size={22}
            color="#FFFFFF"
          />
          <Typography variant="body" className="font-semibold text-white">
            {createDespacho.isPending ? 'Creando despacho...' : 'Nuevo despacho'}
          </Typography>
        </TouchableOpacity>

        {isLoading ? (
          <View className="pt-4">
            <LoadingSkeleton lines={4} lineHeight={20} />
          </View>
        ) : displayError ? (
          <ErrorBanner message={displayError} onRetry={onRefresh} />
        ) : !hasContent ? (
          <View className="items-center py-20">
            <MaterialCommunityIcons name="shield-check-outline" size={72} color="#4B5563" />
            <Typography variant="body" color="secondary" className="mt-4 text-center">
              No hay emergencias activas
            </Typography>
            <Typography variant="caption" color="tertiary" className="mt-2 text-center">
              Todas las situaciones están bajo control
            </Typography>
          </View>
        ) : (
          <View className="gap-8">
            {trackedDespachos.length > 0 && (
              <View>
                <View className="mb-3 flex-row items-center gap-2">
                  <MaterialCommunityIcons name="send" size={18} color="#9CA3AF" />
                  <Typography variant="h2" className="text-white">
                    Despachos activos
                  </Typography>
                  <View className="ml-1 rounded-full bg-red-500/20 px-2.5 py-0.5">
                    <Typography variant="caption" className="text-red-400">
                      {trackedDespachos.length}
                    </Typography>
                  </View>
                </View>
                <View className="gap-3">
                  {trackedDespachos.map((despacho) => {
                    const estadoStyle = ESTADO_STYLES[despacho.estado] || ESTADO_STYLES.PENDIENTE;
                    return (
                      <View
                        key={despacho.correlation_id}
                        className={`rounded-2xl border border-gray-700/50 bg-slate-800 p-4 ${estadoStyle.container} border-l-4`}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2">
                            <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                              <MaterialCommunityIcons name="domain" size={16} color="#D1D5DB" />
                            </View>
                            <View>
                              <Typography variant="label" className="text-white">
                                {getOrganismoLabel(despacho.organismo as OrganismoTipo) ||
                                  despacho.organismo}
                              </Typography>
                              <Typography variant="caption" color="tertiary">
                                ID: {despacho.correlation_id.substring(0, 12)}…
                              </Typography>
                            </View>
                          </View>
                          <View className={`rounded-full border px-3 py-1 ${estadoStyle.badge}`}>
                            <View className="flex-row items-center gap-1.5">
                              <MaterialCommunityIcons
                                name={estadoStyle.icon}
                                size={12}
                                color={
                                  despacho.estado === 'PENDIENTE'
                                    ? '#FBBF24'
                                    : despacho.estado === 'PROCESANDO'
                                      ? '#60A5FA'
                                      : despacho.estado === 'EXITOSO'
                                        ? '#34D399'
                                        : despacho.estado === 'FALLIDO'
                                          ? '#F87171'
                                          : '#9CA3AF'
                                }
                              />
                              <Typography variant="caption" className="text-inherit">
                                {despacho.estado}
                              </Typography>
                            </View>
                          </View>
                        </View>
                        <View className="mt-3 flex-row items-center gap-2 border-t border-gray-700/30 pt-3">
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
                          <Typography variant="caption" color="tertiary">
                            {formatFecha(despacho.created_at)} · {formatHora(despacho.created_at)}
                          </Typography>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {alertas.length > 0 && (
              <View>
                <View className="mb-3 flex-row items-center gap-2">
                  <MaterialCommunityIcons name="bell-ring-outline" size={18} color="#9CA3AF" />
                  <Typography variant="h2" className="text-white">
                    Alertas activas
                  </Typography>
                  <View className="ml-1 rounded-full bg-amber-500/20 px-2.5 py-0.5">
                    <Typography variant="caption" className="text-amber-400">
                      {alertas.length}
                    </Typography>
                  </View>
                </View>
                <View className="gap-3">
                  {alertas.map((alerta, index) => (
                    <View
                      key={alerta.id || `alerta-${index}`}
                      className="rounded-2xl border border-gray-700/50 bg-slate-800 p-4"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <View className="h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                            <MaterialCommunityIcons
                              name={
                                alerta.tipo?.toLowerCase().includes('incendio')
                                  ? 'pine-tree-fire'
                                  : alerta.tipo?.toLowerCase().includes('inundacion')
                                    ? 'water'
                                    : alerta.tipo?.toLowerCase().includes('sismo')
                                      ? 'alert-circle-outline'
                                      : 'alert-outline'
                              }
                              size={16}
                              color="#EF4444"
                            />
                          </View>
                          <Typography variant="label" className="text-white">
                            {alerta.tipo || 'Alerta'}
                          </Typography>
                        </View>
                        {alerta.estado && (
                          <View
                            className={`rounded-full border px-3 py-1 ${getEstadoAlertaColor(alerta.estado)}`}
                          >
                            <Typography variant="caption" className="text-inherit">
                              {alerta.estado.replace(/_/g, ' ')}
                            </Typography>
                          </View>
                        )}
                      </View>
                      {alerta.descripcion ? (
                        <Typography
                          variant="body"
                          color="secondary"
                          className="mt-3 leading-5"
                          numberOfLines={3}
                        >
                          {alerta.descripcion}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="tertiary" className="mt-3 italic">
                          Sin descripción
                        </Typography>
                      )}
                      <View className="mt-3 flex-row items-center gap-3">
                        {alerta.fecha_creacion && (
                          <View className="flex-row items-center gap-1">
                            <MaterialCommunityIcons
                              name="clock-outline"
                              size={13}
                              color="#6B7280"
                            />
                            <Typography variant="caption" color="tertiary">
                              {formatFecha(alerta.fecha_creacion)} ·{' '}
                              {formatHora(alerta.fecha_creacion)}
                            </Typography>
                          </View>
                        )}
                        {alerta.ubicacion?.coordinates && (
                          <View className="flex-row items-center gap-1">
                            <MaterialCommunityIcons name="map-marker" size={13} color="#6B7280" />
                            <Typography variant="caption" color="tertiary">
                              {alerta.ubicacion.coordinates[1].toFixed(4)},{' '}
                              {alerta.ubicacion.coordinates[0].toFixed(4)}
                            </Typography>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDespacharAlerta(alerta)}
                        activeOpacity={0.7}
                        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-600/20 px-4 py-3"
                        accessibilityLabel={`Despachar alerta de ${alerta.tipo}`}
                        accessibilityRole="button"
                      >
                        <MaterialCommunityIcons name="send" size={16} color="#EF4444" />
                        <Typography variant="label" className="text-red-400">
                          Despachar
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaLayout>
  );
}
