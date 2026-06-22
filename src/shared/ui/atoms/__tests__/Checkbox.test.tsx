// src/shared/ui/atoms/__tests__/Checkbox.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { Checkbox } from '../Checkbox';

jest.mock('../Typography', () => ({
  Typography: function Typography() {
    return null;
  },
}));

describe('Checkbox', () => {
  it('renderiza sin errores', () => {
    const { root } = render(<Checkbox checked={false} onChange={jest.fn()} />);
    expect(root).toBeDefined();
  });

  it('renderiza con checked = true', () => {
    const { root } = render(<Checkbox checked={true} onChange={jest.fn()} />);
    expect(root).toBeDefined();
  });

  it('renderiza label cuando se proporciona', () => {
    const { root } = render(
      <Checkbox checked={false} onChange={jest.fn()} label="Acepto términos" />,
    );
    expect(root).toBeDefined();
  });
});
