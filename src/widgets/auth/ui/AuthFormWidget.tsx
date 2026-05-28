// src/widgets/auth/ui/AuthFormWidget.tsx
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { Typography } from '@/shared/ui/atoms/Typography';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

interface AuthFormWidgetProps {
  initialMode?: 'login' | 'register';
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  error?: string;
}

export const AuthFormWidget = ({
  initialMode = 'login',
  onSubmit,
  isLoading = false,
  error,
}: AuthFormWidgetProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    fullName: '',
    rut: '',
    phone: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (mode === 'login') {
      onSubmit({ rut: formData.rut, password: formData.password });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 w-full flex-row rounded-xl bg-surface-card p-1">
          <Pressable
            onPress={() => setMode('login')}
            className={`h-12 flex-1 items-center justify-center rounded-lg ${mode === 'login' ? 'bg-surface-elevated shadow-md' : 'bg-transparent'}`}
          >
            <Typography variant="h2" color={mode === 'login' ? 'primary' : 'secondary'}>
              Login
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => setMode('register')}
            className={`h-12 flex-1 items-center justify-center rounded-lg ${mode === 'register' ? 'bg-surface-elevated shadow-md' : 'bg-transparent'}`}
          >
            <Typography variant="h2" color={mode === 'register' ? 'primary' : 'secondary'}>
              Registro
            </Typography>
          </Pressable>
        </View>

        <View className="w-full gap-4">
          {mode === 'register' && (
            <Input
              placeholder="Nombre Completo"
              value={formData.fullName}
              onChangeText={(v) => handleChange('fullName', v)}
            />
          )}

          <Input
            placeholder="RUT (Ej: 12.345.678-9)"
            value={formData.rut}
            onChangeText={(v) => handleChange('rut', v)}
          />

          {mode === 'register' && (
            <Input
              placeholder="Teléfono Móvil"
              value={formData.phone}
              onChangeText={(v) => handleChange('phone', v)}
              keyboardType="phone-pad"
            />
          )}

          <Input
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry
          />

          {error && (
            <View className="bg-danger-primary/10 rounded-lg p-3">
              <Typography variant="body" color="danger">
                {error}
              </Typography>
            </View>
          )}

          <Button
            label={mode === 'login' ? 'Ingresar a Terreno' : 'Registrar Usuario'}
            variant="solid"
            className="mt-4"
            isLoading={isLoading}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
