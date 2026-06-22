import { Icon, Icons } from '@/shared/ui/icons';
import { FadeIn } from '@/shared/ui/animations/FadeIn';
import { Typography } from '@/shared/ui/atoms/Typography';
import React from 'react';
import { View } from 'react-native';

interface AuthFormHeaderProps {
  mode: 'login' | 'register';
}

export const AuthFormHeader = ({ mode }: AuthFormHeaderProps) => (
  <View className="mb-6 items-center">
    <FadeIn delay={100}>
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full border border-brand-primary/20 bg-brand-primary/10">
        <Icon icon={Icons.Flame} size={32} colorTheme="brand" />
      </View>
    </FadeIn>
    <FadeIn delay={200}>
      <Typography variant="h1" className="text-center text-content-primary">
        {mode === 'login' ? 'Bienvenido' : 'Únete a FocoCero'}
      </Typography>
    </FadeIn>
    <FadeIn delay={300}>
      <Typography variant="body" color="secondary" className="mt-2 text-center">
        {mode === 'login'
          ? 'Ingresa tus credenciales para continuar'
          : 'Crea tu cuenta y protege tu comunidad'}
      </Typography>
    </FadeIn>
  </View>
);
