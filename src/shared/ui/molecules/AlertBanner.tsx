// src/shared/ui/molecules/AlertBanner.tsx
import { ColorTheme } from '@shared/types';
import { FadeIn, Icon, Icons, Typography } from '@shared/ui';
import React from 'react';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'danger' | 'info';
  onPress?: () => void;
}

export const AlertBanner = ({ message, type = 'warning', onPress }: AlertBannerProps) => {
  const configs: Record<string, { color: ColorTheme; bg: string; icon: any }> = {
    warning: { color: 'warning', bg: 'bg-amber-500/10', icon: Icons.AlertTriangle },
    danger: { color: 'danger', bg: 'bg-red-500/10', icon: Icons.AlertOctagon },
    info: { color: 'brand', bg: 'bg-slate-800', icon: Icons.Bell },
  };

  const config = configs[type];

  return (
    <FadeIn
      className={`w-full flex-row items-center rounded-2xl border p-4 border-${config.color}/20 ${config.bg}`}
    >
      <Icon icon={config.icon} size="sm" colorTheme={config.color} />
      <Typography variant="label" className="ml-3 flex-1" color="primary">
        {message}
      </Typography>
      {onPress && <Icon icon={Icons.ChevronRight} size="xs" colorTheme="secondary" />}
    </FadeIn>
  );
};
