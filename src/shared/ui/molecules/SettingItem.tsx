import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Divider } from '@/shared/ui/atoms/Divider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface SettingItemBase {
  icon: IconName;
  label: string;
}

interface SettingItemSwitch extends SettingItemBase {
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface SettingItemNav extends SettingItemBase {
  type: 'nav';
  onPress: () => void;
}

interface SettingItemStatus extends SettingItemBase {
  type: 'status';
  value: string;
}

type SettingItemProps = (SettingItemSwitch | SettingItemNav | SettingItemStatus) & {
  showDivider?: boolean;
};

export function SettingItem(props: SettingItemProps) {
  const { icon, label, type, showDivider } = props;

  return (
    <>
      <TouchableOpacity
        className="min-h-11 flex-row items-center p-3"
        onPress={() => {
          if (type === 'nav' && 'onPress' in props) props.onPress();
        }}
        disabled={type === 'switch'}
        accessibilityLabel={label}
        accessibilityRole={type === 'switch' ? 'switch' : 'button'}
      >
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-lg bg-slate-700">
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={22}
            color="#6B7280"
          />
        </View>
        <Typography variant="body" className="flex-1">
          {label}
        </Typography>
        {type === 'switch' && 'value' in props && (
          <Switch
            value={props.value}
            onValueChange={props.onValueChange}
            trackColor={{ true: '#EF4444' }}
          />
        )}
        {type === 'status' && 'value' in props && (
          <View className="rounded-lg bg-emerald-600 px-3 py-1">
            <Typography variant="caption" className="text-white">
              {props.value}
            </Typography>
          </View>
        )}
        {type === 'nav' && (
          <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
        )}
      </TouchableOpacity>
      {showDivider && <Divider className="my-2" />}
    </>
  );
}
