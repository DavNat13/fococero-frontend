jest.mock('@features/auth/model/auth.store', () => {
  const mockAuthStore = {
    getState: jest.fn(() => ({
      firebaseToken: null,
      status: 'unauthenticated',
      user: null,
      logout: jest.fn(),
      refreshGuestToken: jest.fn(),
      setAuthData: jest.fn(),
    })),
    setState: jest.fn(),
    subscribe: jest.fn(),
  };
  return {
    useAuthStore: mockAuthStore,
  };
});

jest.mock('@core/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('new-token'),
    },
  })),
}));

jest.mock('@shared/utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mocked-uuid-123'),
}));

jest.mock('axios', () => ({
  isAxiosError: jest.fn((err: any) => err?.isAxiosError === true),
}));

import {
  requestInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from '../api.interceptors';
import { ApiError } from '../api.errors';
import { useAuthStore } from '@features/auth/model/auth.store';

const mockGetState = useAuthStore.getState as jest.Mock;

describe('requestInterceptor (interceptor de peticiones)', () => {
  beforeEach(() => {
    // Reset default mock
    mockGetState.mockReturnValue({
      firebaseToken: null,
      status: 'unauthenticated',
      user: null,
      logout: jest.fn(),
    });
  });

  it('agrega X-Request-ID si no existe', () => {
    const config: any = { headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers['X-Request-ID']).toBe('mocked-uuid-123');
  });

  it('no sobreescribe X-Request-ID si ya existe', () => {
    const config: any = { headers: { 'X-Request-ID': 'existing-id' } };
    const result = requestInterceptor(config);
    expect(result.headers['X-Request-ID']).toBe('existing-id');
  });

  it('agrega Authorization Bearer si hay token', () => {
    mockGetState.mockReturnValue({ firebaseToken: 'test-token' });
    const config: any = { headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('no agrega Authorization si no hay token', () => {
    const config: any = { headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('agrega Accept application/json', () => {
    const config: any = { headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Accept).toBe('application/json');
  });

  it('agrega Content-Type por defecto si no existe', () => {
    const config: any = { headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers['Content-Type']).toBe('application/json');
  });

  it('no sobreescribe Content-Type si ya existe', () => {
    const config: any = { headers: { 'Content-Type': 'multipart/form-data' } };
    const result = requestInterceptor(config);
    expect(result.headers['Content-Type']).toBe('multipart/form-data');
  });

  it('registra _requestStartTime', () => {
    const config: any = { headers: {} };
    const before = Date.now();
    const result = requestInterceptor(config);
    const after = Date.now();
    expect(result._requestStartTime).toBeGreaterThanOrEqual(before);
    expect(result._requestStartTime).toBeLessThanOrEqual(after);
  });
});

describe('responseInterceptor (interceptor de respuestas)', () => {
  it('retorna la respuesta sin modificar', () => {
    const response: any = { data: { id: 1 }, config: { headers: {} }, status: 200 };
    const result = responseInterceptor(response);
    expect(result).toBe(response);
  });

  it('convierte latitud/longitud string a número', () => {
    const response: any = {
      data: { latitud: '-33.45', longitud: '-70.65' },
      config: { headers: {} },
      status: 200,
    };
    const result = responseInterceptor(response);
    expect(typeof result.data.latitud).toBe('number');
    expect(result.data.latitud).toBe(-33.45);
  });

  it('normaliza coordenadas en arrays', () => {
    const response: any = {
      data: [{ latitud: '10.5', longitud: '-20.3' }],
      config: { headers: {} },
      status: 200,
    };
    const result = responseInterceptor(response);
    expect(typeof result.data[0].latitud).toBe('number');
    expect(result.data[0].latitud).toBe(10.5);
  });

  it('no modifica datos sin coordenadas', () => {
    const response: any = {
      data: { nombre: 'Test', valor: 100 },
      config: { headers: {} },
      status: 200,
    };
    const result = responseInterceptor(response);
    expect(result.data).toEqual({ nombre: 'Test', valor: 100 });
  });

  it('respeta MAX_DEPTH en objetos anidados', () => {
    const deepData: any = { a: { b: { c: { d: { e: { f: { latitud: '1.0' } } } } } } };
    const response: any = { data: deepData, config: { headers: {} }, status: 200 };
    expect(() => responseInterceptor(response)).not.toThrow();
  });

  it('respeta MAX_ARRAY_ITEMS en arrays largos', () => {
    const largeArray = Array.from({ length: 300 }, (_, i) => ({
      latitud: `${i}`,
      longitud: `${-i}`,
    }));
    const response: any = { data: largeArray, config: { headers: {} }, status: 200 };
    expect(() => responseInterceptor(response)).not.toThrow();
  });
});

describe('responseErrorInterceptor (interceptor de errores)', () => {
  const mockAxiosInstance = { request: jest.fn() } as any;

  it('rechaza con ApiError para errores no autorizados en rutas públicas', async () => {
    const error = createAxiosError({
      response: { status: 401, data: { error: 'No autorizado' } },
      config: { url: '/api/auth/login', method: 'post' },
    });
    await expect(responseErrorInterceptor(error, mockAxiosInstance)).rejects.toBeInstanceOf(ApiError);
  });

  it('rechaza con ApiError para errores que no son 401', async () => {
    const error = createAxiosError({
      response: { status: 500, data: { error: 'Error interno' } },
      config: { url: '/api/alertas', method: 'get' },
    });
    await expect(responseErrorInterceptor(error, mockAxiosInstance)).rejects.toBeInstanceOf(ApiError);
  });

  it('rechaza con ApiError para error 401 sin config', async () => {
    const error = createAxiosError({
      response: { status: 401, data: { error: 'No autorizado' } },
    });
    delete error.config;
    await expect(responseErrorInterceptor(error, mockAxiosInstance)).rejects.toBeInstanceOf(ApiError);
  });
});

function createAxiosError(overrides: Record<string, any> = {}) {
  const error: any = new Error('Axios error');
  error.isAxiosError = true;
  error.config = overrides.config || { url: '/api/test', method: 'get' };
  error.response = overrides.response;
  error.code = overrides.code;
  return error;
}
