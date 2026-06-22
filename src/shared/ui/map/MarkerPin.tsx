import { View } from 'react-native';

interface Props {
  color: string;
  size?: number;
  borderColor?: string;
}

export function MarkerPin({ color, size = 16, borderColor = 'white' }: Props) {
  return (
    <View
      className="rounded-full border-2"
      style={{ width: size, height: size, backgroundColor: color, borderColor }}
    />
  );
}
