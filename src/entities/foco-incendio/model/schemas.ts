// src/entities/foco-incendio/model/foco-incendio.schemas.ts
import { z } from 'zod';

// Replicamos los enums como literales en Zod para inferencia y validación
const TipoAlertaEnum = z.enum([
  'INCENDIO',
  'MICROBASURAL',
  'VEGETACION_SECA',
  'ALUMBRADO_DEFECTUOSO',
  'OTRO',
]);
const GravedadAlertaEnum = z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']);

const GeoPointSchema = z.object({
  type: z.literal('Point'),
  // Validamos explícitamente los límites de coordenadas: [longitud, latitud]
  coordinates: z.tuple([
    z.number().min(-180).max(180, 'La longitud debe estar entre -180 y 180'),
    z.number().min(-90).max(90, 'La latitud debe estar entre -90 y 90'),
  ]),
});

// Esquema de validación para el DTO de creación
export const crearAlertaSchema = z.object({
  foco_id: z.string().uuid('Formato de ID inválido').nullable().optional(),
  tipo: TipoAlertaEnum,
  gravedad: GravedadAlertaEnum,
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  ubicacion: GeoPointSchema,
  imagenes: z.array(z.string().url('Debe ser una URL válida')).optional(),
});

// Inferimos el tipo directamente de Zod por si necesitamos usarlo en formularios
export type CrearAlertaForm = z.infer<typeof crearAlertaSchema>;
