import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton (esqueleto de carga)', () => {
  it('renderiza con cantidad por defecto de líneas', () => {
    const { UNSAFE_getAllByType } = render(<LoadingSkeleton />);
    expect(UNSAFE_getAllByType).toBeDefined();
  });

  it('renderiza con número personalizado de líneas', () => {
    const { UNSAFE_getAllByType } = render(<LoadingSkeleton lines={5} />);
    expect(UNSAFE_getAllByType).toBeDefined();
  });

  it('renderiza con altura personalizada', () => {
    const { UNSAFE_getAllByType } = render(<LoadingSkeleton lineHeight={24} />);
    expect(UNSAFE_getAllByType).toBeDefined();
  });

  it('renderiza con ancho personalizado de última línea', () => {
    const { UNSAFE_getAllByType } = render(<LoadingSkeleton lastLineWidth={40} />);
    expect(UNSAFE_getAllByType).toBeDefined();
  });
});
