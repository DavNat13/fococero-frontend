import { authApi, type LoginCredentials } from '../auth.api';
import { apiClient } from '@core/api';
import type { RegisterGuestPayload } from '../../model/auth.types';

jest.mock('@core/api', () => {
  const mockApiClient = {
    postPublic: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return {
    apiClient: mockApiClient,
    ApiResponse: jest.fn(),
  };
});

const mockPostPublic = apiClient.postPublic as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockGet = apiClient.get as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

describe('authApi (API de autenticación)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('llama a postPublic con las credenciales correctas', async () => {
      const credentials: LoginCredentials = { rut: '12345678-9', password: 'pass123' };
      const mockResponse = { success: true, data: { usuario: { id: 1 }, firebaseToken: 'tok' } };
      mockPostPublic.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockPostPublic).toHaveBeenCalledWith(
        '/api/auth/login',
        credentials,
        undefined,
        expect.any(Function),
      );
      expect(result).toEqual(mockResponse);
    });

    it('propaga errores del backend', async () => {
      const mockError = {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Credenciales inválidas' },
      };
      mockPostPublic.mockResolvedValue(mockError);

      const result = await authApi.login({ rut: 'bad', password: 'bad' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Credenciales inválidas');
      }
    });
  });

  describe('registerGuest', () => {
    it('llama a postPublic con el payload correcto', async () => {
      const payload: RegisterGuestPayload = {
        rut: '12345678-9',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+56912345678',
      };
      const mockResponse = { success: true, data: { usuario: { id: 1 }, firebaseToken: 'tok' } };
      mockPostPublic.mockResolvedValue(mockResponse);

      const result = await authApi.registerGuest(payload);

      expect(mockPostPublic).toHaveBeenCalledWith(
        '/api/auth/register-guest',
        payload,
        undefined,
        expect.any(Function),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerGoogle', () => {
    it('llama a postPublic con el token de Google', async () => {
      const googlePayload = { googleToken: 'firebase-token-123' };
      const mockResponse = { success: true, data: { usuario: { id: 1 }, firebaseToken: 'tok' } };
      mockPostPublic.mockResolvedValue(mockResponse);

      const result = await authApi.registerGoogle(googlePayload);

      expect(mockPostPublic).toHaveBeenCalledWith(
        '/api/auth/google',
        { token: googlePayload.googleToken },
        undefined,
        expect.any(Function),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('setPassword', () => {
    it('llama a post con la contraseña', async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await authApi.setPassword({ password: 'newpass123' });

      expect(mockPost).toHaveBeenCalledWith('/api/auth/upgrade-account', {
        password: 'newpass123',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('convertirCuenta', () => {
    it('llama a patch sin payload cuando no se envía', async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      mockPatch.mockResolvedValue(mockResponse);

      const result = await authApi.convertirCuenta();

      expect(mockPatch).toHaveBeenCalledWith('/api/auth/me/convertir', undefined);
      expect(result).toEqual(mockResponse);
    });

    it('llama a patch con contraseña cuando se envía', async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      mockPatch.mockResolvedValue(mockResponse);

      const result = await authApi.convertirCuenta({ password: 'pass123' });

      expect(mockPatch).toHaveBeenCalledWith('/api/auth/me/convertir', { password: 'pass123' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPerfilBrigadista', () => {
    it('llama a get con la ruta correcta', async () => {
      const mockResponse = { success: true, data: { usuario: { id: 1, perfil_brigadista: null } } };
      mockGet.mockResolvedValue(mockResponse);

      const result = await authApi.getPerfilBrigadista();

      expect(mockGet).toHaveBeenCalledWith('/api/auth/me/perfil-brigadista');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePerfilBrigadista', () => {
    it('llama a patch con el payload', async () => {
      const payload = { organismo: 'Bomberos', rango: 'Capitán' };
      const mockResponse = { success: true, data: { usuario: { id: 1 } } };
      mockPatch.mockResolvedValue(mockResponse);

      const result = await authApi.updatePerfilBrigadista(payload);

      expect(mockPatch).toHaveBeenCalledWith('/api/auth/me/perfil-brigadista', payload);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerFull', () => {
    it('lanza error porque no está habilitado', async () => {
      await expect(authApi.registerFull({} as any)).rejects.toThrow(
        'registerFull no está habilitado en el frontend',
      );
    });
  });
});
