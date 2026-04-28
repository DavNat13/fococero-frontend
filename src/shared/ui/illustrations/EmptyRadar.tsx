// src/shared/ui/illustrations/EmptyRadar.tsx
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

export const EmptyRadar = ({
  size = 200,
  className = '',
}: {
  size?: number;
  className?: string;
}) => {
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.95 + pulse.value * 0.05 }], // Ligero zoom in/out
  }));

  return (
    <Animated.View className={`items-center justify-center ${className}`} style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        {/* Círculos del radar (Gris terciario) */}
        <Circle
          cx="100"
          cy="100"
          r="80"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="4 8"
          opacity="0.3"
        />
        <Circle cx="100" cy="100" r="50" stroke="#475569" strokeWidth="2" opacity="0.5" />
        <Circle cx="100" cy="100" r="20" fill="#EA580C" opacity="0.2" />
        <Circle cx="100" cy="100" r="8" fill="#EA580C" />

        {/* Línea de barrido */}
        <Path
          d="M100 100 L160 40"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </Svg>
    </Animated.View>
  );
};
