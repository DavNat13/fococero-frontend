// src/shared/constants/z-index.ts

/**
 * Z-INDEX SCALE
 * Sistema de capas para asegurar que los modales, alertas y menús
 * nunca queden tapados por otros componentes.
 */
export const Z_INDEX = {
  BASE: 0,
  CONTENT: 10,
  NAVBAR: 50,
  DROPDOWN: 100,
  FLOATING_BUTTON: 200, // Botones flotantes (ej. "Reportar Incendio")
  BOTTOM_SHEET: 300, // Formularios deslizables (AuthFormWidget)
  MODAL: 400, // Modales de confirmación en el centro
  TOAST: 500, // Notificaciones de éxito/error arriba
  SPLASH_SCREEN: 1000, // Pantallas de bloqueo absolutas
} as const;
