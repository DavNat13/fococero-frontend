import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBanner } from '../ErrorBanner';

describe('ErrorBanner (banner de error)', () => {
  it('renderiza el mensaje de error', () => {
    const { getByText } = render(<ErrorBanner message="Error de conexión" />);
    expect(getByText('Error de conexión')).toBeTruthy();
  });

  it('renderiza botón Reintentar cuando onRetry está definido', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorBanner message="Error" onRetry={onRetry} />);
    expect(getByText('Reintentar')).toBeTruthy();
  });

  it('ejecuta onRetry al presionar Reintentar', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorBanner message="Error" onRetry={onRetry} />);
    fireEvent.press(getByText('Reintentar'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('no renderiza botón Reintentar cuando no hay onRetry', () => {
    const { queryByText } = render(<ErrorBanner message="Error" />);
    expect(queryByText('Reintentar')).toBeNull();
  });
});
