import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserRole } from '@entities/usuario';

interface UserCardProps {
  user: {
    id: number;
    nombre: string;
    rut: string;
    rol: string;
    estado: string;
  };
  onPress: (user: UserCardProps['user']) => void;
}

export function UserCard({ user, onPress }: UserCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(user)}
      accessibilityLabel={`${user.nombre}, ${user.rol}, ${user.estado}`}
      accessibilityRole="button"
    >
      <Card style={styles.card}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={24} color="#6B7280" />
        </View>
        <View style={styles.info}>
          <Typography variant="body" className="font-medium">
            {user.nombre}
          </Typography>
          <Typography variant="caption" color="secondary">
            {user.rut}
          </Typography>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                user.rol === UserRole.ADMIN ? styles.badgeAdmin : styles.badgeBrigadista,
              ]}
            >
              <Typography variant="caption" className="text-white">
                {user.rol}
              </Typography>
            </View>
            <View
              style={[
                styles.badge,
                styles.badgeEstado,
                user.estado === 'Activo' ? styles.badgeActivo : styles.badgeInactivo,
              ]}
            >
              <Typography variant="caption">{user.estado}</Typography>
            </View>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minHeight: 44,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeAdmin: {
    backgroundColor: '#7C3AED',
  },
  badgeBrigadista: {
    backgroundColor: '#F59E0B',
  },
  badgeEstado: {
    backgroundColor: '#E5E7EB',
  },
  badgeActivo: {
    backgroundColor: '#10B981',
  },
  badgeInactivo: {
    backgroundColor: '#EF4444',
  },
});
