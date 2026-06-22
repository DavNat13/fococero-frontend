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

describe('loginSchema (esquema de login)', () => {
  it('acepta datos de login válidos', () => {
    const data = { rut: '12345678-9', password: 'password123' };
    const result = loginSchema.parse(data);
    expect(result).toEqual(data);
  });

  it('rechaza RUT corto', () => {
    expect(() => loginSchema.parse({ rut: '12-9', password: 'pass' })).toThrow();
  });

  it('rechaza contraseña corta', () => {
    expect(() => loginSchema.parse({ rut: '12345678-9', password: '12345' })).toThrow();
  });
});

describe('registerFormSchema (esquema de registro)', () => {
  it('acepta datos de registro válidos', () => {
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

  it('rechaza RUT inválido', () => {
    expect(() =>
      registerFormSchema.parse({
        rut: 'invalid',
        nombre: 'Juan',
        apellido: 'Perez',
        telefono: '912345678',
      }),
    ).toThrow();
  });

  it('rechaza teléfono inválido', () => {
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
