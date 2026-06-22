import { View } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';

interface Props {
  title: string;
  subtitle: string;
  className?: string;
}

export function MapHeader({ title, subtitle, className = '' }: Props) {
  return (
    <View
      className={`absolute left-0 right-0 top-0 rounded-b-2xl bg-[#0C0F17]/90 p-4 pt-14 ${className}`}
    >
      <Typography variant="h2" className="text-white">
        {title}
      </Typography>
      <Typography variant="body" className="mt-1 text-gray-400">
        {subtitle}
      </Typography>
    </View>
  );
}
