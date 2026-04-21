// src/entities/usuario/model/usuario.types.ts

/**
 * Enums extraídos directamente de la base de datos PostgreSQL (user_role, user_status)
 */
export enum UserRole {
  INVITADO = 'invitado',
  USUARIO = 'usuario',
  BRIGADISTA = 'brigadista',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVO = 'activo',
  BLOQUEADO = 'bloqueado',
  SUSPENDIDO = 'suspendido',
}

/**
 * Marca de tipo (Brand Type) para el RUT, asegurando que un string normal
 * no pase por un RUT validado accidentalmente.
 */
export type Rut = string & { readonly __brand: unique symbol };

/**
 * Contrato principal de la Entidad Usuario.
 * Mapea exactamente con el user.model.ts del backend.
 */
export interface Usuario {
  id: number;
  rut: Rut | string; // Permitimos string genérico para el parsing inicial
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  firebase_uid?: string;
  fcm_token?: string;
  rol: UserRole;
  estado: UserStatus;
  reputacion?: number;
  verificado?: boolean;
  creado_en?: string; // Fechas serializadas a ISO 8601 en el frontend
  actualizado_en?: string;
}

/**
 * DTO para la actualización del perfil.
 * Según AuthService.updateUserProfile, los campos sensibles (rol, estado, firebase_uid)
 * están estrictamente prohibidos en este payload.
 */
export type UpdateProfileDTO = Partial<Pick<Usuario, 'nombre' | 'apellido' | 'telefono' | 'rut'>>;
