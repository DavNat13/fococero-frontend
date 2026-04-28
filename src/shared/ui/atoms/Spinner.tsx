// src/shared/ui/atoms/Spinner.tsx
import { ColorTheme } from '@shared/types';
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SpinnerProps {
  size?: number;
  colorTheme?: ColorTheme;
  className?: string;
}

export const Spinner = ({ size = 24, colorTheme = 'brand', className = '' }: SpinnerProps) => {
  const rotation = useSharedValue(0);

  const colors: Record<ColorTheme, string> = {
    brand: '#EA580C',
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    tertiary: '#64748B',
    surface: '#0F172A',
    background: '#020617',
  };

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1, // Infinito
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 8,
          borderColor: `${colors[colorTheme]}40`, // 40 es la opacidad en hex
          borderTopColor: colors[colorTheme],
        },
      ]}
      className={className}
    />
  );
};
