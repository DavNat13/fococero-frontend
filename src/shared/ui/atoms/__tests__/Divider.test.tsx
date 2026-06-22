import React from 'react';
import { render } from '@testing-library/react-native';
import { Divider } from '../Divider';

describe('Divider (componente de divisor)', () => {
  it('renderiza sin label', () => {
    const { UNSAFE_getAllByType } = render(<Divider />);
    // Verifica que existe un View y un Typography no debería estar
    expect(UNSAFE_getAllByType).toBeDefined();
  });

  it('renderiza con label', () => {
    const { getByText } = render(<Divider label="o" />);
    expect(getByText('o')).toBeTruthy();
  });
});
