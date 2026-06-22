// src/shared/ui/layouts/__tests__/KeyboardScrollLayout.test.tsx

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { KeyboardScrollLayout } from '../KeyboardScrollLayout';

describe('KeyboardScrollLayout', () => {
  it('renderiza children', () => {
    const { getByText } = render(
      <KeyboardScrollLayout>
        <Text>Contenido con scroll</Text>
      </KeyboardScrollLayout>,
    );
    expect(getByText('Contenido con scroll')).toBeDefined();
  });
});
