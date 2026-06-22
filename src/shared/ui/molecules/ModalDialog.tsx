// src/shared/ui/molecules/ModalDialog.tsx
import { Z_INDEX } from '@shared/constants';
import { Button } from '@shared/ui/atoms/Button';
import { FadeIn } from '@shared/ui/animations/FadeIn';
import { Typography } from '@shared/ui/atoms/Typography';
import React from 'react';
import { Modal, View } from 'react-native';

interface ModalDialogProps {
  visible: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'info' | 'warning';
}

export const ModalDialog = ({
  visible,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  type = 'info',
}: ModalDialogProps) => (
  <Modal visible={visible} transparent animationType="none">
    <View
      className="flex-1 items-center justify-center bg-slate-950/80 px-6"
      style={{ zIndex: Z_INDEX.MODAL }}
    >
      <FadeIn
        duration={300}
        className="w-full rounded-3xl border border-surface-elevated bg-surface-card p-6 shadow-2xl"
      >
        <Typography variant="h2" className="mb-2 text-center">
          {title}
        </Typography>
        <Typography variant="body" color="secondary" className="mb-8 text-center">
          {description}
        </Typography>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button label={cancelLabel} variant="ghost" onPress={onCancel} />
          </View>
          <View className="flex-1">
            <Button
              label={confirmLabel}
              variant={type === 'danger' ? 'danger' : 'solid'}
              onPress={onConfirm}
            />
          </View>
        </View>
      </FadeIn>
    </View>
  </Modal>
);
