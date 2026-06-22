import { ANIMATION_CONFIGS } from '../animations';
import { MESSAGES } from '../messages';
import { METRICS } from '../metrics';
import { REGEX } from '../regex';
import { TIMING } from '../timing';
import { Z_INDEX } from '../z-index';

describe('ANIMATION_CONFIGS (configuración de animaciones)', () => {
  it('tiene duraciones definidas', () => {
    expect(ANIMATION_CONFIGS.duration.fast).toBe(150);
    expect(ANIMATION_CONFIGS.duration.normal).toBe(300);
    expect(ANIMATION_CONFIGS.duration.slow).toBe(500);
  });

  it('tiene perfiles de spring', () => {
    expect(ANIMATION_CONFIGS.spring.stiff.damping).toBe(20);
    expect(ANIMATION_CONFIGS.spring.smooth.stiffness).toBe(120);
    expect(ANIMATION_CONFIGS.spring.bouncy.overshootClamping).toBe(false);
  });

  it('tiene easings definidos', () => {
    expect(ANIMATION_CONFIGS.easing.outExp).toBeDefined();
    expect(ANIMATION_CONFIGS.easing.inOutQuad).toBeDefined();
  });
});

describe('MESSAGES (mensajes de UI)', () => {
  it('tiene mensajes de validación', () => {
    expect(MESSAGES.VALIDATION.REQUIRED).toBe('Este campo es obligatorio.');
    expect(MESSAGES.VALIDATION.RUT_INVALID).toContain('RUT');
  });

  it('tiene mensajes de red', () => {
    expect(MESSAGES.NETWORK.OFFLINE).toContain('conexión');
    expect(MESSAGES.NETWORK.TIMEOUT).toContain('tardó');
  });

  it('tiene mensajes de éxito', () => {
    expect(MESSAGES.SUCCESS.LOGIN).toContain('Bienvenido');
    expect(MESSAGES.SUCCESS.REGISTER).toContain('creada');
  });

  it('tiene mensajes de autenticación', () => {
    expect(MESSAGES.AUTH.GUEST_WARNING).toContain('Modo Emergencia');
  });
});

describe('METRICS (métricas de layout)', () => {
  it('tiene screenWidth y screenHeight', () => {
    expect(typeof METRICS.screenWidth).toBe('number');
    expect(typeof METRICS.screenHeight).toBe('number');
  });

  it('tiene touchableMinHeight para accesibilidad', () => {
    expect(METRICS.touchableMinHeight).toBeGreaterThanOrEqual(44);
  });

  it('tiene espaciados definidos', () => {
    expect(METRICS.spacing.md).toBe(16);
    expect(METRICS.spacing.xl).toBe(32);
  });

  it('tiene alturas de componentes', () => {
    expect(METRICS.component.buttonHeight).toBe(56);
    expect(METRICS.component.inputHeight).toBe(56);
  });

  it('tiene radios de borde', () => {
    expect(METRICS.radius.md).toBe(8);
    expect(METRICS.radius.pill).toBe(9999);
  });
});

describe('REGEX (expresiones regulares)', () => {
  it('EMAIL valida correos correctamente', () => {
    expect(REGEX.EMAIL.test('test@example.com')).toBe(true);
    expect(REGEX.EMAIL.test('invalid')).toBe(false);
  });

  it('PASSWORD_STRONG valida contraseña fuerte', () => {
    expect(REGEX.PASSWORD_STRONG.test('Abcdef1!')).toBe(true);
    expect(REGEX.PASSWORD_STRONG.test('weak')).toBe(false);
  });

  it('RUT_CHILENO valida RUT chileno', () => {
    expect(REGEX.RUT_CHILENO.test('12345678-9')).toBe(true);
    expect(REGEX.RUT_CHILENO.test('12.345.678-9')).toBe(true);
  });

  it('PHONE_CHILE valida teléfonos chilenos', () => {
    expect(REGEX.PHONE_CHILE.test('+56987654321')).toBe(true);
    expect(REGEX.PHONE_CHILE.test('987654321')).toBe(true);
  });

  it('ONLY_LETTERS valida solo letras', () => {
    expect(REGEX.ONLY_LETTERS.test('Juan Pérez')).toBe(true);
    expect(REGEX.ONLY_LETTERS.test('123')).toBe(false);
  });
});

describe('TIMING (tiempos de espera)', () => {
  it('tiene API_TIMEOUT de 15 segundos', () => {
    expect(TIMING.API_TIMEOUT).toBe(15000);
  });

  it('tiene DEBOUNCE_SEARCH de 500ms', () => {
    expect(TIMING.DEBOUNCE_SEARCH).toBe(500);
  });

  it('tiene OTP_RESEND_COOLDOWN de 60 segundos', () => {
    expect(TIMING.OTP_RESEND_COOLDOWN).toBe(60000);
  });
});

describe('Z_INDEX (índices de superposición)', () => {
  it('tiene valores jerárquicos correctos', () => {
    expect(Z_INDEX.BASE).toBe(0);
    expect(Z_INDEX.MODAL).toBe(400);
    expect(Z_INDEX.TOAST).toBe(500);
    expect(Z_INDEX.SPLASH_SCREEN).toBe(1000);
    expect(Z_INDEX.SPLASH_SCREEN).toBeGreaterThan(Z_INDEX.TOAST);
  });
});
