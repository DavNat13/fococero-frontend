// src/shared/ui/animations/ScalePress.tsx
import React from 'react';
import { Pressable, GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ANIMATION_CONFIGS } from '@shared/constants';

interface ScalePressProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  scaleTo?: number;
  className?: string;
}

export const ScalePress = ({ children, onPress, scaleTo = 0.96, className }: ScalePressProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleTo, ANIMATION_CONFIGS.spring.stiff);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION_CONFIGS.spring.stiff);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={className}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
};
