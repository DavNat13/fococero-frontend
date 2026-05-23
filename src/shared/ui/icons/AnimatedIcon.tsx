// src/shared/ui/icons/AnimatedIcon.tsx
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icon, IconProps } from './Icon';

interface AnimatedIconProps extends IconProps {
  animation: 'spin' | 'pulse' | 'shake' | 'bounce';
  isAnimating?: boolean; // Permite pausar/iniciar la animación
  speedMs?: number;
}

export const AnimatedIcon = ({
  animation,
  isAnimating = true,
  speedMs = 1000,
  ...iconProps
}: AnimatedIconProps) => {
  const transformValue = useSharedValue(0);

  useEffect(() => {
    if (!isAnimating) {
      transformValue.value = withTiming(0);
      return;
    }

    if (animation === 'spin') {
      transformValue.value = withRepeat(
        withTiming(360, { duration: speedMs, easing: Easing.linear }),
        -1,
        false,
      );
    } else if (animation === 'pulse') {
      transformValue.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: speedMs / 2 }),
          withTiming(1, { duration: speedMs / 2 }),
        ),
        -1,
        true,
      );
    } else if (animation === 'bounce') {
      transformValue.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: speedMs / 2, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: speedMs / 2, easing: Easing.bounce }),
        ),
        -1,
        false,
      );
    }
  }, [animation, isAnimating, speedMs, transformValue]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animation) {
      case 'spin':
        return { transform: [{ rotateZ: `${transformValue.value}deg` }] };
      case 'pulse':
        return { transform: [{ scale: transformValue.value }] };
      case 'shake':
        return { transform: [{ translateX: transformValue.value }] };
      case 'bounce':
        return { transform: [{ translateY: transformValue.value }] };
      default:
        return {};
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      <Icon {...iconProps} />
    </Animated.View>
  );
};
