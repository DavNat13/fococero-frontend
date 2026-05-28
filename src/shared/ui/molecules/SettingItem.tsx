import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
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
        style={styles.settingItem}
        onPress={() => {
          if (type === 'nav' && 'onPress' in props) props.onPress();
        }}
        disabled={type === 'switch'}
        accessibilityLabel={label}
        accessibilityRole={type === 'switch' ? 'switch' : 'button'}
      >
        <View style={styles.icon}>
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
          <View style={styles.statusBadge}>
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

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minWidth: 44,
    minHeight: 44,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
