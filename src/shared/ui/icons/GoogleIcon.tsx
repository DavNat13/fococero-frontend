import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { View } from 'react-native';

interface GoogleIconProps {
  size?: number;
}

export const GoogleIcon = ({ size = 20 }: GoogleIconProps) => (
  <View className="items-center justify-center">
    <FontAwesome5 name="google" size={size} color="#EA580C" />
  </View>
);
