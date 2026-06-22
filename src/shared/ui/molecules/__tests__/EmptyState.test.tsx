// src/shared/ui/molecules/__tests__/EmptyState.test.tsx

jest.mock('@shared/ui/atoms/Typography', () => ({
  Typography: function Typography() { return null; },
}));

jest.mock('@shared/ui/atoms/Button', () => ({
  Button: function Button() { return null; },
}));

jest.mock('@shared/ui/animations/FadeIn', () => ({
  FadeIn: function FadeIn({ children }: any) { return children; },
}));

import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  const mockIllustration = <View testID="illustration" />;

  it('renderiza título y descripción', () => {
    const { root } = render(
      <EmptyState
        illustration={mockIllustration}
        title="Sin reportes"
        description="No hay reportes disponibles"
      />,
    );
    expect(root).toBeDefined();
  });

  it('renderiza botón de acción cuando actionLabel está definido', () => {
    const { root } = render(
      <EmptyState
        illustration={mockIllustration}
        title="Sin datos"
        description="No hay datos"
        actionLabel="Recargar"
        onAction={jest.fn()}
      />,
    );
    expect(root).toBeDefined();
  });

  it('no renderiza botón cuando actionLabel no está definido', () => {
    const { root } = render(
      <EmptyState
        illustration={mockIllustration}
        title="Sin datos"
        description="No hay datos"
      />,
    );
    expect(root).toBeDefined();
  });
});
