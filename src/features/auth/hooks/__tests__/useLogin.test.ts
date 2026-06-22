// src/features/auth/hooks/__tests__/useLogin.test.ts

import { renderHook, act } from '@testing-library/react-native';

import { useLogin } from '../useLogin';

const mockRegisterGuest = jest.fn();
jest.mock('../../api/auth.api', () => ({
  authApi: { registerGuest: (...args: any[]) => mockRegisterGuest(...args) },
}));

const mockSetAuthData = jest.fn();
jest.mock('../../model/auth.selectors', () => ({
  useAuthActions: jest.fn(() => ({ setAuthData: mockSetAuthData })),
}));

const mockCreateOptimisticUser = jest.fn();
const mockQueueRegister = jest.fn();
jest.mock('../../offline-strategy', () => ({
  authOfflineStrategy: {
    createOptimisticUser: (...args: any[]) => mockCreateOptimisticUser(...args),
    queueRegister: (...args: any[]) => mockQueueRegister(...args),
  },
}));

const fakeFormData = {
  nombre: 'Test',
  apellido: 'Apellido',
  rut: '11.111.111-1' as any,
  telefono: '+56911111111',
};

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna estado inicial', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.loginAsGuest).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('loginAsGuest exitoso llama a registerGuest y setAuthData', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: true,
      data: { usuario: { id: 'guest-1' }, firebaseToken: 'token-123' },
    });

    const { result } = renderHook(() => useLogin());

    let success = false;
    await act(async () => {
      success = await result.current.loginAsGuest(fakeFormData);
    });

    expect(success).toBe(true);
    expect(mockRegisterGuest).toHaveBeenCalledWith(fakeFormData);
    expect(mockSetAuthData).toHaveBeenCalledWith({ id: 'guest-1' }, 'token-123');
    expect(result.current.isSuccess).toBe(true);
  });

  it('loginAsGuest retorna false si ya está submitting', async () => {
    // Usamos una promesa que nunca se resuelve para la primera llamada
    let resolvePromise: (value: any) => void = () => {};
    mockRegisterGuest.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const { result } = renderHook(() => useLogin());

    // Iniciamos la primera llamada (sin await para que quede colgada)
    act(() => {
      result.current.loginAsGuest(fakeFormData);
    });

    // La segunda llamada debe retornar false inmediatamente (status === 'submitting')
    let secondResult = true;
    await act(async () => {
      secondResult = await result.current.loginAsGuest(fakeFormData);
    });

    expect(secondResult).toBe(false);

    // Resolvemos la primera llamada para limpiar
    await act(async () => {
      resolvePromise({ success: true, data: { usuario: { id: 'guest-1' }, firebaseToken: 't' } });
    });
  });

  it('loginAsGuest activa offline strategy en NETWORK_ERROR', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: { code: 'NETWORK_ERROR' },
    });
    const optimisticUser = { id: 'optimistic-1', name: 'Test' };
    mockCreateOptimisticUser.mockReturnValue(optimisticUser);

    const { result } = renderHook(() => useLogin());

    let success = false;
    await act(async () => {
      success = await result.current.loginAsGuest(fakeFormData);
    });

    expect(success).toBe(true);
    expect(mockCreateOptimisticUser).toHaveBeenCalledWith(fakeFormData);
    expect(mockSetAuthData).toHaveBeenCalledWith(optimisticUser);
    expect(mockQueueRegister).toHaveBeenCalledWith(fakeFormData);
    expect(result.current.isSuccess).toBe(true);
  });

  it('loginAsGuest maneja VALIDATION_ERROR', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'RUT inválido' },
    });

    const { result } = renderHook(() => useLogin());

    let success = false;
    await act(async () => {
      success = await result.current.loginAsGuest(fakeFormData);
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('El RUT o el teléfono no cumplen con el formato oficial.');
    expect(result.current.isLoading).toBe(false);
  });

  it('loginAsGuest maneja UNAUTHORIZED', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: { code: 'UNAUTHORIZED' },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginAsGuest(fakeFormData);
    });

    expect(result.current.error).toBe('Credenciales inválidas o sesión expirada.');
  });

  it('loginAsGuest maneja error sin code', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: { message: 'Error interno' },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginAsGuest(fakeFormData);
    });

    expect(result.current.error).toBe('Error interno');
  });

  it('loginAsGuest maneja error sin error object', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: undefined,
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginAsGuest(fakeFormData);
    });

    expect(result.current.error).toBe('Error interno inesperado.');
  });

  it('reset restablece estado a idle', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: { code: 'VALIDATION_ERROR' },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginAsGuest(fakeFormData);
    });

    expect(result.current.error).not.toBeNull();

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('loginAsGuest maneja CONTRACT_BREACH', async () => {
    mockRegisterGuest.mockResolvedValue({
      success: false,
      error: { code: 'CONTRACT_BREACH' },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.loginAsGuest(fakeFormData);
    });

    expect(result.current.error).toBe(
      'Inconsistencia de datos con el servidor. Reporte este error.',
    );
  });
});
