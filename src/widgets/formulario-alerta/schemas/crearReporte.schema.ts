import { z } from 'zod';

export const crearReporteSchema = z.object({
  categoria_id: z.string().uuid('Selecciona una categoría'),
  titulo: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  id_multimedia: z.string().optional(),
});

export type CrearReporteFormData = z.infer<typeof crearReporteSchema>;
