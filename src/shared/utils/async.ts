// src/shared/utils/async.ts

/**
 * Pausa la ejecución por un tiempo determinado (Útil para simular cargas o esperar animaciones).
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Patrón "Exponential Backoff".
 * Intenta ejecutar una promesa, si falla, espera y vuelve a intentar.
 * Vital para sincronizar reportes cuando hay mala señal.
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    await delay(delayMs);
    // En cada reintento, esperamos el doble de tiempo (1s, 2s, 4s)
    return withRetry(operation, retries - 1, delayMs * 2);
  }
};
