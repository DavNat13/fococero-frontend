import { SlideUpCard } from '@/shared/ui/animations/SlideUpCard';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';

interface AuthFormWidgetProps {
  mode: 'login' | 'register';
  onSubmit: (data: any) => void;
  onGoogleSignIn?: () => void;
  isGoogleLoading?: boolean;
  isLoading?: boolean;
  error?: string;
  onNavigateToLogin?: () => void;
}

export const AuthFormWidget = ({
  mode,
  onSubmit,
  onGoogleSignIn,
  isGoogleLoading,
  isLoading = false,
  error,
  onNavigateToLogin,
}: AuthFormWidgetProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    rut: '',
    phone: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(mode === 'login' ? { rut: formData.rut, password: formData.password } : formData);
  };

  return (
    <SafeAreaLayout className="bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 40,
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthFormHeader mode={mode} />

          <SlideUpCard>
            <View className="w-full rounded-3xl border border-slate-800/80 bg-surface-card p-6 shadow-2xl">
              <AuthFormFields
                mode={mode}
                formData={formData}
                onChange={handleChange}
                error={error}
              />
              <AuthFormActions
                mode={mode}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onGoogleSignIn={onGoogleSignIn}
                isGoogleLoading={isGoogleLoading}
                onNavigateToLogin={onNavigateToLogin}
              />
            </View>
          </SlideUpCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
};
