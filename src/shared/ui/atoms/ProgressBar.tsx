// src/shared/ui/atoms/ProgressBar.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ColorTheme } from '@shared/types';
import { ANIMATION_CONFIGS } from '@shared/constants';

interface ProgressBarProps {
  progress: number; // 0 a 100
  colorTheme?: ColorTheme;
  className?: string;
  height?: number;
}

export const ProgressBar = ({
  progress,
  colorTheme = 'brand',
  className = '',
  height = 8,
}: ProgressBarProps) => {
  const animatedProgress = useSharedValue(0);

  const colors: Record<ColorTheme, string> = {
    brand: 'bg-[#EA580C]',
    primary: 'bg-slate-100',
    secondary: 'bg-slate-400',
    danger: 'bg-red-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    tertiary: 'bg-slate-600',
    surface: 'bg-slate-800',
    background: 'bg-slate-950',
  };

  useEffect(() => {
    // Limitamos entre 0 y 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    animatedProgress.value = withSpring(clampedProgress, ANIMATION_CONFIGS.spring.smooth);
  }, [progress, animatedProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  return (
    <View
      className={`w-full overflow-hidden rounded-full bg-slate-800 ${className}`}
      style={{ height }}
    >
      <Animated.View
        className={`h-full ${colors[colorTheme]} rounded-full`}
        style={animatedStyle}
      />
    </View>
  );
};
