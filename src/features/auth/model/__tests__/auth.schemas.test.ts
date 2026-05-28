/* eslint-disable import/first */
jest.mock('@entities/usuario', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { z } = require('zod');
  const rutRegex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
  return {
    rutSchema: z
      .string()
      .trim()
      .toUpperCase()
      .regex(rutRegex, 'El RUT debe tener el formato 12345678-9'),
    telefonoSchema: z
      .string()
      .trim()
      .regex(/^\+?56[0-9]{8,9}$/, 'Teléfono inválido'),
    nombreSchema: z.string().trim().min(2).max(100),
    usuarioApi: { getProfile: jest.fn(), updateProfile: jest.fn() },
    Rut: String,
  };
});

import { loginSchema, registerFormSchema } from '../auth.schemas';

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const data = { rut: '12345678-9', password: 'password123' };
    const result = loginSchema.parse(data);
    expect(result).toEqual(data);
  });

  it('rejects short RUT', () => {
    expect(() => loginSchema.parse({ rut: '12-9', password: 'pass' })).toThrow();
  });

  it('rejects short password', () => {
    expect(() => loginSchema.parse({ rut: '12345678-9', password: '12345' })).toThrow();
  });
});

describe('registerFormSchema', () => {
  it('accepts valid registration data', () => {
    const data = {
      rut: '12.345.678-5',
      nombre: 'Juan',
      apellido: 'Perez',
      telefono: '912345678',
    };
    const result = registerFormSchema.parse(data);
    expect(result.rut).toBe('12345678-5');
    expect(result.nombre).toBe('Juan');
    expect(result.apellido).toBe('Perez');
    expect(result.telefono).toBe('+56912345678');
  });

  it('rejects invalid RUT', () => {
    expect(() =>
      registerFormSchema.parse({
        rut: 'invalid',
        nombre: 'Juan',
        apellido: 'Perez',
        telefono: '912345678',
      }),
    ).toThrow();
  });

  it('rejects invalid phone', () => {
    expect(() =>
      registerFormSchema.parse({
        rut: '12.345.678-5',
        nombre: 'Juan',
        apellido: 'Perez',
        telefono: '123',
      }),
    ).toThrow();
  });
});
