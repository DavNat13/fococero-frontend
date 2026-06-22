import { useRef, useCallback } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  onRefresh: () => void;
  isRefreshing?: boolean;
  top?: number;
}

export function RefreshButton({ onRefresh, isRefreshing, top }: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  const handlePress = useCallback(() => {
    onRefresh();
    if (isRefreshing) return;
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => spinAnim.setValue(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh, isRefreshing]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="absolute right-4 z-50" style={{ top: top ?? 16 }}>
      <TouchableOpacity
        className="h-10 w-10 items-center justify-center rounded-full bg-slate-800/90 shadow-lg"
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialCommunityIcons
            name="refresh"
            size={20}
            color={isRefreshing ? '#9CA3AF' : '#EA580C'}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
