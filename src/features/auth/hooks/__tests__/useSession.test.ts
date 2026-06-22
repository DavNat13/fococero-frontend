// src/features/auth/hooks/__tests__/useSession.test.ts

import { renderHook, act } from '@testing-library/react-native';
import { tokenUtils } from '../../utils/token.utils';

import { useSession } from '../useSession';

// --- Mocks ---
// All mutable test state MUST use `mock` (case-insensitive) prefix
let mockStoreValues: any = {
  isHydrated: true,
  status: 'authenticated',
  user: { id: 'user-1', rol: 'USUARIO' },
  firebaseToken: 'valid-token',
};

const mockLogout = jest.fn();
const mockSetAuthData = jest.fn();

jest.mock('../../model/auth.store', () => ({
  useAuthStore: Object.assign(
    (selector?: any) => {
      const full = {
        ...mockStoreValues,
        logout: mockLogout,
        setAuthData: mockSetAuthData,
      };
      return selector ? selector(full) : full;
    },
    {
      getState: jest.fn(() => mockStoreValues),
      setState: jest.fn((s: any) => {
        mockStoreValues = { ...mockStoreValues, ...s };
      }),
    },
  ),
}));

const mockGetIdTokenFn = jest.fn();
const mockCurrentUserObj = { getIdToken: mockGetIdTokenFn };
jest.mock('@core/config/firebase.config', () => ({
  getFirebaseAuth: jest.fn(() => ({
    currentUser: mockCurrentUserObj,
  })),
}));

const mockApiGetMe = jest.fn();
jest.mock('@entities/usuario', () => ({
  usuarioApi: {
    getMe: (...args: any[]) => mockApiGetMe(...args),
  },
}));

jest.mock('../../utils/token.utils', () => ({
  tokenUtils: {
    isValid: jest.fn(),
    needsRefresh: jest.fn().mockReturnValue(false),
  },
}));

describe('useSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockStoreValues = {
      isHydrated: true,
      status: 'authenticated',
      user: { id: 'user-1', rol: 'USUARIO' },
      firebaseToken: 'valid-token',
    };
    mockGetIdTokenFn.mockResolvedValue('fresh-token');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retorna isReady = true cuando está hidratado', () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.isReady).toBe(true);
  });

  it('retorna isAuthenticated = true para status authenticated', () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('retorna isAuthenticated = true para status guest', () => {
    mockStoreValues.status = 'guest';
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('retorna isAuthenticated = false para status unauthenticated', () => {
    mockStoreValues.status = 'unauthenticated';
    const { result } = renderHook(() => useSession());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('retorna isGuest = true para status guest', () => {
    mockStoreValues.status = 'guest';
    const { result } = renderHook(() => useSession());
    expect(result.current.isGuest).toBe(true);
  });

  it('verifica token válido y sincroniza sesión', async () => {
    jest.mocked(tokenUtils.isValid).mockReturnValue(true);
    mockApiGetMe.mockResolvedValue({
      success: true,
      data: { id: 'user-1', rol: 'USUARIO' },
    });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(mockApiGetMe).toHaveBeenCalled();
    expect(mockSetAuthData).toHaveBeenCalled();
    expect(result.current.isVerifying).toBe(false);
  });

  it('cierra sesión si token expiró', async () => {
    jest.mocked(tokenUtils.isValid).mockReturnValue(false);

    renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('loguea si getMe retorna UNAUTHORIZED', async () => {
    jest.mocked(tokenUtils.isValid).mockReturnValue(true);
    mockApiGetMe.mockResolvedValue({
      success: false,
      error: { code: 'UNAUTHORIZED' },
    });

    renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('no hace nada si no está hidratado', async () => {
    mockStoreValues.isHydrated = false;

    const { result: _result } = renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(mockApiGetMe).not.toHaveBeenCalled();
  });

  it('configura refresh periódico para authenticated', async () => {
    jest.mocked(tokenUtils.isValid).mockReturnValue(true);
    jest.mocked(tokenUtils.needsRefresh).mockReturnValueOnce(true);
    mockApiGetMe.mockResolvedValue({
      success: true,
      data: { id: 'user-1', rol: 'USUARIO' },
    });

    renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    // Avanzar 30 min
    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
    });

    expect(mockGetIdTokenFn).toHaveBeenCalled();
  });

  it('no refresca si status no es authenticated', async () => {
    mockStoreValues.status = 'unauthenticated';

    renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(30 * 60 * 1000);
    });

    expect(mockGetIdTokenFn).not.toHaveBeenCalled();
  });

  it('maneja error en sincronización sin lanzar excepción', async () => {
    jest.mocked(tokenUtils.isValid).mockReturnValue(true);
    mockApiGetMe.mockRejectedValue(new Error('Error de red'));

    const { result } = renderHook(() => useSession());

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.isVerifying).toBe(false);
  });
});
