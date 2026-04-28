// src/shared/ui/illustrations/OfflineSatellite.tsx
import React, { useEffect } from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const OfflineSatellite = ({
  size = 180,
  className = '',
}: {
  size?: number;
  className?: string;
}) => {
  const floatY = useSharedValue(0);

  useEffect(() => {
    // Efecto de gravedad cero flotando
    floatY.value = withRepeat(withTiming(-10, { duration: 3000 }), -1, true);
  }, [floatY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View className={`items-center justify-center ${className}`} style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        {/* Satélite */}
        <Rect
          x="70"
          y="80"
          width="60"
          height="40"
          rx="8"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="4"
        />
        <Path
          d="M40 90 L70 90 M130 90 L160 90"
          stroke="#475569"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Rect
          x="20"
          y="60"
          width="20"
          height="60"
          rx="2"
          fill="#0F172A"
          stroke="#EA580C"
          strokeWidth="2"
        />
        <Rect
          x="160"
          y="60"
          width="20"
          height="60"
          rx="2"
          fill="#0F172A"
          stroke="#EA580C"
          strokeWidth="2"
        />
        {/* Antena desconectada */}
        <Path d="M100 80 L100 50" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <Circle cx="100" cy="50" r="6" fill="#EF4444" /> {/* Luz roja de error */}
        {/* Ondas cortadas */}
        <Path
          d="M85 30 Q100 15 115 30"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <Path
          d="M75 15 Q100 -5 125 15"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </Svg>
    </Animated.View>
  );
};
