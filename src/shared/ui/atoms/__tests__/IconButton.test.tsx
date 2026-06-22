// src/shared/ui/atoms/__tests__/IconButton.test.tsx

// Mock ScalePress as simple string component (renders as tag in tree)
import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { IconButton } from '../IconButton';

jest.mock('../../animations/ScalePress', () => ({
  ScalePress: 'View',
}));

describe('IconButton', () => {
  it('renderiza sin errores', () => {
    const { root } = render(<IconButton icon={<View testID="test-icon" />} onPress={jest.fn()} />);
    expect(root).toBeDefined();
  });
});
