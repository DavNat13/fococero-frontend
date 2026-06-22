// src/shared/ui/layouts/__tests__/FocusAwareStatusBar.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { FocusAwareStatusBar } from '../FocusAwareStatusBar';

describe('FocusAwareStatusBar', () => {
  it('renderiza sin errores', () => {
    // Simplemente verificar que no lanza error al renderizar
    expect(() => render(<FocusAwareStatusBar />)).not.toThrow();
  });
});
