// Mock axios para evitar el error de fetch adapter en Node.js
jest.mock('axios', () => {
  const mockAxiosError = (isAxios: boolean) => {
    const err: any = new Error('Axios error');
    err.isAxiosError = isAxios;
    err.config = { url: '/api/test', method: 'get' };
    return err;
  };

  return {
    __esModule: true,
    default: {
      isAxiosError: (error: any) => error?.isAxiosError === true,
    },
    isAxiosError: (error: any) => error?.isAxiosError === true,
  };
});

import { ApiError } from '../api.errors';

// Helper para crear errores tipo Axios
const createAxiosError = (overrides: Record<string, any> = {}) => {
  const error: any = new Error('Axios error');
  error.isAxiosError = true;
  error.config = { url: '/api/test', method: 'get' };
  error.code = overrides.code;
  error.response = overrides.response;
  error.message = overrides.message || 'Axios error';
  if (overrides.name) error.name = overrides.name;
  return error;
};

describe('ApiError (errores de API)', () => {
  describe('ApiError.from()', () => {
    it('retorna el mismo error si ya es un ApiError', () => {
      const original = ApiError.from(new Error('test'));
      const result = ApiError.from(original);
      expect(result).toBe(original);
    });

    it('convierte un Error genérico en ApiError INTERNAL_SERVER_ERROR', () => {
      const result = ApiError.from(new Error('algo salió mal'));
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
      expect(result.message).toBe('algo salió mal');
    });

    it('convierte un string en ApiError con mensaje por defecto', () => {
      const result = ApiError.from('error string');
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
      expect(result.message).toBe('Error desconocido en el cliente');
    });

    it('convierte un objeto en ApiError con mensaje por defecto', () => {
      const result = ApiError.from({ custom: 'error' });
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('convierte undefined en ApiError', () => {
      const result = ApiError.from(undefined);
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('ApiError parseAxiosError (errores de red)', () => {
    it('detecta timeout (ECONNABORTED)', () => {
      const axiosErr = createAxiosError({ code: 'ECONNABORTED' });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('TIMEOUT');
      expect(result.message).toBe('La conexión tardó demasiado. Reintente por favor.');
      expect(result.isNetworkError).toBe(true);
    });

    it('detecta error de red (sin response)', () => {
      const axiosErr = createAxiosError({ code: 'NETWORK_ERROR', response: undefined });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.message).toContain('No hay conexión con el servidor');
      expect(result.isNetworkError).toBe(true);
    });

    it('detecta error 400 con backendData.error string', () => {
      const axiosErr = createAxiosError({
        response: { status: 400, data: { error: 'Datos inválidos' } },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toBe('Datos inválidos');
    });

    it('detecta error 401 (no autorizado)', () => {
      const axiosErr = createAxiosError({
        response: { status: 401, data: { error: 'Token expirado' } },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('UNAUTHORIZED');
      expect(result.message).toBe('Token expirado');
    });

    it('detecta error 403 (prohibido)', () => {
      const axiosErr = createAxiosError({
        response: { status: 403, data: { error: 'Sin permisos' } },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('FORBIDDEN');
      expect(result.message).toBe('Sin permisos');
    });

    it('detecta error 404 (no encontrado)', () => {
      const axiosErr = createAxiosError({
        response: { status: 404, data: { error: 'Recurso no existe' } },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.message).toBe('Recurso no existe');
    });

    it('detecta error 500 sin error específico', () => {
      const axiosErr = createAxiosError({
        response: { status: 500, data: { msg: 'Error interno' } },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
      expect(result.message).toBe('Error interno');
    });

    it('maneja backendData.error como objeto con message y code', () => {
      const axiosErr = createAxiosError({
        response: {
          status: 400,
          data: {
            error: {
              message: 'Error de validación',
              code: 'VALIDATION_ERROR',
              validationErrors: { email: ['Email inválido'] },
            },
          },
        },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toBe('Error de validación');
      expect(result.validationErrors).toEqual({ email: ['Email inválido'] });
    });

    it('maneja backendData.error como objeto con mensaje y codigo', () => {
      const axiosErr = createAxiosError({
        response: {
          status: 403,
          data: {
            error: {
              mensaje: 'Acceso denegado',
              codigo: 'FORBIDDEN',
            },
          },
        },
      });
      const result = ApiError.from(axiosErr);
      expect(result.code).toBe('FORBIDDEN');
      expect(result.message).toBe('Acceso denegado');
    });

    it('maneja backendData con exito: false y error.mensaje', () => {
      const axiosErr = createAxiosError({
        response: {
          status: 500,
          data: {
            exito: false,
            error: { mensaje: 'Error del servidor' },
          },
        },
      });
      const result = ApiError.from(axiosErr);
      expect(result.message).toBe('Error del servidor');
    });

    it('usa mensaje por defecto cuando no hay data relevante', () => {
      const axiosErr = createAxiosError({
        response: { status: 401, data: {} },
      });
      const result = ApiError.from(axiosErr);
      expect(result.message).toBe('Tu sesión ha expirado. Por favor, ingresa nuevamente.');
      expect(result.code).toBe('UNAUTHORIZED');
    });

    it('usa mensaje por defecto para 500 sin data', () => {
      const axiosErr = createAxiosError({
        response: { status: 500, data: {} },
      });
      const result = ApiError.from(axiosErr);
      expect(result.message).toBe('Los servidores de FocoCero están experimentando problemas.');
    });

    it('usa mensaje por defecto para otros errores', () => {
      const axiosErr = createAxiosError({
        response: { status: 502, data: {} },
      });
      const result = ApiError.from(axiosErr);
      expect(result.message).toBe('Ocurrió un error inesperado al procesar la solicitud.');
      expect(result.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('toUIFormat', () => {
    it('formatea error simple correctamente', () => {
      const error = ApiError.from(new Error('test'));
      const ui = error.toUIFormat();
      expect(ui).toEqual({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'test',
      });
    });

    it('incluye validationErrors cuando existen', () => {
      const axiosErr = createAxiosError({
        response: {
          status: 400,
          data: {
            error: {
              message: 'Error',
              code: 'VALIDATION_ERROR',
              validationErrors: { campo: ['Error en campo'] },
            },
          },
        },
      });
      const error = ApiError.from(axiosErr);
      const ui = error.toUIFormat();
      expect(ui.validationErrors).toEqual({ campo: ['Error en campo'] });
    });
  });

  describe('isNetworkError', () => {
    it('es true para NETWORK_ERROR', () => {
      const axiosErr = createAxiosError({ code: 'NETWORK_ERROR', response: undefined });
      const error = ApiError.from(axiosErr);
      expect(error.isNetworkError).toBe(true);
    });

    it('es true para TIMEOUT', () => {
      const axiosErr = createAxiosError({ code: 'ECONNABORTED' });
      const error = ApiError.from(axiosErr);
      expect(error.isNetworkError).toBe(true);
    });

    it('es false para otros errores', () => {
      const error = ApiError.from(new Error('normal error'));
      expect(error.isNetworkError).toBe(false);
    });
  });
});
