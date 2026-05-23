import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export const useWaveAnimation = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Fade in inicial
    opacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) });

    // Efecto de flotación orgánica infinita
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
        withTiming(20, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle };
};
