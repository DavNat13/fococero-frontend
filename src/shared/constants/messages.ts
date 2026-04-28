// src/shared/constants/messages.ts

/**
 * UI MESSAGES
 * Textos estandarizados para validaciones, errores y feedback.
 */
export const MESSAGES = {
  VALIDATION: {
    REQUIRED: 'Este campo es obligatorio.',
    EMAIL_INVALID: 'Por favor, ingresa un correo electrónico válido.',
    PASSWORD_WEAK: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.',
    RUT_INVALID: 'El RUT ingresado no es válido.',
    PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden.',
  },
  NETWORK: {
    OFFLINE: 'Sin conexión a internet. Verifique su red.',
    TIMEOUT: 'La solicitud tardó demasiado. Reintente.',
    SERVER_ERROR: 'Error en los servidores de FocoCero. Equipo técnico notificado.',
  },
  SUCCESS: {
    LOGIN: 'Acceso autorizado. Bienvenido.',
    REGISTER: 'Cuenta de brigadista creada con éxito.',
    REPORT_SENT: 'Reporte de incidente enviado correctamente.',
  },
  AUTH: {
    GUEST_WARNING:
      'Está ingresando en Modo Emergencia. Sus acciones serán registradas de forma anónima.',
  },
} as const;
