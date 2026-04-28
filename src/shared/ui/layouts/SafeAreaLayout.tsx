// src/shared/ui/layouts/SafeAreaLayout.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { FocusAwareStatusBar } from './FocusAwareStatusBar';

export interface SafeAreaLayoutProps extends ViewProps {
  children: React.ReactNode;
  edges?: Edge[];
  variant?: 'background' | 'card' | 'transparent';
  centered?: boolean;
}

export const SafeAreaLayout = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  variant = 'background',
  centered = false,
  className = '',
  ...props
}: SafeAreaLayoutProps) => {
  const bgColors = {
    background: 'bg-surface-background', // #020617 (En dark)
    card: 'bg-surface-card', // #0F172A (En dark)
    transparent: 'bg-transparent',
  };

  const layoutClasses = centered ? 'items-center justify-center' : '';

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 ${bgColors[variant]} ${layoutClasses} ${className}`}
      {...props}
    >
      <FocusAwareStatusBar />
      <View className="h-full w-full flex-1">{children}</View>
    </SafeAreaView>
  );
};
