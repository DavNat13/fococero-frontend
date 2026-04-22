// src/entities/foco-incendio/index.ts

/**
 * PUBLIC API - ENTITY: FOCO-INCENDIO
 * Siguiendo FSD, este es el único punto de entrada permitido para otras slices.
 */

// 1. Exportamos los Tipos e Interfaces (Contrato de Datos)
export * from './model/types';

// 2. Exportamos los Esquemas de Validación (Contrato de Formulario/Zod)
export * from './model/schemas';

// 3. Exportamos los Hooks de Servidor (React Query)
// Nota: No exportamos 'service.ts' directamente para obligar el uso de Hooks
export { useGetFocos, useCreateFoco, useUpdateFocoEstado, useDeleteFoco } from './api/queries';

// 4. Exportamos los Helpers y Utilidades de UI
export {
  getColorPorEstado,
  getColorPorGravedad,
  getTextoEstado,
  formatCoordinates,
  isFocoActivo,
} from './utils/helpers';
