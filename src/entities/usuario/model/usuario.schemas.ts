// src/entities/usuario/model/usuario.schemas.ts

import { z } from 'zod';

/**
 * ============================================================================
 * REGLAS DE NEGOCIO PURAS (Primitivas)
 * ============================================================================
 */
const rutRegex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
const telefonoRegex = /^\+?56[0-9]{8,9}$/; // Formato Chile

export const rutSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(rutRegex, 'El RUT debe tener el formato 12345678-9');

export const telefonoSchema = z
  .string()
  .trim()
  .regex(telefonoRegex, 'El teléfono debe ser un número válido de Chile (ej: +56912345678)');

export const nombreSchema = z
  .string()
  .trim()
  .min(2, 'Debe tener al menos 2 caracteres')
  .max(100, 'Supera el límite de 100 caracteres');

/**
 * ============================================================================
 * ESQUEMAS COMPUESTOS (DTOs de Validación)
 * ============================================================================
 */

/**
 * Validador para cuando el usuario edita su perfil desde la app.
 * Refleja las restricciones de seguridad del AuthService.updateUserProfile del backend.
 */
export const updateProfileSchema = z
  .object({
    rut: rutSchema.optional(),
    nombre: nombreSchema.optional(),
    apellido: nombreSchema.optional(),
    telefono: telefonoSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe modificar al menos un campo para actualizar el perfil',
  });

// Tipos inferidos automáticamente por Zod
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
