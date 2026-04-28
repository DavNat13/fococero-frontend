// src/shared/ui/layouts/FocusAwareStatusBar.tsx
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';

interface FocusAwareStatusBarProps extends StatusBarProps {
  theme?: 'dark' | 'light' | 'auto';
}

export const FocusAwareStatusBar = ({ theme = 'light', ...props }: FocusAwareStatusBarProps) => {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  // En FocoCero (App táctica oscura por defecto), forzamos texto claro ('light-content')
  // a menos que especifiquemos explícitamente otro.
  const barStyle =
    theme === 'light' ? 'light-content' : theme === 'dark' ? 'dark-content' : 'default';

  return (
    <StatusBar barStyle={barStyle} backgroundColor="transparent" translucent={true} {...props} />
  );
};
