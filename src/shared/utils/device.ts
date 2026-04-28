// src/shared/utils/device.ts
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const device = {
  width,
  height,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isSmallDevice: width < 375,
  isTablet: width >= 768,
  hasNotch: Platform.OS === 'ios' && (height >= 812 || width >= 812),
};
