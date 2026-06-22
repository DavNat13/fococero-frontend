// src/features/auth/hooks/__tests__/useGoogleAuth.test.ts

import { renderHook, act } from '@testing-library/react-native';

import { useGoogleAuth } from '../useGoogleAuth';

// --- Mocks (must be before any imports) ---
// IMPORTANT: jest.mock factories are hoisted above all code.
// Object properties are evaluated at factory time, so direct variable references
// will be undefined. Use wrapper functions for lazy evaluation.

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: (...args: any[]) => mockGoogleSigninInstance.configure(...args),
    signOut: (...args: any[]) => mockGoogleSigninInstance.signOut(...args),
    hasPlayServices: (...args: any[]) => mockGoogleSigninInstance.hasPlayServices(...args),
    signIn: (...args: any[]) => mockGoogleSigninInstance.signIn(...args),
  },
  statusCodes: {
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  },
}));

const mockGoogleSigninInstance = {
  configure: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signIn: jest.fn(),
};

jest.mock('firebase/auth', () => {
  mockSignInWithCredentialFn = jest.fn();
  mockSignOutFn = jest.fn();
  return {
    GoogleAuthProvider: { credential: jest.fn((token: any) => ({ token })) },
    signInWithCredential: (...args: any[]) => mockSignInWithCredentialFn(...args),
    signOut: (...args: any[]) => mockSignOutFn(...args),
  };
});

let mockSignInWithCredentialFn: jest.Mock;
let mockSignOutFn: jest.Mock;

jest.mock('@core/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({})),
}));

jest.mock('@core/config/env.config', () => ({
  ENV: {
    EXPO_PUBLIC_FIREBASE_CLIENT_ID: 'test-client-id-123',
    EXPO_PUBLIC_GOOGLE_CLIENT_ID: '',
  },
}));

const mockRegisterGoogleFn = jest.fn();
jest.mock('../../api/auth.api', () => ({
  authApi: { registerGoogle: (...args: any[]) => mockRegisterGoogleFn(...args) },
}));

let mockStoreState: Record<string, any> = { firebaseToken: null };
const mockSetAuthDataHook = jest.fn();
jest.mock('../../model/auth.store', () => ({
  useAuthStore: Object.assign(
    (selector?: any) => {
      const full = { firebaseToken: null, setAuthData: mockSetAuthDataHook, ...mockStoreState };
      return selector ? selector(full) : full;
    },
    {
      getState: jest.fn(() => mockStoreState),
      setState: jest.fn((s: any) => {
        mockStoreState = { ...mockStoreState, ...s };
      }),
    },
  ),
}));

describe('useGoogleAuth', () => {
  beforeEach(() => {
    // Don't use clearAllMocks as it resets mock implementations across mocks
    // causing test pollution. Manually reset only what we need.
    jest.clearAllTimers();
    mockStoreState = { firebaseToken: null };
    mockGoogleSigninInstance.signIn.mockReset();
    mockGoogleSigninInstance.signOut.mockReset().mockResolvedValue(undefined);
    mockGoogleSigninInstance.hasPlayServices.mockReset().mockResolvedValue(true);
    mockGoogleSigninInstance.configure.mockClear();
  });

  it('retorna estado inicial', () => {
    const { result } = renderHook(() => useGoogleAuth());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
  });

  it('signIn configura GoogleSignin y maneja flujo exitoso', async () => {
    const mockGetIdToken = jest
      .fn()
      .mockResolvedValueOnce('firebase-token-123')
      .mockResolvedValueOnce('refreshed-token-456');

    mockGoogleSigninInstance.signIn.mockResolvedValue({
      type: 'success',
      data: { idToken: 'google-id-token' },
    });
    mockSignInWithCredentialFn.mockResolvedValue({
      user: { getIdToken: mockGetIdToken },
    });
    mockRegisterGoogleFn.mockResolvedValue({
      success: true,
      data: { usuario: { id: 'user-1', rol: 'USUARIO' } },
    });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(mockGoogleSigninInstance.configure).toHaveBeenCalledWith({
      webClientId: 'test-client-id-123',
      offlineAccess: false,
    });
    expect(mockGoogleSigninInstance.signOut).toHaveBeenCalled();
    expect(mockGoogleSigninInstance.hasPlayServices).toHaveBeenCalledWith({
      showPlayServicesUpdateDialog: true,
    });
    expect(mockGoogleSigninInstance.signIn).toHaveBeenCalled();
    expect(mockSignInWithCredentialFn).toHaveBeenCalled();
    expect(mockRegisterGoogleFn).toHaveBeenCalledWith({ googleToken: 'firebase-token-123' });
    expect(mockSetAuthDataHook).toHaveBeenCalledWith(
      { id: 'user-1', rol: 'USUARIO' },
      'refreshed-token-456',
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('signIn maneja cancelación de Google', async () => {
    mockGoogleSigninInstance.signIn.mockResolvedValue({ type: 'cancelled' });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('Inicio de sesión cancelado');
    expect(result.current.isLoading).toBe(false);
  });

  it('signIn maneja falta de idToken', async () => {
    mockGoogleSigninInstance.signIn.mockResolvedValue({
      type: 'success',
      data: { idToken: null },
    });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('No se pudo obtener el token de Google');
  });

  it('signIn maneja error del API backend', async () => {
    const mockGetIdToken = jest.fn().mockResolvedValue('firebase-token-123');
    mockGoogleSigninInstance.signIn.mockResolvedValue({
      type: 'success',
      data: { idToken: 'google-id-token' },
    });
    mockSignInWithCredentialFn.mockResolvedValue({
      user: { getIdToken: mockGetIdToken },
    });
    mockRegisterGoogleFn.mockResolvedValue({
      success: false,
      error: { message: 'Error del servidor' },
    });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('Error del servidor');
  });

  it('signIn maneja error IN_PROGRESS', async () => {
    mockGoogleSigninInstance.signIn.mockRejectedValue({ code: 'IN_PROGRESS' });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('Inicio de sesión en progreso');
  });

  it('signIn maneja error PLAY_SERVICES_NOT_AVAILABLE', async () => {
    mockGoogleSigninInstance.signIn.mockRejectedValue({ code: 'PLAY_SERVICES_NOT_AVAILABLE' });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('Google Play Services no está disponible');
  });

  it('signIn maneja error genérico', async () => {
    mockGoogleSigninInstance.signIn.mockRejectedValue(new Error('Error desconocido'));

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('Error al iniciar sesión con Google');
  });

  it('signOut llama a GoogleSignin.signOut y firebase signOut', async () => {
    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockGoogleSigninInstance.signOut).toHaveBeenCalled();
    expect(mockSignOutFn).toHaveBeenCalled();
  });

  it('signOut maneja errores silenciosamente', async () => {
    mockGoogleSigninInstance.signOut.mockRejectedValue(new Error('Error en signOut'));

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await expect(result.current.signOut()).resolves.not.toThrow();
    });
  });

  it('api falla sin error.message especifico', async () => {
    const mockGetIdToken = jest.fn().mockResolvedValue('firebase-token-123');
    mockGoogleSigninInstance.signIn.mockResolvedValue({
      type: 'success',
      data: { idToken: 'google-id-token' },
    });
    mockSignInWithCredentialFn.mockResolvedValue({
      user: { getIdToken: mockGetIdToken },
    });
    mockRegisterGoogleFn.mockResolvedValue({
      success: false,
      error: { message: undefined },
    });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      try {
        await result.current.signIn();
      } catch (e) {
        console.log('UNEXPECTED THROW in signIn:', e);
      }
    });

    console.log('Error actual:', result.current.error);
    expect(result.current.error).toBe('Error al conectar con Google');
  });

  it('apiResponse sin usuario en data cae en else', async () => {
    const mockGetIdToken = jest.fn().mockResolvedValue('firebase-token-123');
    mockGoogleSigninInstance.signIn.mockResolvedValue({
      type: 'success',
      data: { idToken: 'google-id-token' },
    });
    mockSignInWithCredentialFn.mockResolvedValue({
      user: { getIdToken: mockGetIdToken },
    });
    mockRegisterGoogleFn.mockResolvedValue({
      success: true,
      data: { usuario: null },
    });

    const { result } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBe('Error al conectar con Google');
  });
});
