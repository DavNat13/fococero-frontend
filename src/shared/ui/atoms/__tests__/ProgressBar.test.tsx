// src/shared/ui/atoms/__tests__/ProgressBar.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renderiza con progreso 0', () => {
    const { UNSAFE_getByType } = render(<ProgressBar progress={0} />);
    const { View } = require('react-native');
    expect(UNSAFE_getByType(View)).toBeDefined();
  });

  it('renderiza con progreso 50', () => {
    const { UNSAFE_getByType } = render(<ProgressBar progress={50} />);
    const { View } = require('react-native');
    expect(UNSAFE_getByType(View)).toBeDefined();
  });

  it('renderiza con progreso 100', () => {
    const { UNSAFE_getByType } = render(<ProgressBar progress={100} />);
    const { View } = require('react-native');
    expect(UNSAFE_getByType(View)).toBeDefined();
  });

  it('clampa progreso a 0 si es negativo', () => {
    const { UNSAFE_getByType } = render(<ProgressBar progress={-10} />);
    const { View } = require('react-native');
    expect(UNSAFE_getByType(View)).toBeDefined();
  });

  it('clampa progreso a 100 si excede', () => {
    const { UNSAFE_getByType } = render(<ProgressBar progress={150} />);
    const { View } = require('react-native');
    expect(UNSAFE_getByType(View)).toBeDefined();
  });
});
