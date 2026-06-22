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
    LEGAL_LINK: 'Términos y Condiciones — Política de Privacidad',
    MODAL_TITLE: 'Términos y Política de Privacidad',
    MODAL_CONTENT:
      'Al continuar, Ud. acepta las siguientes condiciones:\n\n' +
      '1. TRATAMIENTO DE DATOS PERSONALES (Ley N° 19.628)\n' +
      'FocoCero recopila y trata sus datos personales (nombre completo, RUT, teléfono, ubicación georreferenciada y credenciales de acceso) conforme a la Ley N° 19.628 sobre Protección de la Vida Privada. Los datos serán utilizados exclusivamente para:\n' +
      '• Gestión de emergencias y coordinación táctica en incendios.\n' +
      '• Verificación de identidad y control de acceso al sistema.\n' +
      '• Comunicaciones oficiales del Sistema Nacional de Prevención y Respuesta ante Desastres.\n\n' +
      '2. DERECHOS DEL TITULAR (Ley N° 19.628, Arts. 12 y 15)\n' +
      'Ud. podrá ejercer los derechos de información, modificación, cancelación y oposición (IMCO) respecto de sus datos personales, dirigiéndose a contacto@fococero.cl. FocoCero responderá dentro del plazo legal de 15 días hábiles.\n\n' +
      '3. UBICACIÓN Y GEOLOCALIZACIÓN (Ley N° 20.000 y Código Sanitario)\n' +
      'La aplicación accede a su ubicación en tiempo real mientras esté activa. Estos datos se registran para la coordinación en emergencias y se conservan por un plazo máximo de 2 años, salvo requerimiento legal de autoridad competente.\n\n' +
      '4. SEGURIDAD DE LA INFORMACIÓN (Ley N° 19.223)\n' +
      'FocoCero implementa medidas técnicas y organizativas para proteger sus datos contra acceso no autorizado, pérdida o destrucción, conforme a la Ley N° 19.223 sobre Delitos Informáticos. El usuario es responsable de mantener la confidencialidad de su contraseña.\n\n' +
      '5. USO DEL SISTEMA\n' +
      '• El acceso está restringido a brigadistas, personal autorizado y ciudadanos que reporten emergencias.\n' +
      '• Todo reporte debe ser veraz. El envío intencional de información falsa podrá ser denunciado ante la autoridad.\n' +
      '• FocoCero no se hace responsable por daños derivados del mal uso del sistema por parte del usuario.\n\n' +
      '6. VIGENCIA Y JURISDICCIÓN\n' +
      'Estos términos se rigen por la legislación chilena. Cualquier controversia será sometida a los tribunales ordinarios de la comuna de Santiago, Región Metropolitana.\n\n' +
      'Al presionar "Aceptar y Continuar" Ud. declara haber leído, comprendido y aceptado la totalidad de los términos y condiciones aquí expuestos.',
    MODAL_CLOSE_BTN: 'Aceptar y Continuar',

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
