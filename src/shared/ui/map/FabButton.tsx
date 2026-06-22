import { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  icon?: string;
  label?: string;
}

export function FabButton({ onPress, icon = 'fire', label = '' }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 200,
    }).start();
  };

  return (
    <View className="flex-row items-center">
      {label ? (
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            opacity: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0],
            }),
          }}
        >
          <View className="mr-3 rounded-lg bg-slate-800/90 px-3 py-2 shadow-lg">
            <Text className="text-sm font-semibold text-white">{label}</Text>
          </View>
        </Animated.View>
      ) : null}
      <View>
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
            position: 'absolute',
            top: -3,
            left: -3,
            width: 62,
            height: 62,
            borderRadius: 31,
            borderWidth: 2,
            borderColor: 'rgba(220, 38, 38, 0.35)',
          }}
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            className="h-14 w-14 items-center justify-center rounded-full bg-[#DC2626] shadow-lg shadow-black/40"
          >
            <MaterialCommunityIcons name={icon as any} size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
