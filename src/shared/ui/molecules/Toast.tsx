// src/shared/ui/molecules/Toast.tsx
import { ColorTheme } from '@shared/types';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Typography } from '../atoms/Typography';
import { Icon, Icons } from '../icons';

interface ToastProps {
  message: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  isVisible: boolean;
  onHide: () => void;
  duration?: number; // Tiempo en ms antes de desaparecer
}

export const Toast = ({
  message,
  type = 'info',
  isVisible,
  onHide,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  if (!isVisible) return null;

  const typeConfig: Record<string, { icon: any; color: ColorTheme; bg: string }> = {
    success: {
      icon: Icons.CheckCircle2,
      color: 'success',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    danger: { icon: Icons.AlertTriangle, color: 'danger', bg: 'bg-red-500/10 border-red-500/30' },
    warning: {
      icon: Icons.AlertOctagon,
      color: 'warning',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
    info: { icon: Icons.Bell, color: 'brand', bg: 'bg-slate-800 border-slate-700' },
  };

  const current = typeConfig[type];

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOutUp}
      className="absolute left-4 right-4 top-12 z-[1000] items-center"
    >
      <View
        className={`flex-row items-center rounded-2xl border px-4 py-3 ${current.bg} shadow-lg shadow-black/50 backdrop-blur-md`}
      >
        <Icon icon={current.icon} size="md" colorTheme={current.color} />
        <Typography variant="h3" color="primary" className="ml-3 flex-1">
          {message}
        </Typography>
      </View>
    </Animated.View>
  );
};
