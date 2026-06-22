import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge (componente de etiqueta)', () => {
  it('renderiza el label correctamente', () => {
    const { getByText } = render(<Badge label="Activo" />);
    expect(getByText('Activo')).toBeTruthy();
  });

  it('renderiza con status success', () => {
    const { getByText } = render(<Badge label="Éxito" status="success" />);
    expect(getByText('Éxito')).toBeTruthy();
  });

  it('renderiza con status warning', () => {
    const { getByText } = render(<Badge label="Advertencia" status="warning" />);
    expect(getByText('Advertencia')).toBeTruthy();
  });

  it('renderiza con status danger', () => {
    const { getByText } = render(<Badge label="Peligro" status="danger" />);
    expect(getByText('Peligro')).toBeTruthy();
  });

  it('renderiza con status info (por defecto)', () => {
    const { getByText } = render(<Badge label="Info" />);
    expect(getByText('Info')).toBeTruthy();
  });
});
