/* eslint-disable import/first */
// Mocks externos - deben ir antes de los imports

// Mock AsyncStorage primero porque es requerido por @core/offline
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(false)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@core/offline', () => ({
  secureZustandAdapter: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
  wipeAllStorage: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../api/auth.api', () => ({
  authApi: {
    login: jest.fn(),
    registerGuest: jest.fn(),
  },
}));

jest.mock('../../utils/token.utils', () => ({
  tokenUtils: {
    isValid: jest.fn(),
    decodePayload: jest.fn(),
    needsRefresh: jest.fn(),
    getLifetimeDiagnostic: jest.fn(),
  },
}));

jest.mock('@core/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));

jest.mock('firebase/auth', () => ({
  signInAnonymously: jest.fn(),
  signInWithCustomToken: jest.fn(),
}));

jest.mock('@entities/usuario', () => ({
  UserRole: {
    INVITADO: 'invitado',
    USUARIO: 'usuario',
    BRIGADISTA: 'brigadista',
    ADMIN: 'admin',
  },
}));

// El store debe importarse DESPUÉS de los mocks
import { wipeAllStorage } from '@core/offline';
import { signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { authApi } from '../../api/auth.api';
import { tokenUtils } from '../../utils/token.utils';
import { useAuthStore } from '../auth.store';

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockTokenUtils = tokenUtils as jest.Mocked<typeof tokenUtils>;

describe('useAuthStore (almacén de autenticación)', () => {
  beforeEach(() => {
    // Resetear el store antes de cada test
    useAuthStore.setState({
      status: 'unauthenticated',
      user: null,
      firebaseToken: null,
      isLoading: false,
      error: null,
      isHydrated: false,
    });
    jest.clearAllMocks();
  });

  describe('estado inicial', () => {
    it('inicializa con estado unauthenticated', () => {
      const state = useAuthStore.getState();
      expect(state.status).toBe('unauthenticated');
      expect(state.user).toBeNull();
      expect(state.firebaseToken).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setAuthData', () => {
    it('establece datos de usuario autenticado', () => {
      const user = { id: 1, nombre: 'Test', rol: 'usuario' } as any;
      useAuthStore.getState().setAuthData(user, 'token123');

      const state = useAuthStore.getState();
      expect(state.status).toBe('authenticated');
      expect(state.user).toEqual(user);
      expect(state.firebaseToken).toBe('token123');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isHydrated).toBe(true);
    });

    it('establece estado guest cuando se especifica', () => {
      const user = { id: 2, nombre: 'Invitado', rol: 'invitado' } as any;
      useAuthStore.getState().setAuthData(user, 'guest-token', 'guest');

      const state = useAuthStore.getState();
      expect(state.status).toBe('guest');
      expect(state.user).toEqual(user);
      expect(state.firebaseToken).toBe('guest-token');
    });

    it('acepta firebaseToken opcional', () => {
      const user = { id: 1, nombre: 'Test' } as any;
      useAuthStore.getState().setAuthData(user);
      expect(useAuthStore.getState().firebaseToken).toBeNull();
    });
  });

  describe('clearError', () => {
    it('limpia el error', () => {
      useAuthStore.setState({ error: 'Algo salió mal' });
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('login', () => {
    const credentials = { rut: '12345678-9', password: 'password123' };

    it('loguea exitosamente con credenciales válidas', async () => {
      const usuario = { id: 1, nombre: 'Juan', rol: 'usuario' };
      const firebaseToken = 'custom-token';
      const idToken = 'id-token-real';

      mockAuthApi.login.mockResolvedValue({
        success: true,
        data: { usuario, firebaseToken },
      } as any);

      (signInWithCustomToken as jest.Mock).mockResolvedValue({
        user: { getIdToken: jest.fn().mockResolvedValue(idToken) },
      });

      const result = await useAuthStore.getState().login(credentials);

      expect(result).toBe(true);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(usuario);
      expect(state.firebaseToken).toBe(idToken);
      expect(state.status).toBe('authenticated');
      expect(state.isLoading).toBe(false);
    });

    it('maneja error del backend en login', async () => {
      mockAuthApi.login.mockResolvedValue({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Credenciales inválidas' },
      } as any);

      const result = await useAuthStore.getState().login(credentials);

      expect(result).toBe(false);
      const state = useAuthStore.getState();
      expect(state.error).toBe('Credenciales inválidas');
      expect(state.isLoading).toBe(false);
    });

    it('maneja error sin mensaje en la respuesta', async () => {
      mockAuthApi.login.mockResolvedValue({
        success: false,
        error: {},
      } as any);

      const result = await useAuthStore.getState().login(credentials);
      expect(result).toBe(false);
      expect(useAuthStore.getState().error).toBe('Error al iniciar sesión');
    });

    it('maneja excepción inesperada durante login', async () => {
      mockAuthApi.login.mockRejectedValue(new Error('Error de red'));

      const result = await useAuthStore.getState().login(credentials);
      expect(result).toBe(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('resetea el estado y elimina almacenamiento', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: 1, nombre: 'Test' } as any,
        firebaseToken: 'token',
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.status).toBe('unauthenticated');
      expect(state.user).toBeNull();
      expect(state.firebaseToken).toBeNull();
      expect(wipeAllStorage).toHaveBeenCalled();
    });

    it('no lanza error si wipeAllStorage falla', async () => {
      (wipeAllStorage as jest.Mock).mockRejectedValue(new Error('Storage error'));

      useAuthStore.setState({
        status: 'authenticated',
        user: { id: 1 } as any,
        firebaseToken: 'token',
      });

      await expect(useAuthStore.getState().logout()).resolves.not.toThrow();

      const state = useAuthStore.getState();
      expect(state.status).toBe('unauthenticated');
    });
  });

  describe('checkSession', () => {
    it('cierra sesión si el token no es válido', () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: 1 } as any,
        firebaseToken: 'expired-token',
      });
      mockTokenUtils.isValid.mockReturnValue(false);

      const logoutSpy = jest.spyOn(useAuthStore.getState(), 'logout');
      useAuthStore.getState().checkSession();
      expect(logoutSpy).toHaveBeenCalled();
    });

    it('no cierra sesión si el token es válido', () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: 1 } as any,
        firebaseToken: 'valid-token',
      });
      mockTokenUtils.isValid.mockReturnValue(true);

      const logoutSpy = jest.spyOn(useAuthStore.getState(), 'logout');
      useAuthStore.getState().checkSession();
      expect(logoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerData = {
      rut: '12345678-9' as any,
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '+56912345678',
    };

    it('registra y autentica invitado exitosamente con token del backend', async () => {
      const usuario = { id: 1, nombre: 'Juan', rol: 'invitado' };
      const firebaseToken = 'custom-token';
      const idToken = 'id-token-real';

      (signInAnonymously as jest.Mock).mockResolvedValue({
        user: {
          getIdToken: jest.fn().mockResolvedValue('anonymous-token'),
          uid: 'firebase-uid-123',
        },
      });

      mockAuthApi.registerGuest.mockResolvedValue({
        success: true,
        data: { usuario, firebaseToken },
      } as any);

      (signInWithCustomToken as jest.Mock).mockResolvedValue({
        user: { getIdToken: jest.fn().mockResolvedValue(idToken) },
      });

      const result = await useAuthStore.getState().register(registerData);

      expect(result).toBe(true);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(usuario);
      expect(state.firebaseToken).toBe(idToken);
      expect(state.status).toBe('guest');
    });

    it('registra invitado sin token del backend (usa token anónimo)', async () => {
      const usuario = { id: 1, rol: 'invitado' };
      const anonymousToken = 'anonymous-token';

      (signInAnonymously as jest.Mock).mockResolvedValue({
        user: {
          getIdToken: jest.fn().mockResolvedValue(anonymousToken),
          uid: 'firebase-uid-123',
        },
      });

      mockAuthApi.registerGuest.mockResolvedValue({
        success: true,
        data: { usuario, firebaseToken: undefined },
      } as any);

      const result = await useAuthStore.getState().register(registerData);

      expect(result).toBe(true);
      const state = useAuthStore.getState();
      expect(state.firebaseToken).toBe(anonymousToken);
      expect(state.status).toBe('guest');
    });

    it('maneja error del backend en registro', async () => {
      (signInAnonymously as jest.Mock).mockResolvedValue({
        user: {
          getIdToken: jest.fn().mockResolvedValue('tok'),
          uid: 'uid',
        },
      });

      mockAuthApi.registerGuest.mockResolvedValue({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'RUT ya registrado' },
      } as any);

      const result = await useAuthStore.getState().register(registerData);
      expect(result).toBe(false);
    });

    it('maneja error sin mensaje en registro', async () => {
      (signInAnonymously as jest.Mock).mockResolvedValue({
        user: {
          getIdToken: jest.fn().mockResolvedValue('tok'),
          uid: 'uid',
        },
      });

      mockAuthApi.registerGuest.mockResolvedValue({
        success: false,
        error: {},
      } as any);

      const result = await useAuthStore.getState().register(registerData);
      expect(result).toBe(false);
    });

    it('maneja excepción durante registro', async () => {
      (signInAnonymously as jest.Mock).mockRejectedValue(new Error('Firebase error'));

      const result = await useAuthStore.getState().register(registerData);
      expect(result).toBe(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('refreshGuestToken', () => {
    it('renueva token anónimo si no hay currentUser', async () => {
      (signInAnonymously as jest.Mock).mockResolvedValue({
        user: { getIdToken: jest.fn().mockResolvedValue('new-anonymous-token') },
      });

      await useAuthStore.getState().refreshGuestToken();

      expect(signInAnonymously).toHaveBeenCalled();
      expect(useAuthStore.getState().firebaseToken).toBe('new-anonymous-token');
    });

    it('refresca token del usuario actual si existe', async () => {
      const mockGetIdToken = jest.fn().mockResolvedValue('refreshed-token');

      const getFirebaseAuth = require('@core/config/firebase.config').getFirebaseAuth;
      getFirebaseAuth.mockReturnValue({
        currentUser: { getIdToken: mockGetIdToken },
      });

      useAuthStore.setState({ firebaseToken: 'old-token' });
      await useAuthStore.getState().refreshGuestToken();

      expect(mockGetIdToken).toHaveBeenCalledWith(true);
      expect(useAuthStore.getState().firebaseToken).toBe('refreshed-token');
    });

    it('no lanza error si falla el refresh', async () => {
      (signInAnonymously as jest.Mock).mockRejectedValue(new Error('Error'));

      await expect(useAuthStore.getState().refreshGuestToken()).resolves.not.toThrow();
    });
  });
});
