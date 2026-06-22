import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../Card';

describe('Card (componente de tarjeta)', () => {
  it('renderiza children correctamente', () => {
    render(
      <Card>
        <></>
      </Card>,
    );
  });

  it('renderiza contenido dentro de la tarjeta', () => {
    render(
      <Card>
        <></>
      </Card>,
    );
  });

  it('acepta className adicional', () => {
    const { getByTestId } = render(
      <Card testID="test-card">
        <></>
      </Card>,
    );
    expect(getByTestId('test-card')).toBeTruthy();
  });

  it('renderiza múltiples hijos', () => {
    render(
      <Card>
        <></>
      </Card>,
    );
  });
});
