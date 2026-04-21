// src/features/auth/model/auth.schemas.ts

import { z } from 'zod';
import { Rut } from './auth.types';

// ============================================================================
// PIPELINES DE LIMPIEZA Y VALIDACIÓN
// ============================================================================

// Transforma " 12.345.678-9 " a "12345678-9" antes de validar
const cleanRutTransform = z
  .string()
  .trim()
  .transform((val) => val.replace(/\./g, '').toUpperCase())
  .refine((val) => /^0*(\d{1,8})\-?([\dK])$/.test(val), {
    message: 'Formato de RUT inválido. Ej: 12345678-9',
  });

const cleanPhoneTransform = z
  .string()
  .trim()
  // Si el usuario escribe "987654321", le agregamos el "+56" automáticamente
  .transform((val) => (val.startsWith('+56') ? val : `+56${val}`))
  .refine((val) => /^\+569\d{8}$/.test(val), {
    message: 'Debe ser un celular válido de 9 dígitos',
  });

const cleanNameTransform = z
  .string()
  .trim()
  // Evita dobles espacios entre palabras "Juan   Pablo" -> "Juan Pablo"
  .transform((val) => val.replace(/\s+/g, ' '))
  .refine((val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), {
    message: 'Solo se permiten letras',
  })
  .refine((val) => val.length >= 2 && val.length <= 100, {
    message: 'Debe tener entre 2 y 100 caracteres',
  });

// ============================================================================
// SCHEMAS DE FORMULARIO (Exportados para React Hook Form)
// ============================================================================

export const registerFormSchema = z.object({
  rut: cleanRutTransform,
  nombre: cleanNameTransform,
  apellido: cleanNameTransform,
  telefono: cleanPhoneTransform,
});

// Extraemos el tipo. Zod es tan inteligente que sabe que el string final
// está limpio, pero lo forzamos a nuestro Branded Type para máxima seguridad.
export type RegisterFormData = Omit<z.infer<typeof registerFormSchema>, 'rut'> & {
  rut: Rut;
};
