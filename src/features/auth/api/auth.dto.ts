// src/features/auth/api/auth.dto.ts

import { z } from 'zod';
import { Usuario, Rut, UserRole, UserStatus } from '../model/auth.types';

// ============================================================================
// 1. ZOD SCHEMAS: VALIDACIÓN DE CONTRATOS EN TIEMPO DE EJECUCIÓN
// ============================================================================
// Si el backend cambia una columna, este schema lo detectará instantáneamente
// y evitará que los datos corruptos envenenen el estado de Zustand.

const UsuarioDTOSchema = z.object({
  id: z.number(),
  rut: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  telefono: z.string(),
  email: z.string().nullable().optional(),
  firebase_uid: z.string().nullable().optional(),
  fcm_token: z.string().nullable().optional(),
  rol: z.nativeEnum(UserRole),
  estado: z.nativeEnum(UserStatus),
  created_at: z.string(), // ISO String que viene de PostgreSQL
  updated_at: z.string(),
});

export const AuthResponseDTOSchema = z.object({
  ok: z.boolean(),
  msg: z.string(),
  usuario: UsuarioDTOSchema,
});

// Inferimos los tipos de TypeScript automáticamente para no duplicar código
export type UsuarioDTO = z.infer<typeof UsuarioDTOSchema>;
export type AuthResponseDTO = z.infer<typeof AuthResponseDTOSchema>;

// ============================================================================
// 2. MAPPERS (Traductores Anticorrupción)
// ============================================================================

/**
 * Traduce el DTO validado a la Entidad de Dominio estricta del Frontend.
 */
export const mapUsuarioDtoToDomain = (dto: UsuarioDTO): Usuario => ({
  id: dto.id,
  rut: dto.rut as Rut, // Asumimos que si pasó el backend, es un RUT válido
  nombre: dto.nombre,
  apellido: dto.apellido,
  telefono: dto.telefono,
  email: dto.email ?? null,
  rol: dto.rol,
  estado: dto.estado,
  fcmToken: dto.fcm_token ?? null, // Traducción: snake_case -> camelCase
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
