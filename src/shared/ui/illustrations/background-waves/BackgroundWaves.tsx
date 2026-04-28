import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg from 'react-native-svg';

import { useWaveAnimation } from './useWaveAnimation';
import { WaveGradients } from './WaveGradients';
import { WaveShapes } from './WaveShapes';

interface BackgroundWavesProps {
  className?: string;
}

export const BackgroundWaves = ({ className = '' }: BackgroundWavesProps) => {
  const { animatedStyle } = useWaveAnimation();

  return (
    <View style={StyleSheet.absoluteFill} className={className} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <WaveGradients />
          <WaveShapes />
        </Svg>
      </Animated.View>
    </View>
  );
};
