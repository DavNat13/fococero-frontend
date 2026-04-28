// src/shared/constants/animations.ts
import { Easing } from 'react-native-reanimated';

/**
 * ANIMATIONS
 * Perfiles de físicas y tiempos globales para Reanimated.
 * En FocoCero buscamos fluidez "táctica": rápido y preciso, sin rebotes exagerados.
 */
export const ANIMATION_CONFIGS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  easing: {
    outExp: Easing.out(Easing.exp),
    inOutQuad: Easing.inOut(Easing.quad),
  },

  spring: {
    // Táctico y directo: Entra rápido sin casi rebotar (Perfecto para teclados y modales de auth)
    stiff: {
      damping: 20,
      stiffness: 250,
      mass: 1,
      overshootClamping: true,
    },
    // Fluido y natural: Un ligero rebote para elementos orgánicos (notificaciones, tarjetas flotantes)
    smooth: {
      damping: 15,
      stiffness: 120,
      mass: 1,
      overshootClamping: false,
    },
    // Fuerte impacto: Llama la atención inmediatamente (Alertas de incendio, errores críticos)
    bouncy: {
      damping: 10,
      stiffness: 300,
      mass: 1,
      overshootClamping: false,
    },
  },
} as const;
