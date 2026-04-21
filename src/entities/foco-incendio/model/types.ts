// src/entities/foco-incendio/model/foco-incendio.types.ts

// ==========================================
// ENUMS EXACTOS DEL BACKEND (ms-alertas)
// ==========================================
export type TipoAlerta = 'INCENDIO' | 'MICROBASURAL' | 'VEGETACION_SECA' | 'ALUMBRADO_DEFECTUOSO' | 'OTRO';
export type GravedadAlerta = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type EstadoAlerta = 'REPORTADA' | 'EN_REVISION' | 'DERIVADA' | 'RESUELTA' | 'DESCARTADA';

// ==========================================
// INTERFACES BASE
// ==========================================
export interface GeoPoint {
  type: 'Point'; // Siempre debe ser 'Point' según el validador del backend
  coordinates: [number, number]; // [longitud, latitud] - IMPORTANTE: El backend espera primero longitud
}

// Interfaz principal equivalente a IAlerta
export interface AlertaIncendio {
  id?: string;
  foco_id?: string | null;
  usuario_id: string;
  tipo: TipoAlerta;
  gravedad?: GravedadAlerta;
  estado?: EstadoAlerta;
  descripcion: string;
  imagenes?: string[];
  ubicacion: GeoPoint;
  metadata?: any;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  eliminado_en?: string | null;
}

// ==========================================
// DTOs (Data Transfer Objects)
// ==========================================

// DTO para POST /api/alertas (Extraído del Swagger y Validador)
export interface CrearAlertaDTO {
  foco_id?: string | null;
  tipo: TipoAlerta;
  gravedad: GravedadAlerta;
  descripcion: string; // Min: 10, Max: 500 caracteres según Zod
  ubicacion: GeoPoint; // Longitud entre -180 y 180, Latitud entre -90 y 90
  imagenes?: string[];
}

// DTO para PATCH /api/alertas/:id/estado
export interface CambiarEstadoAlertaDTO {
  estado: EstadoAlerta;
}

// DTO para POST /api/alertas/:id/verificar
export interface VerificarAlertaDTO {
  esFuegoConfirmado: boolean;
}
