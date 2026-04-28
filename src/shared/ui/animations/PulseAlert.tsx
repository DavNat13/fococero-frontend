// src/shared/ui/animations/PulseAlert.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface PulseAlertProps {
  color?: string; // Color hexadecimal (ej. #EF4444 para rojo)
  size?: number; // Diámetro en píxeles
  className?: string;
}

export const PulseAlert = ({ color = '#EF4444', size = 12, className }: PulseAlertProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    // Animación infinita: Crece hasta 2.5x su tamaño y su opacidad cae a 0
    scale.value = withRepeat(
      withTiming(2.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1, // -1 significa infinito
      false, // No hacer "yoyo" (no volver atrás animado, sino reiniciar de golpe)
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      className={`items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* El punto sólido central */}
      <View
        className="absolute z-10 rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
      {/* El anillo que se expande */}
      <Animated.View
        className="absolute rounded-full"
        style={[animatedStyle, { width: size, height: size, backgroundColor: color }]}
      />
    </View>
  );
};
