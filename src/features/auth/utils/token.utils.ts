// src/features/auth/utils/token.utils.ts

import { z } from 'zod';

/**
 * ============================================================================
 * ESQUEMA DE SEGURIDAD PARA JWT (Zod Inspection)
 * ============================================================================
 * No solo decodificamos, validamos que el contenido del token sea real
 * para evitar envenenamiento de estado por tokens malformados.
 */
const JwtPayloadSchema = z.object({
  exp: z.number().positive(),
  iat: z.number().positive(),
  sub: z.string().min(1), // Firebase UID
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// CENTINELA DE TOKENS (Criptografía Defensiva)

export const tokenUtils = {
  /**
   * Decodifica JWT de forma robusta en React Native.
   * Maneja el soporte para UTF-8 y evita dependencias pesadas.
   */
  decodePayload: (token: string): JwtPayload | null => {
    if (!token || token.split('.').length < 2) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // En React Native / Hermes, a veces atob no está disponible.
      // Usamos una implementación compatible con Buffer/String nativo.
      const jsonPayload = decodeURIComponent(
        escape(Buffer.from(base64, 'base64').toString('binary')),
      );

      const parsed = JSON.parse(jsonPayload);

      // Validación en tiempo de ejecución
      const result = JwtPayloadSchema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch (error) {
      // Silencioso en prod, pero útil para debugging
      console.error('[TokenUtils] Fallo crítico en decodificación:', error);
      return null;
    }
  },

  /**
   * Verifica si el token es matemáticamente válido en el tiempo.
   * @param bufferSeconds Margen para prevenir latencia de red (default 5min)
   */
  isValid: (token: string | null, bufferSeconds = 300): boolean => {
    if (!token) return false;
    const payload = tokenUtils.decodePayload(token);
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now + bufferSeconds;
  },

  /**
   * Determina si el token está en su "ventana de gracia".
   * Útil para disparar un refresh silencioso sin interrumpir al usuario.
   */
  needsRefresh: (token: string | null, thresholdSeconds = 1800): boolean => {
    if (!token) return true;
    const payload = tokenUtils.decodePayload(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = payload.exp - now;

    // Si falta menos de 30 min (threshold), necesitamos refresh
    return timeUntilExpiration < thresholdSeconds;
  },

  /**
   * Retorna el tiempo restante de vida del token formateado para logs.
   */
  getLifetimeDiagnostic: (token: string): string => {
    const payload = tokenUtils.decodePayload(token);
    if (!payload) return 'Invalid Token';

    const remaining = payload.exp - Math.floor(Date.now() / 1000);
    const minutes = Math.floor(remaining / 60);

    return remaining > 0 ? `Expira en ${minutes} min` : 'Expirado';
  },
};
