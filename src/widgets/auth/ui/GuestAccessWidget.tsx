// src/widgets/auth/ui/GuestAccessWidget.tsx
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { Typography } from '@/shared/ui/atoms/Typography';
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { rutSchema, telefonoSchema } from '@entities/usuario';

interface GuestAccessWidgetProps {
  onGuestSubmit: (rut: string, phone: string) => void;
  isLoading?: boolean;
}

export const GuestAccessWidget = ({ onGuestSubmit, isLoading = false }: GuestAccessWidgetProps) => {
  const [rut, setRut] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    const cleanRut = rut.replace(/\./g, '').toUpperCase();
    const cleanPhone = phone.startsWith('+56') ? phone : `+56${phone}`;

    const rutResult = rutSchema.safeParse(cleanRut);
    if (!rutResult.success) {
      Alert.alert('Error', 'RUT inválido. Ingrese un RUT chileno válido.');
      return;
    }

    const phoneResult = telefonoSchema.safeParse(cleanPhone);
    if (!phoneResult.success) {
      Alert.alert('Error', 'Teléfono inválido. Ingrese un número de 9 dígitos.');
      return;
    }

    onGuestSubmit(cleanRut, cleanPhone);
  };

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
        <Input placeholder="RUT" value={rut} onChangeText={setRut} />

        <Input
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Button
          label="Entrar al Mapa"
          variant="warning"
          className="mt-4"
          isLoading={isLoading}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};
