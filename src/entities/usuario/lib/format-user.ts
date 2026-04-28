// src/entities/usuario/lib/format-user.ts

import { Usuario, UserRole, UserStatus } from '../model/usuario.types';

/**
 * DICCIONARIOS ESTÁTICOS (Mejora de Performance)
 * Al estar fuera de las funciones, se instancian una sola vez en memoria,
 * evitando la recolección de basura extra en listas largas (FlatLists).
 */
const ROLE_LABELS: Record<string, string> = {
  [UserRole.INVITADO]: 'Invitado',
  [UserRole.USUARIO]: 'Ciudadano',
  [UserRole.BRIGADISTA]: 'Brigadista',
  [UserRole.ADMIN]: 'Administrador Central',
};

const STATUS_LABELS: Record<string, string> = {
  [UserStatus.ACTIVO]: 'Activo',
  [UserStatus.BLOQUEADO]: 'Bloqueado',
  [UserStatus.SUSPENDIDO]: 'Suspendido temporalmente',
};

/**
 * Helper privado para capitalizar textos (jUaN -> Juan)
 */
const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * LIBRERÍA DE PRESENTACIÓN: USUARIO
 */
export const formatUser = {
  /**
   * Retorna el nombre completo limpio y con mayúsculas correctas.
   * @param fallback Texto a mostrar si el usuario no tiene nombre registrado.
   */
  fullName: (user?: Partial<Usuario> | null, fallback = 'Usuario Desconocido'): string => {
    if (!user) return fallback;

    // Extraemos, limpiamos espacios extra y capitalizamos
    const nombre = capitalize(user.nombre?.trim() || '');
    const apellido = capitalize(user.apellido?.trim() || '');

    const completo = `${nombre} ${apellido}`.trim();
    return completo || fallback;
  },

  /**
   * Retorna el nombre con el rol corporativo. Ideal para cabeceras o tarjetas.
   * Ej: "Juan Pérez (Brigadista)"
   */
  displayName: (user?: Partial<Usuario> | null, fallback = 'Usuario Desconocido'): string => {
    const name = formatUser.fullName(user, fallback);
    if (!user?.rol) return name;

    return `${name} (${formatUser.role(user.rol)})`;
  },

  /**
   * Formatea el rol para la interfaz visual, haciéndolo amigable.
   */
  role: (rol?: UserRole | string | null, fallback = 'Sin Rol'): string => {
    if (!rol) return fallback;
    return ROLE_LABELS[rol as string] || String(rol);
  },

  /**
   * Traduce el estado del sistema a un string visual.
   */
  status: (estado?: UserStatus | string | null, fallback = 'Desconocido'): string => {
    if (!estado) return fallback;
    return STATUS_LABELS[estado as string] || String(estado);
  },

  /**
   * Genera iniciales de máximo 2 letras para avatares gráficos.
   * Maneja casos donde solo hay nombre o solo apellido.
   */
  initials: (user?: Partial<Usuario> | null): string => {
    if (!user) return '?';

    const n = (user.nombre?.trim() || '').charAt(0);
    const a = (user.apellido?.trim() || '').charAt(0);

    // Si tiene nombre y apellido: "JP". Si solo tiene nombre: "J". Si no tiene nada: "?"
    const iniciales = `${n}${a}`.toUpperCase();
    return iniciales || '?';
  },
} as const; // Congelamos el objeto para evitar mutaciones accidentales
