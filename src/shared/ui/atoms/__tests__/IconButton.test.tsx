// src/shared/ui/atoms/__tests__/IconButton.test.tsx

// Mock ScalePress as simple string component (renders as tag in tree)
jest.mock('../../animations/ScalePress', () => ({
  ScalePress: 'View',
}));

import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('renderiza sin errores', () => {
    const { root } = render(
      <IconButton icon={<View testID="test-icon" />} onPress={jest.fn()} />,
    );
    expect(root).toBeDefined();
  });
});
