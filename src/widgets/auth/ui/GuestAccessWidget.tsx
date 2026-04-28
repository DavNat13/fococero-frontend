// src/widgets/auth/ui/GuestAccessWidget.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Input } from '@/shared/ui/atoms/Input';
import { Button } from '@/shared/ui/atoms/Button';

interface GuestAccessWidgetProps {
  onGuestSubmit: (rut: string, phone: string) => void;
  isLoading?: boolean;
}

export const GuestAccessWidget = ({ onGuestSubmit, isLoading = false }: GuestAccessWidgetProps) => {
  return (
    <View className="w-full bg-surface-background px-6">
      <View className="mb-6 rounded-xl border border-feedback-warning bg-feedback-warning/10 p-4">
        <Typography variant="body" className="mb-1 font-semibold text-feedback-warning">
          Modo Despliegue Rápido
        </Typography>
        <Typography variant="caption" color="secondary">
          No necesitas contraseña. Tus reportes serán marcados como "Brigadista No Verificado" hasta
          confirmar identidad en base.
        </Typography>
      </View>

      <View className="w-full gap-4">
        <Input placeholder="RUT" isTechnicalData />

        <Input placeholder="Teléfono" keyboardType="phone-pad" isTechnicalData />

        <Button
          label="Entrar al Mapa"
          variant="warning"
          className="mt-4"
          isLoading={isLoading}
          onPress={() => onGuestSubmit('111', '222')}
        />
      </View>
    </View>
  );
};
