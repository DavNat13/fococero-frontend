// src/widgets/auth/ui/WelcomeWidget.tsx
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { Button, Icon, Icons, SafeAreaLayout, Typography } from '@shared/ui';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { AUTH_TEXTS } from '../constants';
import { WELCOME_CHOREOGRAPHY } from '../lib';

interface WelcomeWidgetProps {
  onCreateAccountPress?: () => void;
  onHaveAccountPress?: () => void;
}

export const WelcomeWidget = ({ onCreateAccountPress, onHaveAccountPress }: WelcomeWidgetProps) => {
  const [isLegalModalVisible, setLegalModalVisible] = useState(false);
  const { signIn: signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

  const handleLoginPress = () => {
    if (onHaveAccountPress) {
      onHaveAccountPress();
    } else {
      router.push('/login');
    }
  };

  const handleCreateAccountPress = () => {
    if (onCreateAccountPress) {
      onCreateAccountPress();
    } else {
      router.push('/register');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (error) {
      console.error('Error en Google Sign In:', error);
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
          <Button label="Crear cuenta" variant="solid" onPress={handleCreateAccountPress} />

          <Button label="Iniciar Sesión" variant="outline" onPress={handleLoginPress} />

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
          />
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isLegalModalVisible}
        onRequestClose={() => setLegalModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="h-2/3 w-full rounded-t-3xl bg-surface-card p-6 shadow-xl">
            <View className="mb-6 flex-row items-center justify-between border-b border-surface-elevated pb-4">
              <Typography variant="h3" className="text-xl font-bold text-content-primary">
                {AUTH_TEXTS.WELCOME.MODAL_TITLE}
              </Typography>
              <TouchableOpacity onPress={() => setLegalModalVisible(false)} className="p-2">
                <Icon icon={Icons.X} size="sm" colorTheme="surface" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-6 flex-1" showsVerticalScrollIndicator={false}>
              <Typography variant="body" className="leading-relaxed text-content-secondary">
                {AUTH_TEXTS.WELCOME.MODAL_CONTENT}
              </Typography>
            </ScrollView>

            <Button
              label={AUTH_TEXTS.WELCOME.MODAL_CLOSE_BTN}
              variant="solid"
              onPress={() => setLegalModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaLayout>
  );
};
