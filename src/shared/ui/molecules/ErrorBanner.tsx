import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  return (
    <View className="mx-4 flex-row items-center rounded-xl border border-red-500/20 bg-red-500/10 p-4">
      <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
      <Typography variant="body" className="ml-3 flex-1 text-red-500">
        {message}
      </Typography>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          accessibilityLabel="Reintentar"
          accessibilityRole="button"
        >
          <Typography variant="body" className="font-semibold text-red-500">
            Reintentar
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};
