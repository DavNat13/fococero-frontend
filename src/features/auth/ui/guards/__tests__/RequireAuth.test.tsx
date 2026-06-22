// src/features/auth/ui/guards/__tests__/RequireAuth.test.tsx

jest.mock('../../../model/auth.selectors', () => ({
  useIsHydrated: jest.fn(),
  useIsAuthenticated: jest.fn(),
}));

const mockRedirect = jest.fn();
jest.mock('expo-router', () => ({
  Redirect: (props: { href: string }) => {
    mockRedirect(props.href);
    return null;
  },
}));

import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { RequireAuth } from '../RequireAuth';

describe('RequireAuth', () => {
  it('muestra loading spinner cuando no está hidratado', () => {
    const { useIsHydrated } = require('../../../model/auth.selectors');
    const { useIsAuthenticated } = require('../../../model/auth.selectors');
    (useIsHydrated as jest.Mock).mockReturnValue(false);
    (useIsAuthenticated as jest.Mock).mockReturnValue(false);

    const { UNSAFE_getByType } = render(
      <RequireAuth>
        <View />
      </RequireAuth>,
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeDefined();
  });

  it('redirige a /login cuando no está autenticado', () => {
    const { useIsHydrated } = require('../../../model/auth.selectors');
    const { useIsAuthenticated } = require('../../../model/auth.selectors');
    (useIsHydrated as jest.Mock).mockReturnValue(true);
    (useIsAuthenticated as jest.Mock).mockReturnValue(false);

    render(
      <RequireAuth>
        <View />
      </RequireAuth>,
    );
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  it('renderiza children cuando está autenticado e hidratado', () => {
    const { useIsHydrated } = require('../../../model/auth.selectors');
    const { useIsAuthenticated } = require('../../../model/auth.selectors');
    (useIsHydrated as jest.Mock).mockReturnValue(true);
    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <RequireAuth>
        <Text>Contenido protegido</Text>
      </RequireAuth>,
    );
    expect(getByText('Contenido protegido')).toBeDefined();
  });
});
