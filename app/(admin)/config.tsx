// app/(admin)/config.tsx - Configuración Global Admin
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { LoadingSkeleton } from '@/shared/ui/molecules/LoadingSkeleton';
import { ErrorBanner } from '@/shared/ui/molecules/ErrorBanner';
import { SettingItem } from '@/shared/ui/molecules/SettingItem';
import { globalStorage } from '@core/offline';

const STORAGE_KEYS = {
  alertasCriticas: 'config_alertas_criticas',
  reportesUsuarios: 'config_reportes_usuarios',
  resumenDiario: 'config_resumen_diario',
};

export default function Configuracion() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertasCriticas, setAlertasCriticas] = useState(true);
  const [reportesUsuarios, setReportesUsuarios] = useState(true);
  const [resumenDiario, setResumenDiario] = useState(false);

  const reloadSettings = useCallback(async () => {
    try {
      const [ac, ru, rd] = await Promise.all([
        globalStorage.getItem(STORAGE_KEYS.alertasCriticas),
        globalStorage.getItem(STORAGE_KEYS.reportesUsuarios),
        globalStorage.getItem(STORAGE_KEYS.resumenDiario),
      ]);
      if (ac !== null) setAlertasCriticas(ac === 'true');
      if (ru !== null) setReportesUsuarios(ru === 'true');
      if (rd !== null) setResumenDiario(rd === 'true');
    } catch {
      // use defaults
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reloadSettings();
    setRefreshing(false);
  }, [reloadSettings]);

  useEffect(() => {
    (async () => {
      try {
        const ac = await globalStorage.getItem(STORAGE_KEYS.alertasCriticas);
        const ru = await globalStorage.getItem(STORAGE_KEYS.reportesUsuarios);
        const rd = await globalStorage.getItem(STORAGE_KEYS.resumenDiario);
        if (ac !== null) setAlertasCriticas(ac === 'true');
        if (ru !== null) setReportesUsuarios(ru === 'true');
        if (rd !== null) setResumenDiario(rd === 'true');
      } catch {
        // use defaults
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistSwitch = useCallback(async (key: string, value: boolean) => {
    await globalStorage.setItem(key, value.toString());
  }, []);

  const settingsSections: {
    title: string;
    items: React.ReactNode[];
  }[] = [
    {
      title: 'Notificaciones Globales',
      items: [
        <SettingItem
          key="ac"
          icon="bell-alert"
          label="Alertas críticas push"
          type="switch"
          value={alertasCriticas}
          onValueChange={(v) => {
            setAlertasCriticas(v);
            persistSwitch(STORAGE_KEYS.alertasCriticas, v);
          }}
          showDivider
        />,
        <SettingItem
          key="ru"
          icon="file-document"
          label="Reportes de usuarios"
          type="switch"
          value={reportesUsuarios}
          onValueChange={(v) => {
            setReportesUsuarios(v);
            persistSwitch(STORAGE_KEYS.reportesUsuarios, v);
          }}
          showDivider
        />,
        <SettingItem
          key="rd"
          icon="email"
          label="Resumen diario"
          type="switch"
          value={resumenDiario}
          onValueChange={(v) => {
            setResumenDiario(v);
            persistSwitch(STORAGE_KEYS.resumenDiario, v);
          }}
        />,
      ],
    },
    {
      title: 'Zonas de Riesgo',
      items: [
        <SettingItem
          key="gz"
          icon="map-marker-radius"
          label="Gestionar zonas"
          type="nav"
          onPress={() => Alert.alert('Navegación', 'Ir a Gestionar zonas')}
          showDivider
        />,
        <SettingItem
          key="na"
          icon="alert-circle"
          label="Niveles de alerta"
          type="nav"
          onPress={() => Alert.alert('Navegación', 'Ir a Niveles de alerta')}
        />,
      ],
    },
    {
      title: 'Sistema',
      items: [
        <SettingItem
          key="logs"
          icon="console"
          label="Logs del sistema"
          type="nav"
          onPress={() => Alert.alert('Navegación', 'Ir a Logs del sistema')}
          showDivider
        />,
        <SettingItem
          key="backup"
          icon="database"
          label="Copias de seguridad"
          type="nav"
          onPress={() => Alert.alert('Navegación', 'Ir a Copias de seguridad')}
          showDivider
        />,
        <SettingItem key="api" icon="api" label="API Gateway" type="status" value="Online" />,
      ],
    },
  ];

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />
        }
      >
        <View className="p-4">
          <View className="mb-6">
            <Typography variant="h1">Configuración</Typography>
            <Typography variant="body" color="secondary">
              Ajustes globales del sistema
            </Typography>
          </View>

          {error && (
            <View className="mb-4">
              <ErrorBanner message={error} onRetry={() => setError(null)} />
            </View>
          )}

          {isLoading ? (
            <LoadingSkeleton lines={8} lineHeight={20} />
          ) : (
            <>
              {settingsSections.map((section, sectionIndex) => (
                <View key={sectionIndex} className="mb-6">
                  <Typography variant="h3" className="mb-3">
                    {section.title}
                  </Typography>
                  <View className="overflow-hidden rounded-2xl bg-slate-800">
                    {section.items.map((item) => item)}
                  </View>
                </View>
              ))}
              <View className="mt-6 items-center">
                <Typography variant="caption" color="secondary">
                  Versión 1.0.0
                </Typography>
                <Typography variant="caption" color="secondary">
                  FocoCero © 2026
                </Typography>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
}
