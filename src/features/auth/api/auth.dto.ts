// src/features/auth/api/auth.dto.ts

import { z } from 'zod';
import { Usuario, UserRole, UserStatus } from '@entities/usuario';

/**
 * Esquema de validación para la respuesta del backend (ms-auth)
 * Asegura que el JSON recibido tenga la forma correcta.
 */
export const AuthResponseDTOSchema = z.object({
  usuario: z.object({
    id: z.number(),
    rut: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    telefono: z.string(),
    email: z.string().nullable(),
    rol: z.nativeEnum(UserRole),
    estado: z.nativeEnum(UserStatus),
    fcm_token: z.string().nullable().optional(),
    creado_en: z.string().optional(),
    actualizado_en: z.string().optional(),
  }),
});

export type AuthResponseDTO = z.infer<typeof AuthResponseDTOSchema>;

/**
 * Mapeador: Convierte el DTO (Data Transfer Object) del backend
 * a nuestra interfaz de dominio de la Entidad Usuario.
 */
export const mapUsuarioDtoToDomain = (dto: AuthResponseDTO['usuario']): Usuario => {
  return {
    ...dto,
    email: dto.email ?? undefined,
    fcm_token: dto.fcm_token ?? undefined,
  };
};
