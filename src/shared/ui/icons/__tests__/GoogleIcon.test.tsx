// src/shared/ui/icons/__tests__/GoogleIcon.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { GoogleIcon } from '../GoogleIcon';

describe('GoogleIcon', () => {
  it('renderiza sin errores', () => {
    const { root } = render(<GoogleIcon />);
    expect(root).toBeDefined();
  });
});
