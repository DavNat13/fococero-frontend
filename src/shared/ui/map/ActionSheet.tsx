import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View, Text, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface ActionItem {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  actions: ActionItem[];
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_HEIGHT = SCREEN_HEIGHT * 0.5;

export function ActionSheet({ visible, onClose, actions }: Props) {
  const [rendered, setRendered] = useState(visible);
  const translateY = useRef(new Animated.Value(MAX_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 200,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: MAX_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setRendered(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!rendered) return null;

  return (
    <Animated.View className="absolute inset-0 z-50" pointerEvents="box-none">
      <Animated.View className="absolute inset-0 bg-black" style={{ opacity: backdropOpacity }}>
        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />
      </Animated.View>
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-[#1a1d24] pb-6"
        style={{ transform: [{ translateY }], maxHeight: MAX_HEIGHT }}
      >
        <View className="items-center py-3">
          <View className="h-1 w-10 rounded-full bg-gray-500/60" />
        </View>
        <ScrollView bounces={false} className="px-4">
          {actions.map((action, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center border-b border-gray-700/40 py-4"
              onPress={() => {
                action.onPress();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View className="w-8 items-center">
                <MaterialCommunityIcons
                  name={action.icon as any}
                  size={22}
                  color={action.color ?? '#EF4444'}
                />
              </View>
              <Text className="ml-3 text-base font-medium text-white">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}
