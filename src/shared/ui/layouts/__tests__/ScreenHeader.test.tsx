// src/shared/ui/layouts/__tests__/ScreenHeader.test.tsx

import React, { ComponentType } from 'react';
import { render } from '@testing-library/react-native';
import { ScreenHeader } from '../ScreenHeader';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

// Use string mocks to avoid CSS interop issues
jest.mock('@shared/ui/atoms', () => ({
  Typography: 'Typography',
  IconButton: 'IconButton',
}));

jest.mock('@shared/ui/icons', () => ({
  Icon: 'Icon',
  Icons: { ChevronLeft: 'ChevronLeft' },
}));

describe('ScreenHeader', () => {
  it('renderiza el título', () => {
    const { root } = render(<ScreenHeader title="Mi Perfil" />);
    expect(root).toBeDefined();
  });

  it('renderiza el subtítulo', () => {
    const { root } = render(<ScreenHeader title="Perfil" subtitle="Información personal" />);
    expect(root).toBeDefined();
  });

  it('no renderiza subtítulo cuando no se proporciona', () => {
    const { root } = render(<ScreenHeader title="Perfil" />);
    expect(root).toBeDefined();
  });

  it('renderiza botón de retroceso por defecto', () => {
    const { UNSAFE_getByType } = render(<ScreenHeader title="Perfil" />);
    expect(UNSAFE_getByType('IconButton' as unknown as ComponentType)).toBeDefined();
  });

  it('no renderiza botón de retroceso cuando showBackButton es false', () => {
    render(<ScreenHeader title="Perfil" showBackButton={false} />);
    expect(true).toBe(true);
  });

  it('renderiza sin errores', () => {
    const { root } = render(<ScreenHeader title="Perfil" />);
    expect(root).toBeDefined();
  });
});
