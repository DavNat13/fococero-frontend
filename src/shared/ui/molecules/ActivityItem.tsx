import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Card } from '@/shared/ui/atoms/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ActivityItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  title: string;
  time: string;
}

export function ActivityItem({ icon, iconColor, title, time }: ActivityItemProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        <View style={styles.content}>
          <Typography variant="body">{title}</Typography>
          <Typography variant="caption" color="secondary">
            {time}
          </Typography>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
});
