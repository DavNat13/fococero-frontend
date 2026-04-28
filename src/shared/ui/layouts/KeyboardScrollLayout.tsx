// src/shared/ui/layouts/KeyboardScrollLayout.tsx
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface KeyboardScrollLayoutProps {
  children: React.ReactNode;
  keyboardOffset?: number;
  bounces?: boolean;
  className?: string;
}

export const KeyboardScrollLayout = ({
  children,
  keyboardOffset = Platform.OS === 'ios' ? 0 : 20,
  bounces = true,
  className = '',
}: KeyboardScrollLayoutProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardOffset}
      className={`flex-1 ${className}`}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={bounces}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Permite presionar botones sin tener que cerrar el teclado primero
        >
          <View className="flex-1">{children}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
