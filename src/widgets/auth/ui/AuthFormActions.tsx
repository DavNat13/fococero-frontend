import { Button } from '@/shared/ui/atoms/Button';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Icon, Icons, GoogleIcon } from '@/shared/ui/icons';
import { FadeIn } from '@/shared/ui/animations/FadeIn';
import React from 'react';
import { Pressable, View } from 'react-native';

interface AuthFormActionsProps {
  mode: 'login' | 'register';
  isLoading?: boolean;
  onSubmit: () => void;
  onGoogleSignIn?: () => void;
  isGoogleLoading?: boolean;
  onNavigateToLogin?: () => void;
}

export const AuthFormActions = ({
  mode,
  isLoading,
  onSubmit,
  onGoogleSignIn,
  isGoogleLoading,
  onNavigateToLogin,
}: AuthFormActionsProps) => (
  <View className="gap-5">
    <FadeIn delay={600}>
      <Button
        label={mode === 'login' ? 'Ingresar a Terreno' : 'Crear Cuenta'}
        variant="solid"
        className="mt-2"
        isLoading={isLoading}
        onPress={onSubmit}
        leftIcon={
          <Icon
            icon={mode === 'login' ? Icons.LogIn : Icons.UserPlus}
            size="sm"
            colorTheme="primary"
          />
        }
      />
    </FadeIn>

    {onGoogleSignIn && (
      <>
        <FadeIn delay={700}>
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-slate-700" />
            <Typography variant="caption" color="secondary">
              o continúa con
            </Typography>
            <View className="h-px flex-1 bg-slate-700" />
          </View>
        </FadeIn>
        <FadeIn delay={800}>
          <Button
            label="Google"
            variant="outline"
            onPress={onGoogleSignIn}
            isLoading={isGoogleLoading}
            className="border-slate-700 bg-slate-800/50"
            leftIcon={<GoogleIcon size={20} />}
          />
        </FadeIn>
      </>
    )}

    {mode === 'register' && onNavigateToLogin && (
      <FadeIn delay={900}>
        <View className="mt-2 items-center">
          <Pressable onPress={onNavigateToLogin}>
            <Typography variant="body" color="secondary">
              ¿Ya tienes cuenta?{' '}
              <Typography variant="body" color="brand" className="font-semibold">
                Inicia Sesión
              </Typography>
            </Typography>
          </Pressable>
        </View>
      </FadeIn>
    )}
  </View>
);
