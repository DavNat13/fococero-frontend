// src/shared/ui/animations/ShakeError.tsx
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ShakeErrorProps {
  children: React.ReactNode;
  trigger: boolean | number; // Cambiar este valor dispara la animación
  className?: string;
}

export const ShakeError = ({ children, trigger, className }: ShakeErrorProps) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (trigger) {
      // Secuencia de temblor rápida: Izquierda, Derecha, Izquierda, Centro
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withSpring(0, { damping: 10, stiffness: 500 }), // Vuelve al centro con fricción
      );
    }
  }, [trigger, translateX]);

  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
};
