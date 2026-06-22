// src/shared/ui/atoms/Switch.tsx
import { ANIMATION_CONFIGS } from '@shared/constants';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch = ({ value, onValueChange, disabled = false, className = '' }: SwitchProps) => {
  // 0 = apagado, 1 = encendido
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, ANIMATION_CONFIGS.spring.stiff);
  }, [value, progress]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#334155', '#EA580C'], // De gris oscuro a Naranja FocoCero
    );
    return { backgroundColor };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(value ? 24 : 2, ANIMATION_CONFIGS.spring.stiff) }],
    };
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      className={`h-8 w-14 justify-center rounded-full ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {/* Pista del Switch */}
      <Animated.View className="absolute h-full w-full rounded-full" style={trackAnimatedStyle} />
      {/* Círculo (Thumb) */}
      <Animated.View
        className="h-6 w-6 rounded-full bg-white shadow-sm"
        style={thumbAnimatedStyle}
      />
    </Pressable>
  );
};
