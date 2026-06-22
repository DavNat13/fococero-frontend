import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';

interface Props {
  title: string;
  description: string;
  className?: string;
  statusLabel?: string;
  statusColor?: string;
}

export function CalloutContent({
  title,
  description,
  className = '',
  statusLabel,
  statusColor,
}: Props) {
  return (
    <View className={`min-w-[160px] rounded-xl bg-slate-800 p-3 shadow-lg ${className}`}>
      <Typography variant="h3" className="mb-1 text-white">
        {title}
      </Typography>
      <Typography variant="caption" className="text-gray-400" numberOfLines={3}>
        {description}
      </Typography>
      {statusLabel && (
        <View className="mt-2 flex-row items-center">
          {statusColor && <View className={`mr-2 h-2 w-2 rounded-full ${statusColor}`} />}
          <Typography variant="caption" className="text-gray-400">
            {statusLabel}
          </Typography>
        </View>
      )}
    </View>
  );
}
