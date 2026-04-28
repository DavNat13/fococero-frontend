// src/shared/ui/animations/SkeletonShimmer.tsx
import React, { useEffect } from 'react';
import { DimensionValue } from 'react-native'; // 1. Importamos el tipo estricto de dimensiones
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonShimmerProps {
  width?: DimensionValue; // 2. Reemplazamos 'number | string' por DimensionValue
  height?: DimensionValue; // 2. Reemplazamos 'number | string' por DimensionValue
  borderRadius?: number;
  className?: string;
}

export const SkeletonShimmer = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className,
}: SkeletonShimmerProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    // Pulso suave continuo (efecto de respiración)
    opacity.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 800 }), withTiming(0.3, { duration: 800 })),
      -1, // Infinito
      true, // Yoyo: Va y viene fluidamente
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={`overflow-hidden bg-content-tertiary ${className}`}
      style={[animatedStyle, { width, height, borderRadius }]}
    />
  );
};
