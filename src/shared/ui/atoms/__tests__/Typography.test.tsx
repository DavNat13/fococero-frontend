import React from 'react';
import { render } from '@testing-library/react-native';
import { Typography } from '../Typography';

describe('Typography (componente de texto)', () => {
  it('renderiza el texto correctamente', () => {
    const { getByText } = render(<Typography>Hola Mundo</Typography>);
    expect(getByText('Hola Mundo')).toBeTruthy();
  });

  it('aplica variante h1', () => {
    const { getByText } = render(<Typography variant="h1">Título</Typography>);
    const element = getByText('Título');
    expect(element).toBeTruthy();
  });

  it('aplica variante caption', () => {
    const { getByText } = render(<Typography variant="caption">Caption</Typography>);
    expect(getByText('Caption')).toBeTruthy();
  });

  it('aplica variante display', () => {
    const { getByText } = render(<Typography variant="display">Display</Typography>);
    expect(getByText('Display')).toBeTruthy();
  });

  it('aplica variante label', () => {
    const { getByText } = render(<Typography variant="label">Label</Typography>);
    expect(getByText('Label')).toBeTruthy();
  });

  it('aplica color danger', () => {
    const { getByText } = render(<Typography color="danger">Error</Typography>);
    expect(getByText('Error')).toBeTruthy();
  });

  it('aplica color brand', () => {
    const { getByText } = render(<Typography color="brand">Brand</Typography>);
    expect(getByText('Brand')).toBeTruthy();
  });

  it('aplica alineación center', () => {
    const { getByText } = render(<Typography align="center">Centrado</Typography>);
    expect(getByText('Centrado')).toBeTruthy();
  });

  it('aplica className adicional', () => {
    const { getByText } = render(<Typography className="font-bold">Bold Text</Typography>);
    expect(getByText('Bold Text')).toBeTruthy();
  });

  it('pasa props nativas de Text', () => {
    const { getByText } = render(<Typography numberOfLines={2}>Multilínea</Typography>);
    const element = getByText('Multilínea');
    expect(element.props.numberOfLines).toBe(2);
  });
});
