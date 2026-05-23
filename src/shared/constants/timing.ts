// src/shared/constants/timing.ts

/**
 * TIMING & DELAYS
 * Tiempos en milisegundos para lógica de negocio, peticiones y retrazos.
 */
export const TIMING = {
  // Peticiones de red
  API_TIMEOUT: 15000,

  // Interacciones de usuario
  DEBOUNCE_SEARCH: 500,
  DOUBLE_TAP_DELAY: 300, // Ventana de tiempo para detectar un doble toque

  // OTP y Seguridad
  OTP_RESEND_COOLDOWN: 60000,
  SESSION_TIMEOUT: 3600000,
} as const;
