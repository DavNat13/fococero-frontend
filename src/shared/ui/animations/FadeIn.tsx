// src/shared/ui/animations/FadeIn.tsx
import React from 'react';
import Animated, { FadeIn as ReanimatedFadeIn, FadeOut } from 'react-native-reanimated';
import { ANIMATION_CONFIGS } from '@shared/constants';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = ANIMATION_CONFIGS.duration.normal,
  className,
}: FadeInProps) => {
  return (
    <Animated.View
      entering={ReanimatedFadeIn.delay(delay).duration(duration)}
      exiting={FadeOut.duration(duration)}
      className={className}
    >
      {children}
    </Animated.View>
  );
};
