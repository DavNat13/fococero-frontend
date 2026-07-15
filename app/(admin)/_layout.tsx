import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const tabBarStyle = {
  height: Platform.OS === 'ios' ? 88 : 64,
  paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  paddingTop: 8,
  backgroundColor: '#0C0F17',
  borderTopWidth: 1,
  borderTopColor: '#1F2938',
};

const tabBarLabelStyle = {
  fontSize: 12,
  fontWeight: '500' as const,
};

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarStyle,
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          tabBarLabel: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="crear-reporte"
        options={{
          tabBarLabel: 'Crear',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="config" options={{ href: null }} />
      <Tabs.Screen name="reporte" options={{ href: null }} />
      <Tabs.Screen name="reporte/[id]" options={{ href: null }} />
      <Tabs.Screen name="usuarios" options={{ href: null }} />
    </Tabs>
  );
}
