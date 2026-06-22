import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button (componente de botón)', () => {
  it('renderiza el label correctamente', () => {
    const { getByText } = render(<Button label="Presionar" onPress={() => {}} />);
    expect(getByText('Presionar')).toBeTruthy();
  });

  it('ejecuta onPress al presionar', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button label="Presionar" onPress={onPressMock} />);
    fireEvent.press(getByText('Presionar'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renderiza con variante outline', () => {
    const { getByText } = render(<Button label="Outline" onPress={() => {}} variant="outline" />);
    expect(getByText('Outline')).toBeTruthy();
  });

  it('renderiza con variante ghost', () => {
    const { getByText } = render(<Button label="Ghost" onPress={() => {}} variant="ghost" />);
    expect(getByText('Ghost')).toBeTruthy();
  });

  it('renderiza con variante warning', () => {
    const { getByText } = render(<Button label="Warning" onPress={() => {}} variant="warning" />);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('renderiza con variante danger', () => {
    const { getByText } = render(<Button label="Danger" onPress={() => {}} variant="danger" />);
    expect(getByText('Danger')).toBeTruthy();
  });

  it('renderiza con leftIcon', () => {
    const { getByText } = render(
      <Button label="Con Icono" onPress={() => {}} leftIcon={<React.Fragment />} />,
    );
    expect(getByText('Con Icono')).toBeTruthy();
  });

  it('renderiza con rightIcon', () => {
    const { getByText } = render(
      <Button label="Con Icono Der" onPress={() => {}} rightIcon={<React.Fragment />} />,
    );
    expect(getByText('Con Icono Der')).toBeTruthy();
  });

  it('no renderiza el label cuando isLoading es true (solo spinner)', () => {
    const { queryByText } = render(
      <Button label="Cargando" onPress={() => {}} isLoading />,
    );
    expect(queryByText('Cargando')).toBeNull();
  });
});
