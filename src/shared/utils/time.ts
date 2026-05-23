// src/shared/utils/time.ts

/**
 * Devuelve el tiempo relativo. Ideal para la bitácora de incidentes.
 * Ej: "Justo ahora", "Hace 5 m", "Hace 2 h", "Ayer".
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const time = new Date(date).getTime();
  const now = Date.now();
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return 'Justo ahora';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} d`;

  // Fallback a fecha corta (Ej: 14 Oct)
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' }).format(
    new Date(date),
  );
};

/**
 * Formato militar/táctico para reportes (Ej: "14:30 hrs")
 */
export const getTacticalTime = (date: Date | string | number = new Date()): string => {
  return (
    new Intl.DateTimeFormat('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(date)) + ' hrs'
  );
};
