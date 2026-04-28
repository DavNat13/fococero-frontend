// src/widgets/auth/lib/auth-animations.ts

/**
 * Coreografía de entrada para el WelcomeWidget.
 * Define los retrasos (delays) en milisegundos para que los elementos
 * aparezcan en cascada, dándole un look cinematográfico y fluido.
 */
export const WELCOME_CHOREOGRAPHY = {
  LOGO: 200, // El logo aparece casi de inmediato
  TITLE: 400, // El título "FocoCero" un poco después
  SUBTITLE: 600, // El subtítulo táctico
  BUTTONS: 800, // Los botones de acción principal
  FOOTER: 1000, // La versión de la app abajo
} as const;
