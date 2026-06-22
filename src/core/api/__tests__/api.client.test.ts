// src/core/api/__tests__/api.client.test.ts

// Mock instance compartida (se asigna en beforeAll)
let mockAxiosInstance: any;

jest.mock('axios', () => ({
  isAxiosError: jest.fn(() => false),
  create: jest.fn(() => {
    const instance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };
    mockAxiosInstance = instance;
    return instance;
  }),
}));

jest.mock('../../config/env.config', () => ({
  getEnv: jest.fn(() => ({
    EXPO_PUBLIC_API_GATEWAY_URL: 'http://test.local:3000',
    EXPO_PUBLIC_API_TIMEOUT: 10000,
  })),
}));

jest.mock('../api.interceptors', () => ({
  requestInterceptor: (config: any) => config,
  requestErrorInterceptor: (error: any) => Promise.reject(error),
  responseInterceptor: (response: any) => response,
  responseErrorInterceptor: (error: any, instance: any) => Promise.reject(error),
}));

import { apiClient } from '../api.client';
import { ApiError } from '../api.errors';

describe('apiClient', () => {
  beforeEach(() => {
    // Reemplazar los métodos mock del shared instance para cada test
    if (mockAxiosInstance) {
      mockAxiosInstance.get.mockReset();
      mockAxiosInstance.post.mockReset();
      mockAxiosInstance.put.mockReset();
      mockAxiosInstance.patch.mockReset();
      mockAxiosInstance.delete.mockReset();
    }
  });

  describe('get', () => {
    it('realiza GET request y retorna success con data transformada', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { usuario: { id: 1, nombre: 'Test' } },
      });

      const result = await apiClient.get('/api/test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1, nombre: 'Test' });
      }
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/test', undefined);
    });

    it('retorna success con data directa si no hay transformación', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { id: 1, nombre: 'Test' },
      });

      const result = await apiClient.get('/api/test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1, nombre: 'Test' });
      }
    });
  });

  describe('post', () => {
    it('realiza POST request y retorna success', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { usuario: { id: 1 } },
      });

      const result = await apiClient.post('/api/test', { name: 'test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1 });
      }
    });
  });

  describe('put', () => {
    it('realiza PUT request y retorna success', async () => {
      mockAxiosInstance.put.mockResolvedValue({
        data: { datos: { id: 1, updated: true } },
      });

      const result = await apiClient.put('/api/test/1', { name: 'updated' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1, updated: true });
      }
    });
  });

  describe('patch', () => {
    it('realiza PATCH request y retorna success', async () => {
      mockAxiosInstance.patch.mockResolvedValue({
        data: { patched: true },
      });

      const result = await apiClient.patch('/api/test/1', { field: 'value' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ patched: true });
      }
    });
  });

  describe('delete', () => {
    it('realiza DELETE request y retorna success', async () => {
      mockAxiosInstance.delete.mockResolvedValue({
        data: { deleted: true },
      });

      const result = await apiClient.delete('/api/test/1');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ deleted: true });
      }
    });
  });

  describe('postPublic', () => {
    it('realiza POST público y retorna success', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { usuario: { id: 1 } },
      });

      const result = await apiClient.postPublic('/api/auth/google', { token: 'abc' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1 });
      }
    });

    it('usa transform personalizado si se proporciona', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { custom: { id: 1 } },
      });

      const result = await apiClient.postPublic(
        '/api/auth/google',
        { token: 'abc' },
        undefined,
        (data: any) => data.custom,
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: 1 });
      }
    });
  });

  describe('manejo de errores', () => {
    it('retorna ApiFailure cuando el request falla', async () => {
      mockAxiosInstance.get.mockRejectedValue(
        new ApiError('NOT_FOUND', 'Recurso no encontrado', 404),
      );

      const result = await apiClient.get('/api/test/999');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe('NOT_FOUND');
      }
    });

    it('convierte errores no-ApiError a ApiError', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network Error'));

      const result = await apiClient.get('/api/test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.message).toBeTruthy();
      }
    });

    it('maneja errores en postPublic', async () => {
      mockAxiosInstance.post.mockRejectedValue(
        new ApiError('VALIDATION_ERROR', 'Datos inválidos', 400),
      );

      const result = await apiClient.postPublic('/api/auth/google', {});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('maneja errores genéricos en postPublic', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Timeout'));

      const result = await apiClient.postPublic('/api/auth/google', {});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });
});
