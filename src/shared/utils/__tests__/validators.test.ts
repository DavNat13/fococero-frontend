import { isValidRUT, isValidEmail } from '../validators';

describe('isValidRUT (validación de RUT)', () => {
  it('retorna true para RUT válido 11111111-1', () => {
    expect(isValidRUT('11111111-1')).toBe(true);
  });

  it('retorna true para RUT válido con puntos', () => {
    expect(isValidRUT('12.345.678-5')).toBe(true);
  });

  it('retorna false para RUT inválido (DV incorrecto)', () => {
    expect(isValidRUT('11111111-0')).toBe(false);
  });

  it('retorna false para entrada mal formada', () => {
    expect(isValidRUT('abc')).toBe(false);
  });

  it('retorna false para cadena vacía', () => {
    expect(isValidRUT('')).toBe(false);
  });
});

describe('isValidEmail (validación de email)', () => {
  it('retorna true para email válido', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('retorna true para email con subdominio', () => {
    expect(isValidEmail('user@sub.example.com')).toBe(true);
  });

  it('retorna false para email sin @', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('retorna false para cadena vacía', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
