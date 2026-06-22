// src/shared/ui/layouts/FocusAwareStatusBar.tsx
import React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';

interface FocusAwareStatusBarProps extends StatusBarProps {
  theme?: 'dark' | 'light' | 'auto';
}

export const FocusAwareStatusBar = ({ theme = 'light', ...props }: FocusAwareStatusBarProps) => {
  const barStyle =
    theme === 'light' ? 'light-content' : theme === 'dark' ? 'dark-content' : 'default';

  return (
    <StatusBar barStyle={barStyle} backgroundColor="transparent" translucent={true} {...props} />
  );
};
