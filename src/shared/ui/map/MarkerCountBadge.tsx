import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

interface Props {
  count: number;
}

export function MarkerCountBadge({ count }: Props) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <Animated.View
      className="absolute bottom-4 left-4 rounded-full bg-slate-900/70 px-3 py-1.5"
      style={{ opacity: fadeAnim }}
    >
      <Text className="text-xs text-gray-200">{count} marcadores visibles</Text>
    </Animated.View>
  );
}
