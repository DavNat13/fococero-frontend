import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  isLocating?: boolean;
  accuracy?: number;
  className?: string;
}

export function GpsButton({ onPress, isLocating = false, accuracy, className = '' }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLocating) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
      );
      const rotateLoop = Animated.loop(
        Animated.timing(rotateAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      );
      pulseLoop.start();
      rotateLoop.start();
      return () => {
        pulseLoop.stop();
        rotateLoop.stop();
      };
    }
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocating]);

  const color = isLocating ? '#3B82F6' : accuracy !== undefined ? '#10B981' : '#6B7280';
  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      className={`rounded-full bg-slate-800/95 p-3 shadow-lg ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Centrar en mi ubicación"
      accessibilityRole="button"
    >
      {isLocating && (
        <Animated.View
          className="absolute -inset-1 rounded-full border-2 border-blue-500"
          style={{ opacity: pulseAnim }}
        />
      )}
      <View className="flex-row items-center gap-1.5">
        <Animated.View
          style={isLocating ? { transform: [{ rotate: rotateInterpolation }] } : undefined}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color={color} />
        </Animated.View>
        {accuracy !== undefined && (
          <Text className="text-xs text-gray-300">±{Math.round(accuracy)}m</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
