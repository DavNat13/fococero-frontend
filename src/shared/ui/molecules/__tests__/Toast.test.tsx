// src/shared/ui/molecules/__tests__/Toast.test.tsx

jest.mock('react-native-reanimated', () => {
  // Return simple mock without RN dependencies
  return {
    default: { View: 'AnimatedView' },
    FadeInUp: { springify: function () { return { damping: function () { return {}; } }; } },
    FadeOutUp: {},
    View: 'AnimatedView',
  };
});

// Mock icons as string components
jest.mock('../../icons', () => ({
  Icon: 'Icon',
  Icons: {
    CheckCircle2: 'CheckCircle2',
    AlertTriangle: 'AlertTriangle',
    AlertOctagon: 'AlertOctagon',
    Bell: 'Bell',
  },
}));

import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Toast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('no renderiza cuando isVisible es false', () => {
    const { queryByText } = render(
      <Toast message="Test" isVisible={false} onHide={jest.fn()} />,
    );
    expect(queryByText('Test')).toBeNull();
  });

  it('renderiza cuando isVisible es true', () => {
    const { getByText } = render(
      <Toast message="Mensaje de prueba" isVisible={true} onHide={jest.fn()} />,
    );
    expect(getByText('Mensaje de prueba')).toBeDefined();
  });

  it('llama onHide después de la duración predeterminada', () => {
    const onHide = jest.fn();
    render(<Toast message="Test" isVisible={true} onHide={onHide} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('limpia el timer al desmontar', () => {
    const onHide = jest.fn();
    const { unmount } = render(
      <Toast message="Test" isVisible={true} onHide={onHide} />,
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onHide).not.toHaveBeenCalled();
  });
});
