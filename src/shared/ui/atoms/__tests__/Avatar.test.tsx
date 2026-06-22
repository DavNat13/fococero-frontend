// src/shared/ui/atoms/__tests__/Avatar.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renderiza iniciales cuando no hay src', () => {
    const { getByText } = render(<Avatar fallbackInitials="JD" />);
    expect(getByText('JD')).toBeDefined();
  });

  it('convierte iniciales a mayúsculas y solo 2 caracteres', () => {
    const { getByText } = render(<Avatar fallbackInitials="juan" />);
    expect(getByText('JU')).toBeDefined();
  });

  it('renderiza imagen cuando hay src', () => {
    const { UNSAFE_getByType } = render(
      <Avatar src="https://example.com/avatar.jpg" fallbackInitials="JD" />,
    );
    const { Image } = require('react-native');
    expect(UNSAFE_getByType(Image)).toBeDefined();
  });

  it('muestra iniciales cuando no hay src (null)', () => {
    const { getByText } = render(<Avatar src={null} fallbackInitials="AB" />);
    expect(getByText('AB')).toBeDefined();
  });

  it('renderiza con isOnline true (indicador presente)', () => {
    const { UNSAFE_getAllByType } = render(
      <Avatar fallbackInitials="JD" isOnline={true} />,
    );
    const { View } = require('react-native');
    expect(UNSAFE_getAllByType(View).length).toBe(3);
  });

  it('renderiza sin indicador cuando isOnline no está definido', () => {
    const { UNSAFE_getAllByType } = render(<Avatar fallbackInitials="JD" />);
    const { View } = require('react-native');
    expect(UNSAFE_getAllByType(View).length).toBe(2);
  });

  it('renderiza con diferentes tamaños', () => {
    const { getByText } = render(<Avatar fallbackInitials="XL" size="xl" />);
    expect(getByText('XL')).toBeDefined();
  });
});
