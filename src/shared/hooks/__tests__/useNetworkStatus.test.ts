// src/shared/hooks/__tests__/useNetworkStatus.test.ts

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

import { renderHook, act } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkStatus } from '../useNetworkStatus';

describe('useNetworkStatus', () => {
  it('retorna isConnected como true inicialmente', () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation(() => jest.fn());

    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isConnected).toBe(true);
  });

  it('actualiza isConnected cuando cambia el estado de red', () => {
    const unsubscribe = jest.fn();
    let listener: (state: { isConnected: boolean | null }) => void;
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb) => {
      listener = cb;
      return unsubscribe;
    });

    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      listener({ isConnected: false });
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('usa null como connected si el estado es null', () => {
    const unsubscribe = jest.fn();
    let listener: (state: { isConnected: boolean | null }) => void;
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb) => {
      listener = cb;
      return unsubscribe;
    });

    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      listener({ isConnected: null });
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('se desuscribe al desmontar', () => {
    const unsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
