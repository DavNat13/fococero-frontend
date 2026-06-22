// src/shared/ui/atoms/__tests__/Switch.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('renderiza con valor true', () => {
    const { root } = render(<Switch value={true} onValueChange={jest.fn()} />);
    expect(root).toBeDefined();
  });

  it('renderiza con valor false', () => {
    const { root } = render(<Switch value={false} onValueChange={jest.fn()} />);
    expect(root).toBeDefined();
  });
});
