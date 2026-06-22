import React from 'react';
import { render } from '@testing-library/react-native';
import { AlertBanner } from '../AlertBanner';

describe('AlertBanner (banner de alerta)', () => {
  it('renderiza el mensaje', () => {
    const { getByText } = render(<AlertBanner message="Alerta de incendio" />);
    expect(getByText('Alerta de incendio')).toBeTruthy();
  });

  it('renderiza con tipo warning por defecto', () => {
    const { getByText } = render(<AlertBanner message="Advertencia" />);
    expect(getByText('Advertencia')).toBeTruthy();
  });

  it('renderiza con tipo danger', () => {
    const { getByText } = render(<AlertBanner message="Peligro" type="danger" />);
    expect(getByText('Peligro')).toBeTruthy();
  });

  it('renderiza con tipo info', () => {
    const { getByText } = render(<AlertBanner message="Informativo" type="info" />);
    expect(getByText('Informativo')).toBeTruthy();
  });
});
