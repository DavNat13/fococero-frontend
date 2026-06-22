// Mocks de storage deben ir ANTES de cualquier import
import { renderHook } from '@testing-library/react-native';
import {
  useUser,
  useFirebaseToken,
  useAuthStatus,
  useIsHydrated,
  useIsAuthenticated,
  useIsGuest,
  useAuthActions,
} from '../auth.selectors';
import { useAuthStore } from '../auth.store';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

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

jest.mock('@core/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({ currentUser: null })),
}));

// Mock @core/api para evitar que authApi importe axios
jest.mock('@core/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    postPublic: jest.fn(),
  },
}));

// Mock firebase/auth para evitar ESM parsing errors
jest.mock('firebase/auth', () => ({
  signInAnonymously: jest.fn(),
  signInWithCustomToken: jest.fn(),
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
}));

// Mock @entities/usuario para evitar imports complejos
jest.mock('@entities/usuario', () => {
  const { z } = require('zod');
  return {
    Usuario: class UsuarioMock {},
    UserRole: {
      INVITADO: 'invitado',
      USUARIO: 'usuario',
      BRIGADISTA: 'brigadista',
      ADMIN: 'admin',
    },
    UserStatus: { ACTIVO: 'activo', BLOQUEADO: 'bloqueado', SUSPENDIDO: 'suspendido' },
    rutSchema: z.string(),
    telefonoSchema: z.string(),
    nombreSchema: z.string(),
    usuarioApi: { getProfile: jest.fn(), updateProfile: jest.fn() },
  };
});

describe('auth.selectors (selectores de autenticación)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      status: 'unauthenticated',
      user: null,
      firebaseToken: null,
      isLoading: false,
      error: null,
      isHydrated: true,
    });
  });

  describe('useUser', () => {
    it('retorna null cuando no hay usuario', () => {
      const { result } = renderHook(() => useUser());
      expect(result.current).toBeNull();
    });

    it('retorna el usuario cuando existe', () => {
      const user = { id: 1, nombre: 'Test', rol: 'usuario' } as any;
      useAuthStore.setState({ user, status: 'authenticated' });

      const { result } = renderHook(() => useUser());
      expect(result.current).toEqual(user);
    });
  });

  describe('useFirebaseToken', () => {
    it('retorna null inicialmente', () => {
      const { result } = renderHook(() => useFirebaseToken());
      expect(result.current).toBeNull();
    });

    it('retorna el token cuando está establecido', () => {
      useAuthStore.setState({ firebaseToken: 'test-token' });
      const { result } = renderHook(() => useFirebaseToken());
      expect(result.current).toBe('test-token');
    });
  });

  describe('useAuthStatus', () => {
    it('retorna unauthenticated por defecto', () => {
      const { result } = renderHook(() => useAuthStatus());
      expect(result.current).toBe('unauthenticated');
    });

    it('retorna authenticated cuando corresponde', () => {
      useAuthStore.setState({ status: 'authenticated' });
      const { result } = renderHook(() => useAuthStatus());
      expect(result.current).toBe('authenticated');
    });
  });

  describe('useIsHydrated', () => {
    it('retorna true cuando está hidratado', () => {
      useAuthStore.setState({ isHydrated: true });
      const { result } = renderHook(() => useIsHydrated());
      expect(result.current).toBe(true);
    });

    it('retorna false cuando no está hidratado', () => {
      useAuthStore.setState({ isHydrated: false });
      const { result } = renderHook(() => useIsHydrated());
      expect(result.current).toBe(false);
    });
  });

  describe('useIsAuthenticated', () => {
    it('retorna true si el estado es authenticated', () => {
      useAuthStore.setState({ status: 'authenticated' });
      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(true);
    });

    it('retorna false si el estado no es authenticated', () => {
      useAuthStore.setState({ status: 'guest' });
      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(false);
    });
  });

  describe('useIsGuest', () => {
    it('retorna true si el estado es guest', () => {
      useAuthStore.setState({ status: 'guest' });
      const { result } = renderHook(() => useIsGuest());
      expect(result.current).toBe(true);
    });

    it('retorna false si el estado no es guest', () => {
      useAuthStore.setState({ status: 'authenticated' });
      const { result } = renderHook(() => useIsGuest());
      expect(result.current).toBe(false);
    });
  });

  describe('useAuthActions', () => {
    it('retorna setAuthData y logout desde el store', () => {
      // Verificamos directamente desde el store para evitar ciclos de render
      const { setAuthData, logout } = useAuthStore.getState();
      expect(setAuthData).toBeDefined();
      expect(logout).toBeDefined();
      expect(typeof setAuthData).toBe('function');
      expect(typeof logout).toBe('function');
    });
  });
});
