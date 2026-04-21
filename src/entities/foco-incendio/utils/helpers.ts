// src/entities/foco-incendio/utils/helpers.ts

import type {
    EstadoAlerta,
    GeoPoint,
    GravedadAlerta
} from '../model/types'; // Ajusta la ruta a tu archivo de tipos

/**
 * 1. MAPEO DE COLORES POR ESTADO
 * Devuelve clases de NativeWind (Tailwind) o códigos Hex según el estado.
 */
export const getColorPorEstado = (estado: EstadoAlerta): string => {
  const mapaColores: Record<EstadoAlerta, string> = {
    REPORTADA: 'bg-blue-500',      // Azul (Ingresada, esperando acción)
    EN_REVISION: 'bg-yellow-500',  // Amarillo (Brigada yendo a verificar)
    DERIVADA: 'bg-purple-500',     // Morado (Enviada a bomberos/conaf)
    RESUELTA: 'bg-green-500',      // Verde (Fuego extinguido)
    DESCARTADA: 'bg-gray-400',     // Gris (Falsa alarma o duplicado)
  };

  return mapaColores[estado] || 'bg-gray-200';
};

/**
 * 2. MAPEO DE COLORES POR GRAVEDAD
 * Útil para bordes, textos o badges de alerta.
 */
export const getColorPorGravedad = (gravedad: GravedadAlerta): string => {
  const mapaGravedad: Record<GravedadAlerta, string> = {
    BAJA: 'text-green-600',
    MEDIA: 'text-yellow-600',
    ALTA: 'text-orange-600',
    CRITICA: 'text-red-600',
  };

  return mapaGravedad[gravedad] || 'text-gray-900';
};

/**
 * 3. TEXTOS AMIGABLES PARA EL USUARIO
 * Convierte el enum técnico en un texto legible para la UI.
 */
export const getTextoEstado = (estado: EstadoAlerta): string => {
  const mapaTextos: Record<EstadoAlerta, string> = {
    REPORTADA: 'Reporte Recibido',
    EN_REVISION: 'En Revisión en Terreno',
    DERIVADA: 'Derivada a Especialistas',
    RESUELTA: 'Emergencia Resuelta',
    DESCARTADA: 'Alerta Descartada',
  };

  return mapaTextos[estado] || estado;
};

/**
 * 4. FORMATEO DE COORDENADAS GEOJSON
 * El backend usa [Longitud, Latitud]. Para mostrarlo al usuario o usarlo
 * en Google Maps/Apple Maps, solemos necesitar invertirlo o mostrarlo bonito.
 */
export const formatCoordinates = (ubicacion: GeoPoint): string => {
  if (!ubicacion?.coordinates || ubicacion.coordinates.length !== 2) {
    return 'Ubicación desconocida';
  }

  // Recordemos que backend envía [Lng, Lat]
  const [lng, lat] = ubicacion.coordinates;

  // Devuelve algo como: "Lat: -33.45, Lng: -70.66"
  return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
};

/**
 * 5. VALIDACIONES RÁPIDAS
 * Útiles para mostrar u ocultar botones en la UI (Ej: Ocultar el botón "Resolver" si ya está resuelto)
 */
export const isFocoActivo = (estado: EstadoAlerta): boolean => {
  return estado === 'REPORTADA' || estado === 'EN_REVISION' || estado === 'DERIVADA';
};
