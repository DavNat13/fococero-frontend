// src/shared/ui/atoms/Checkbox.tsx
import { ANIMATION_CONFIGS } from '@shared/constants';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Typography } from './Typography';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox = ({ checked, onChange, label, className = '' }: CheckboxProps) => {
  const scale = useSharedValue(checked ? 1 : 0);
  const opacity = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, ANIMATION_CONFIGS.spring.stiff);
    opacity.value = withTiming(checked ? 1 : 0, { duration: 150 });
  }, [checked, scale, opacity]);

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className={`flex-row items-center gap-3 ${className}`}
      hitSlop={10}
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? 'border-[#EA580C] bg-[#EA580C]' : 'border-slate-600 bg-transparent'
        }`}
      >
        <Animated.View style={animatedCheckStyle}>
          <Svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <Path
              d="M1 5L5 9L13 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </View>

      {label && (
        <Typography variant="body" color="primary" className="flex-shrink">
          {label}
        </Typography>
      )}
    </Pressable>
  );
};
