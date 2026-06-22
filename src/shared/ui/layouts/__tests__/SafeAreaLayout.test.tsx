// src/shared/ui/layouts/__tests__/SafeAreaLayout.test.tsx

// Use string mocks to avoid CSS interop issues with RN requires inside jest.mock
import React, { ComponentType } from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SafeAreaLayout } from '../SafeAreaLayout';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

jest.mock('../FocusAwareStatusBar', () => ({
  FocusAwareStatusBar: 'FocusAwareStatusBar',
}));

describe('SafeAreaLayout', () => {
  it('renderiza children correctamente', () => {
    const { getByText } = render(
      <SafeAreaLayout>
        <Text>Contenido seguro</Text>
      </SafeAreaLayout>,
    );
    expect(getByText('Contenido seguro')).toBeDefined();
  });

  it('renderiza con variante background por defecto', () => {
    const { UNSAFE_getByType } = render(
      <SafeAreaLayout>
        <Text>Test</Text>
      </SafeAreaLayout>,
    );
    expect(UNSAFE_getByType('SafeAreaView' as unknown as ComponentType)).toBeDefined();
  });

  it('renderiza con variante card', () => {
    const { getByText } = render(
      <SafeAreaLayout variant="card">
        <Text>Card variant</Text>
      </SafeAreaLayout>,
    );
    expect(getByText('Card variant')).toBeDefined();
  });

  it('renderiza con centered true', () => {
    const { getByText } = render(
      <SafeAreaLayout centered={true}>
        <Text>Centered</Text>
      </SafeAreaLayout>,
    );
    expect(getByText('Centered')).toBeDefined();
  });

  it('renderiza con FocusAwareStatusBar', () => {
    const { UNSAFE_getByType } = render(
      <SafeAreaLayout>
        <Text>Test</Text>
      </SafeAreaLayout>,
    );
    expect(UNSAFE_getByType('FocusAwareStatusBar' as unknown as ComponentType)).toBeDefined();
  });
});
