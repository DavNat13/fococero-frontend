// app/(admin)/config.tsx - Configuración Global Admin
import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { Divider } from '@/shared/ui/atoms/Divider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const settingsSections = [
  {
    title: 'Notificaciones Globales',
    items: [
      { label: 'Alertas críticas push', icon: 'bell-alert', type: 'switch', value: true },
      { label: 'Reportes de usuarios', icon: 'file-document', type: 'switch', value: true },
      { label: 'Resumen diario', icon: 'email', type: 'switch', value: false },
    ],
  },
  {
    title: 'Zonas de Riesgo',
    items: [
      { label: 'Gestionar zonas', icon: 'map-marker-radius', type: 'nav' },
      { label: 'Niveles de alerta', icon: 'alert-circle', type: 'nav' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Logs del sistema', icon: 'console', type: 'nav' },
      { label: 'Copias de seguridad', icon: 'database', type: 'nav' },
      { label: 'API Gateway', icon: 'api', type: 'status', value: 'Online' },
    ],
  },
];

export default function Configuracion() {
  const handleSettingPress = (item: any) => {
    if (item.type === 'nav') {
      Alert.alert('Navegación', `Ir a ${item.label}`);
    }
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1">Configuración</Typography>
          <Typography variant="body" color="secondary">Ajustes globales del sistema</Typography>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Typography variant="h3" className="mb-3">{section.title}</Typography>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <TouchableOpacity 
                    style={styles.settingItem} 
                    onPress={() => handleSettingPress(item)}
                    disabled={item.type === 'switch'}
                  >
                    <View style={styles.settingIcon}>
                      <MaterialCommunityIcons name={item.icon as any} size={22} color="#6B7280" />
                    </View>
                    <Typography variant="body" className="flex-1">{item.label}</Typography>
{item.type === 'switch' && (
                      <Switch value={Boolean(item.value)} trackColor={{ true: '#EF4444' }} />
                    )}
                    {item.type === 'status' && (
                      <View style={styles.statusBadge}>
                        <Typography variant="caption" className="text-white">{item.value as string}</Typography>
                      </View>
                    )}
                    {item.type === 'nav' && (
                      <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                  {itemIndex < section.items.length - 1 && <Divider className="my-2" />}
                </React.Fragment>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.versionSection}>
          <Typography variant="caption" color="secondary">Versión 1.0.0</Typography>
          <Typography variant="caption" color="secondary">FocoCero © 2026</Typography>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionCard: { padding: 0 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statusBadge: { backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  versionSection: { alignItems: 'center', marginTop: 24 },
});
