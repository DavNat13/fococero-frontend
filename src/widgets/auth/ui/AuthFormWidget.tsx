// src/widgets/auth/ui/AuthFormWidget.tsx
import React, { useState } from 'react';
import { View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

interface AuthFormWidgetProps {
  initialMode?: 'login' | 'register';
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AuthFormWidget = ({
  initialMode = 'login',
  onSubmit,
  isLoading = false,
}: AuthFormWidgetProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

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
          {mode === 'register' && <Input placeholder="Nombre Completo" />}

          <Input placeholder="RUT (Ej: 12.345.678-9)" keyboardType="default" isTechnicalData />

          {mode === 'register' && (
            <Input placeholder="Teléfono Móvil" keyboardType="phone-pad" isTechnicalData />
          )}

          <Input placeholder="Contraseña" secureTextEntry />

          <Button
            label={mode === 'login' ? 'Ingresar a Terreno' : 'Registrar Brigadista'}
            variant="solid"
            className="mt-4"
            isLoading={isLoading}
            onPress={() => onSubmit({})}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
