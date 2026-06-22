import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AlertaCard } from '@/entities/alerta/ui/AlertaCard';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMisAlertas } from '@/entities/alerta/api/queries';
import type { Alerta, AlertaEstado } from '@/entities/alerta/api/alerta.api';

type TabKey = 'todas' | 'pendientes' | 'resueltas';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'resueltas', label: 'Resueltas' },
];

const FILTER_MAP: Record<TabKey, AlertaEstado[] | null> = {
  todas: null,
  pendientes: ['REPORTADA', 'EN_REVISION', 'DERIVADA'],
  resueltas: ['RESUELTA', 'DESCARTADA'],
};

export default function AlertasScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('todas');
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { data: alertas, isLoading, error, refetch } = useGetMisAlertas();

  const filtered = useMemo(() => {
    const estados = FILTER_MAP[activeTab];
    if (!estados || !alertas) return alertas || [];
    return alertas.filter((a) => a.estado && estados.includes(a.estado));
  }, [alertas, activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['alertas'] });
    setRefreshing(false);
  }, [queryClient]);

  const renderItem = useCallback(
    ({ item }: { item: Alerta }) => <AlertaCard key={item.id} alerta={item} />,
    [],
  );

  const renderEmpty = () => (
    <View className="items-center justify-center py-24">
      <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-slate-800">
        <MaterialCommunityIcons name="bell-off-outline" size={40} color="#6B7280" />
      </View>
      <Typography variant="body" className="text-center text-gray-400">
        No hay alertas
      </Typography>
      <Typography variant="caption" className="mt-2 text-center text-gray-500">
        {activeTab === 'todas' && 'Tu zona está segura'}
        {activeTab === 'pendientes' && 'No tienes alertas pendientes'}
        {activeTab === 'resueltas' && 'No hay alertas resueltas'}
      </Typography>
    </View>
  );

  const renderContent = () => {
    if (isLoading) return <LoadingSkeleton lines={4} />;
    if (error) return <ErrorBanner message={(error as Error).message} onRetry={() => refetch()} />;
    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
            progressBackgroundColor="#1F2937"
          />
        }
      />
    );
  };

  return (
    <SafeAreaLayout variant="background">
      <View className="flex-1 px-4">
        <View className="mb-6 mt-2">
          <Typography variant="h1" className="text-white">
            Alertas
          </Typography>
          <Typography variant="body" className="mt-2 text-gray-400">
            Mantente informado sobre tu zona
          </Typography>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5 flex-shrink-0"
        >
          <View className="flex-row gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className={`rounded-xl px-5 py-2.5 ${
                    isActive ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                  accessibilityLabel={tab.label}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                >
                  <Typography
                    variant="label"
                    className={`font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}
                  >
                    {tab.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View className="flex-1">{renderContent()}</View>
      </View>
    </SafeAreaLayout>
  );
}
