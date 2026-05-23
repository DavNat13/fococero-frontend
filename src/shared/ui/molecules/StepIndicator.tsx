// src/shared/ui/molecules/StepIndicator.tsx
import React from 'react';
import { View } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const StepIndicator = ({ currentStep, totalSteps, className = '' }: StepIndicatorProps) => (
  <View className={`w-full flex-row gap-2 ${className}`}>
    {Array.from({ length: totalSteps }).map((_, i) => {
      const isActive = i < currentStep;
      const isCurrent = i === currentStep - 1;
      return (
        <View
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            isCurrent
              ? 'bg-brand-primary'
              : isActive
                ? 'bg-brand-primary/40'
                : 'bg-surface-elevated'
          }`}
        />
      );
    })}
  </View>
);
