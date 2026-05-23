// src/shared/ui/molecules/BottomSheet.tsx
import { FadeIn, SlideUpCard } from '@shared/ui/animations';
import { Icon, Icons } from '@shared/ui/icons';
import React from 'react';
import { Modal, Pressable, View } from 'react-native';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({ isVisible, onClose, children }: BottomSheetProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none" // Desactivamos la animación nativa, usaremos Reanimated
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Fondo oscuro desenfocado (Overlay) */}
        <FadeIn duration={200} className="absolute inset-0">
          <Pressable className="flex-1 bg-surface-background/80" onPress={onClose} />
        </FadeIn>

        {/* La tarjeta que sube */}
        <SlideUpCard className="w-full rounded-t-3xl bg-surface-card shadow-2xl shadow-black">
          {/* Barrita indicadora de arrastre (Handle) */}
          <View className="w-full items-center pb-2 pt-4">
            <View className="h-1.5 w-12 rounded-full bg-content-tertiary opacity-50" />
          </View>

          {/* Botón de cerrar opcional en la esquina */}
          <View className="absolute right-4 top-4 z-50">
            <Pressable
              onPress={onClose}
              hitSlop={10}
              className="rounded-full bg-surface-background p-2 opacity-70"
            >
              <Icon icon={Icons.X} size="sm" colorTheme="primary" />
            </Pressable>
          </View>

          {/* Contenido (El formulario de Login irá aquí) */}
          <View className="px-6 pb-10 pt-2">{children}</View>
        </SlideUpCard>
      </View>
    </Modal>
  );
};
