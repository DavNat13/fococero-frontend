// src/features/auth/ui/components/__tests__/LogoutButton.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LogoutButton } from '../LogoutButton';

jest.mock('../../../model/auth.selectors', () => ({
  useAuthActions: jest.fn(),
}));

describe('LogoutButton', () => {
  it('renderiza el botón de cerrar sesión', () => {
    const mockLogout = jest.fn();
    const { useAuthActions } = require('../../../model/auth.selectors');
    (useAuthActions as jest.Mock).mockReturnValue({ logout: mockLogout });

    const { getByText } = render(<LogoutButton />);
    expect(getByText('Cerrar Sesión')).toBeDefined();
  });

  it('llama logout al presionar', () => {
    const mockLogout = jest.fn();
    const { useAuthActions } = require('../../../model/auth.selectors');
    (useAuthActions as jest.Mock).mockReturnValue({ logout: mockLogout });

    const { getByText } = render(<LogoutButton />);
    fireEvent.press(getByText('Cerrar Sesión'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('muestra ActivityIndicator cuando isLoading es true', () => {
    const { useAuthActions } = require('../../../model/auth.selectors');
    (useAuthActions as jest.Mock).mockReturnValue({ logout: jest.fn() });

    const { getByLabelText } = render(<LogoutButton isLoading={true} />);
    expect(getByLabelText('Cerrar sesión de FocoCero')).toBeDefined();
  });

  it('deshabilita el botón cuando isLoading es true', () => {
    const mockLogout = jest.fn();
    const { useAuthActions } = require('../../../model/auth.selectors');
    (useAuthActions as jest.Mock).mockReturnValue({ logout: mockLogout });

    const { getByLabelText } = render(<LogoutButton isLoading={true} />);
    fireEvent.press(getByLabelText('Cerrar sesión de FocoCero'));
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
