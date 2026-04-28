// src/shared/constants/metrics.ts
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * METRICS
 * Sistema centralizado de medidas para mantener consistencia visual y táctil.
 * Basado en múltiplos de 4 y 8 (Estándar de Tailwind/NativeWind).
 */
export const METRICS = {
  screenWidth: width,
  screenHeight: height,

  // Áreas táctiles (Accesibilidad: Mínimo 44x44px según Apple/Google HIG)
  // Útil para brigadistas operando bajo estrés o con guantes.
  touchableMinHeight: 44,
  touchableHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },

  // Espaciados base (Paddings y Margins)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Tamaños de componentes estándar
  component: {
    buttonHeight: 56,
    inputHeight: 56,
    headerHeight: Platform.OS === 'ios' ? 44 : 56,
    bottomNavigationHeight: 65,
  },

  // Radios de borde (Border Radius)
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 9999,
  },
} as const;
