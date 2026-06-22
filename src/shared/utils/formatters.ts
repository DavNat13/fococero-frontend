// src/shared/utils/formatters.ts

/**
 * Formatea un RUT chileno (ej: 123456789 -> 12.345.678-9)
 */
export const formatRUT = (value: string): string => {
  const clean = value.replace(/[^0-9kK]/g, '');
  if (!clean) return '';

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();

  return body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
};

/**
 * Formatea un número chileno (ej: 912345678 -> +56 9 1234 5678)
 */
export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 9) {
    return `+56 9 ${clean.slice(1, 5)} ${clean.slice(5)}`;
  }
  return phone;
};

/**
 * Capitaliza la primera letra de cada palabra (Nombres de brigadistas)
 */
export const capitalize = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Formatea una fecha ISO a formato local chileno
 */
export const formatearFecha = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};
