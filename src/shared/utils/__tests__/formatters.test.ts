import { formatRUT, formatPhone, capitalize, formatearFecha } from '../formatters';

describe('formatRUT (formateo de RUT)', () => {
  it('formatea un RUT estándar', () => {
    expect(formatRUT('123456789')).toBe('12.345.678-9');
  });

  it('maneja K como dígito verificador', () => {
    expect(formatRUT('12345678K')).toBe('12.345.678-K');
  });

  it('maneja k minúscula como dígito verificador', () => {
    expect(formatRUT('12345678k')).toBe('12.345.678-K');
  });

  it('elimina puntos y guión de la entrada', () => {
    expect(formatRUT('12.345.678-9')).toBe('12.345.678-9');
  });

  it('retorna vacío para entrada vacía', () => {
    expect(formatRUT('')).toBe('');
  });

  it('retorna vacío para solo caracteres no numéricos', () => {
    expect(formatRUT('abc')).toBe('');
  });
});

describe('formatPhone (formateo de teléfono)', () => {
  it('formatea un número móvil chileno de 9 dígitos', () => {
    expect(formatPhone('912345678')).toBe('+56 9 1234 5678');
  });

  it('elimina caracteres no numéricos', () => {
    expect(formatPhone('+56 9 1234 5678')).toBe('+56 9 1234 5678');
  });

  it('retorna teléfono sin formato si no tiene 9 dígitos', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('capitalize (capitalización)', () => {
  it('capitaliza la primera letra de cada palabra ASCII', () => {
    expect(capitalize('juan perez')).toBe('Juan Perez');
  });

  it('maneja una sola palabra', () => {
    expect(capitalize('brigadista')).toBe('Brigadista');
  });

  it('maneja texto ya capitalizado', () => {
    expect(capitalize('Juan Perez')).toBe('Juan Perez');
  });

  it('maneja cadena vacía', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('formatearFecha (formateo de fecha)', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('formatea fecha ISO a locale chileno', () => {
    const result = formatearFecha('2025-01-14T15:30:00.000Z');
    expect(result).toMatch(/14/i);
  });

  it('retorna string de fecha inválida para fecha inválida', () => {
    const result = formatearFecha('not-a-date');
    expect(result).toMatch(/invalid/i);
  });
});
