import { parseError } from '../errors';

describe('parseError (análisis de errores)', () => {
  it('analiza error de red', () => {
    const error = new Error('Network Error');
    const result = parseError(error);
    expect(result).toEqual({
      code: 'NETWORK_OFFLINE',
      message: 'Sin conexión a internet. Verifique su red.',
      isNetworkError: true,
    });
  });

  it('analiza Error genérico', () => {
    const error = new Error('Something went wrong');
    const result = parseError(error);
    expect(result).toEqual({
      code: 'APP_ERROR',
      message: 'Something went wrong',
      isNetworkError: false,
    });
  });

  it('analiza error desconocido', () => {
    const result = parseError('unknown');
    expect(result).toEqual({
      code: 'UNKNOWN',
      message: 'Error en los servidores de FocoCero. Equipo técnico notificado.',
      isNetworkError: false,
    });
  });
});
