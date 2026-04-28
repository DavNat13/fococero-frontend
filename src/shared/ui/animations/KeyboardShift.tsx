// src/shared/ui/animations/KeyboardShift.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface KeyboardShiftProps {
  children: React.ReactNode;
}

export const KeyboardShift = ({ children }: KeyboardShiftProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
