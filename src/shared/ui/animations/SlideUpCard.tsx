// src/shared/ui/animations/SlideUpCard.tsx
import { ANIMATION_CONFIGS } from '@shared/constants';
import React from 'react';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface SlideUpCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SlideUpCard = ({ children, className }: SlideUpCardProps) => {
  return (
    <Animated.View
      // Usamos .springify() para aplicar nuestras constantes de METRICS/ANIMATIONS
      entering={SlideInDown.springify()
        .damping(ANIMATION_CONFIGS.spring.stiff.damping)
        .stiffness(ANIMATION_CONFIGS.spring.stiff.stiffness)}
      exiting={SlideOutDown}
      className={className}
    >
      {children}
    </Animated.View>
  );
};
