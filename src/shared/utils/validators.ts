// src/shared/utils/validators.ts
import { REGEX } from '../constants/regex';

/**
 * Validación de RUT Chileno (Algoritmo Módulo 11)
 */
export const isValidRUT = (rut: string): boolean => {
  if (!REGEX.RUT_CHILENO.test(rut)) return false;

  const clean = rut.replace(/\./g, '').replace('-', '').toUpperCase();
  let body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = 1; i <= body.length; i++) {
    const index = multiplo * parseInt(clean.charAt(body.length - i));
    suma += index;
    if (multiplo < 7) multiplo += 1;
    else multiplo = 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvFinal;
};

export const isValidEmail = (email: string): boolean => REGEX.EMAIL.test(email);
