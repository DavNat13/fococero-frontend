import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/ui/atoms/Typography';

interface Props {
  message: string;
  type: 'error' | 'warning' | 'permission';
  topOffset?: number;
}

const ICONS: Record<Props['type'], keyof typeof MaterialCommunityIcons.glyphMap> = {
  error: 'alert-circle-outline',
  warning: 'alert-circle-outline',
  permission: 'map-marker-off',
};

const COLORS: Record<Props['type'], string> = {
  error: 'bg-amber-600/90',
  warning: 'bg-amber-600/90',
  permission: 'bg-red-600/90',
};

export function MapBanner({ message, type, topOffset }: Props) {
  return (
    <View
      className={`absolute left-4 right-4 flex-row items-center rounded-xl ${COLORS[type]} p-3`}
      style={topOffset ? { top: topOffset } : undefined}
    >
      <MaterialCommunityIcons name={ICONS[type]} size={20} color="white" />
      <Typography variant="body" className="ml-2 flex-1 text-white">
        {message}
      </Typography>
    </View>
  );
}
