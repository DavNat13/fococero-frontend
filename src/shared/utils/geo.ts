// src/shared/utils/geo.ts

/**
 * Calcula la distancia en Kilómetros entre dos puntos GPS usando la fórmula de Haversine.
 * Fundamental para cálculos en terreno sin conexión a internet.
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371e3; // Radio de la Tierra en metros
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMeters = R * c;

  // Retornamos en Kilómetros con 1 decimal (Ej: 4.5 km)
  return Number((distanceInMeters / 1000).toFixed(1));
};

/**
 * Formatea coordenadas para mostrarlas en la radio o reportes.
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};
