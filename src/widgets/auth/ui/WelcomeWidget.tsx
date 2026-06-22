import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { Button, GoogleIcon, Icon, Icons, SafeAreaLayout, Typography } from '@shared/ui';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { useAuthStore } from '@/features/auth';
import { UserRole } from '@entities/usuario';
import { AUTH_TEXTS } from '../constants';
import { WELCOME_CHOREOGRAPHY } from '../lib';
import { LegalModal } from './LegalModal';

function getRouteByRole(rol: UserRole): string {
  switch (rol) {
    case UserRole.ADMIN:
      return '/(admin)';
    case UserRole.BRIGADISTA:
      return '/(brigadista)';
    case UserRole.INVITADO:
      return '/(invitado)';
    case UserRole.USUARIO:
      return '/(ciudadano)';
    default:
      return '/(ciudadano)';
  }
}

export const WelcomeWidget = () => {
  const [isLegalModalVisible, setLegalModalVisible] = useState(false);
  const {
    signIn: signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    const { user } = useAuthStore.getState();
    if (user) {
      router.replace(getRouteByRole(user.rol) as any);
    }
  };

  return (
    <SafeAreaLayout className="flex-1 justify-between bg-surface-background">
      <View className="mt-16 flex-1 items-center justify-center px-6">
        <Animated.View
          entering={FadeInDown.delay(WELCOME_CHOREOGRAPHY.LOGO).springify().damping(12)}
        >
          <View className="mb-8 h-24 w-24 items-center justify-center rounded-full border border-brand-primary/20 bg-brand-primary/10">
            <Icon icon={Icons.Flame} size={48} colorTheme="brand" />
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(WELCOME_CHOREOGRAPHY.TITLE).springify()}
          className="items-center"
        >
          <Typography
            variant="h1"
            className="mb-3 text-center text-3xl font-bold text-content-primary"
          >
            {AUTH_TEXTS.WELCOME.TITLE}
          </Typography>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(WELCOME_CHOREOGRAPHY.SUBTITLE).springify()}>
          <Typography
            variant="body"
            className="px-4 text-center text-base leading-relaxed text-content-secondary"
          >
            {AUTH_TEXTS.WELCOME.SUBTITLE}
          </Typography>
        </Animated.View>
      </View>

      <View className="w-full px-6 pb-8 pt-4">
        <Animated.View
          entering={FadeInUp.delay(WELCOME_CHOREOGRAPHY.BUTTONS).springify().damping(15)}
          className="gap-4"
        >
          <Button label="Crear cuenta" variant="solid" onPress={() => router.push('/register')} />
          <Button label="Iniciar Sesión" variant="outline" onPress={() => router.push('/login')} />
          <Button
            label="Acceso como Invitado"
            variant="ghost"
            onPress={() => router.push('/(auth)/guest')}
          />

          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-surface-elevated" />
            <Typography variant="caption" color="secondary">
              o
            </Typography>
            <View className="h-px flex-1 bg-surface-elevated" />
          </View>

          <Button
            label="Continuar con Google"
            variant="outline"
            onPress={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            className="border-surface-elevated bg-surface-card"
            leftIcon={<GoogleIcon size={20} />}
          />

          {googleError && (
            <Typography variant="caption" color="danger" className="text-center">
              {googleError}
            </Typography>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(WELCOME_CHOREOGRAPHY.FOOTER).duration(1000)}
          className="mt-8 items-center gap-4"
        >
          <TouchableOpacity onPress={() => setLegalModalVisible(true)} activeOpacity={0.7}>
            <Typography
              variant="caption"
              className="text-center text-sm text-content-secondary underline"
            >
              {AUTH_TEXTS.WELCOME.LEGAL_LINK}
            </Typography>
          </TouchableOpacity>
          <Typography
            variant="caption"
            className="text-center text-xs text-content-tertiary opacity-50"
          >
            {AUTH_TEXTS.WELCOME.VERSION}
          </Typography>
        </Animated.View>
      </View>

      <LegalModal visible={isLegalModalVisible} onClose={() => setLegalModalVisible(false)} />
    </SafeAreaLayout>
  );
};
