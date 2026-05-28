import { parseError } from '../errors';

describe('parseError', () => {
  it('parses network error', () => {
    const error = new Error('Network Error');
    const result = parseError(error);
    expect(result).toEqual({
      code: 'NETWORK_OFFLINE',
      message: 'Sin conexión a internet. Verifique su red.',
      isNetworkError: true,
    });
  });

  it('parses generic Error', () => {
    const error = new Error('Something went wrong');
    const result = parseError(error);
    expect(result).toEqual({
      code: 'APP_ERROR',
      message: 'Something went wrong',
      isNetworkError: false,
    });
  });

  it('parses unknown error', () => {
    const result = parseError('unknown');
    expect(result).toEqual({
      code: 'UNKNOWN',
      message: 'Error en los servidores de FocoCero. Equipo técnico notificado.',
      isNetworkError: false,
    });
  });
});
