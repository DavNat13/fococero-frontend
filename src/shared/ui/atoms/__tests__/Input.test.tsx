// src/shared/ui/atoms/__tests__/Input.test.tsx

jest.mock('../../animations/ShakeError', () => ({
  ShakeError: ({ children }: { children: React.ReactNode }) => children,
}));

import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('renderiza el input correctamente', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Ingrese texto" />);
    expect(getByPlaceholderText('Ingrese texto')).toBeDefined();
  });

  it('muestra label cuando se proporciona', () => {
    const { getByText } = render(<Input label="Nombre" />);
    expect(getByText('Nombre')).toBeDefined();
  });

  it('muestra error cuando se proporciona', () => {
    const { getByText } = render(<Input label="Nombre" error="Campo requerido" />);
    expect(getByText('Campo requerido')).toBeDefined();
  });

  it('muestra botón de ver/ocultar para password', () => {
    const { getByText } = render(<Input isPassword={true} />);
    expect(getByText('VER')).toBeDefined();
  });

  it('alterna entre VER/OCULTAR al presionar', () => {
    const { getByText } = render(<Input isPassword={true} />);
    fireEvent.press(getByText('VER'));
    expect(getByText('OCULTAR')).toBeDefined();
  });

  it('renderiza leftIcon cuando se proporciona', () => {
    const { getByTestId } = render(
      <Input leftIcon={<View testID="left-icon" />} />,
    );
    expect(getByTestId('left-icon')).toBeDefined();
  });

  it('renderiza rightIcon cuando se proporciona (no password)', () => {
    const { getByTestId } = render(
      <Input rightIcon={<View testID="right-icon" />} />,
    );
    expect(getByTestId('right-icon')).toBeDefined();
  });

  it('no renderiza rightIcon cuando isPassword es true', () => {
    const { queryByTestId } = render(
      <Input isPassword={true} rightIcon={<View testID="right-icon" />} />,
    );
    expect(queryByTestId('right-icon')).toBeNull();
  });

  it('cambia a focused al recibir foco', () => {
    const onFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="test" onFocus={onFocus} />,
    );
    fireEvent(getByPlaceholderText('test'), 'focus');
    expect(onFocus).toHaveBeenCalled();
  });

  it('cambia a blurred al perder foco', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="test" onBlur={onBlur} />,
    );
    const input = getByPlaceholderText('test');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalled();
  });
});
