// src/shared/constants/regex.ts

/**
 * REGEX
 * Patrones de validación globales.
 */
export const REGEX = {
  // Correo electrónico estándar
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

  // Contraseña fuerte: Mínimo 8 caracteres, al menos 1 letra mayúscula y 1 número
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,

  // RUT Chileno: Formato estricto con o sin puntos/guión (ej: 12.345.678-9 o 123456789)
  RUT_CHILENO: /^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/i,

  // Teléfono móvil chileno: +569 seguido de 8 dígitos
  PHONE_CHILE: /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/,

  // Solo letras y espacios (Ideal para nombres de brigadistas)
  ONLY_LETTERS: /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
} as const;
