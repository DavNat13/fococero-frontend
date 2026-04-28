// src/shared/ui/illustrations/CloudSyncSuccess.tsx
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

export const CloudSyncSuccess = ({
  size = 160,
  className = '',
}: {
  size?: number;
  className?: string;
}) => {
  const scale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    // La nube aparece rápido
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) });
    // El checkmark aparece con un pequeño retraso
    checkScale.value = withDelay(
      400,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.back(2)) }),
    );
  }, [scale, checkScale]);

  const cloudStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));

  return (
    <Animated.View
      className={`relative items-center justify-center ${className}`}
      style={cloudStyle}
    >
      <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        {/* Nube FocoCero */}
        <Path
          d="M60 130 C40 130 30 115 30 100 C30 80 50 70 65 75 C75 50 110 40 130 60 C155 55 170 75 170 95 C170 115 155 130 135 130 Z"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="4"
        />
        {/* Flechas de subida difuminadas en el fondo */}
        <Path
          d="M70 150 L70 100 M60 110 L70 100 L80 110"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <Path
          d="M130 160 L130 110 M120 120 L130 110 L140 120"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
      </Svg>

      {/* Checkmark animado sobrepuesto */}
      <Animated.View className="absolute" style={checkStyle}>
        <Svg width={size * 0.4} height={size * 0.4} viewBox="0 0 50 50" fill="none">
          <Circle cx="25" cy="25" r="20" fill="#10B981" /> {/* Verde Success */}
          <Path
            d="M15 25 L22 32 L35 17"
            stroke="#020617"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};
