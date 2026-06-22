// src/shared/ui/molecules/SearchBar.tsx
import { Icon } from '@shared/ui/icons/Icon';
import { IconButton } from '@shared/ui/atoms/IconButton';
import { Icons } from '@shared/ui/icons';
import { Input } from '@shared/ui/atoms/Input';
import React from 'react';
import { View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Buscar...',
}: SearchBarProps) => (
  <View className="w-full flex-row items-center gap-2">
    <View className="flex-1">
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={<Icon icon={Icons.Search} size="sm" colorTheme="secondary" />}
      />
    </View>
    {onFilterPress && (
      <IconButton
        icon={<Icon icon={Icons.Filter} size="md" colorTheme="primary" />}
        onPress={onFilterPress}
        variant="surface"
      />
    )}
  </View>
);
