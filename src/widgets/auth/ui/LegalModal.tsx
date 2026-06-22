import { Button, Icon, Icons, Typography } from '@shared/ui';
import React from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { AUTH_TEXTS } from '../constants';

interface LegalModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LegalModal = ({ visible, onClose }: LegalModalProps) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/60">
      <View className="h-2/3 w-full rounded-t-3xl bg-surface-card p-6 shadow-xl">
        <View className="mb-6 flex-row items-center justify-between border-b border-surface-elevated pb-4">
          <Typography variant="h3" className="text-xl font-bold text-content-primary">
            {AUTH_TEXTS.WELCOME.MODAL_TITLE}
          </Typography>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Icon icon={Icons.X} size="sm" colorTheme="surface" />
          </TouchableOpacity>
        </View>
        <ScrollView className="mb-6 flex-1" showsVerticalScrollIndicator={false}>
          <Typography variant="body" className="leading-relaxed text-content-secondary">
            {AUTH_TEXTS.WELCOME.MODAL_CONTENT}
          </Typography>
        </ScrollView>
        <Button label={AUTH_TEXTS.WELCOME.MODAL_CLOSE_BTN} variant="solid" onPress={onClose} />
      </View>
    </View>
  </Modal>
);
