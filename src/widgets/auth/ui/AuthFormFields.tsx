import { Input } from '@/shared/ui/atoms/Input';
import { Icon, Icons } from '@/shared/ui/icons';
import { FadeIn } from '@/shared/ui/animations/FadeIn';
import { ShakeError } from '@/shared/ui/animations/ShakeError';
import { Typography } from '@/shared/ui/atoms/Typography';
import React from 'react';
import { View } from 'react-native';

interface AuthFormFieldsProps {
  mode: 'login' | 'register';
  formData: { fullName: string; rut: string; phone: string; password: string };
  onChange: (field: string, value: string) => void;
  error?: string;
}

export const AuthFormFields = ({ mode, formData, onChange, error }: AuthFormFieldsProps) => {
  const delays = {
    name: 350,
    rut: mode === 'register' ? 400 : 350,
    phone: 450,
    password: mode === 'register' ? 500 : 400,
  };

  return (
    <View className="gap-5">
      {mode === 'register' && (
        <FadeIn delay={delays.name}>
          <Input
            placeholder="Nombre Completo"
            value={formData.fullName}
            onChangeText={(v) => onChange('fullName', v)}
            leftIcon={<Icon icon={Icons.User} size="sm" colorTheme="secondary" />}
          />
        </FadeIn>
      )}

      <FadeIn delay={delays.rut}>
        <Input
          placeholder="RUT (Ej: 12.345.678-9)"
          value={formData.rut}
          onChangeText={(v) => onChange('rut', v)}
          leftIcon={<Icon icon={Icons.Key} size="sm" colorTheme="secondary" />}
        />
      </FadeIn>

      {mode === 'register' && (
        <FadeIn delay={delays.phone}>
          <Input
            placeholder="Teléfono Móvil"
            value={formData.phone}
            onChangeText={(v) => onChange('phone', v)}
            keyboardType="phone-pad"
            leftIcon={<Icon icon={Icons.Phone} size="sm" colorTheme="secondary" />}
          />
        </FadeIn>
      )}

      <FadeIn delay={delays.password}>
        <Input
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(v) => onChange('password', v)}
          isPassword
          leftIcon={<Icon icon={Icons.Lock} size="sm" colorTheme="secondary" />}
        />
      </FadeIn>

      <ShakeError trigger={!!error}>
        {error && (
          <View className="flex-row items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
            <Icon icon={Icons.AlertTriangle} size="sm" colorTheme="danger" />
            <Typography variant="body" color="danger" className="flex-1">
              {error}
            </Typography>
          </View>
        )}
      </ShakeError>
    </View>
  );
};
