// src/widgets/auth/constants/texts.ts

export const AUTH_TEXTS = {
  WELCOME: {
    // Textos exactos solicitados
    TITLE: ' Foco Cero ',
    SUBTITLE: 'Sistema de Alertas Tácticas de Incendios',

    // Botones
    CREATE_ACCOUNT_BTN: 'Crear Cuenta',
    HAVE_ACCOUNT_BTN: 'Tengo una Cuenta',

    // Legal y Modal
    LEGAL_LINK: 'Política de Privacidad - Términos y Condiciones',
    MODAL_TITLE: 'Términos y Condiciones',
    MODAL_CONTENT:
      '1. Uso del Sistema\nEl Sistema Táctico FocoCero es de uso exclusivo para personal autorizado y brigadistas. Toda información registrada es confidencial.\n\n2. Privacidad de Datos\nSu ubicación y reportes serán procesados únicamente para la gestión de emergencias y coordinación táctica en terreno.\n\n3. Responsabilidad\nEl usuario se compromete a emitir reportes veraces y a mantener la seguridad de sus credenciales de acceso.',
    MODAL_CLOSE_BTN: 'Entendido y Cerrar',

    VERSION: 'v2.4.0-build.88 (Stable)',
  },
  LOGIN_FORM: {
    TITLE: 'Identificación Táctica',
    SUBTITLE: 'Ingrese sus credenciales de brigadista para acceder a la red encriptada.',
    RUT_LABEL: 'RUT Institucional',
    RUT_PLACEHOLDER: 'Ej: 12.345.678-9',
    PASSWORD_LABEL: 'Clave de Acceso',
    PASSWORD_PLACEHOLDER: '••••••••',
    SUBMIT_BTN: 'Autenticar',
    SUBMITTING_BTN: 'Verificando credenciales...',
    FORGOT_PASSWORD: '¿Problemas de acceso?',
  },
  GUEST: {
    TITLE: 'Modo Despliegue Rápido',
    WARNING_TEXT:
      'Está ingresando en un modo de emergencia anónimo. Su ubicación y reportes serán registrados temporalmente sin vinculación a un perfil de brigadista.',
    PROCEED_BTN: 'Entendido, Entrar a Terreno',
    CANCEL_BTN: 'Volver al Login',
  },
} as const;
