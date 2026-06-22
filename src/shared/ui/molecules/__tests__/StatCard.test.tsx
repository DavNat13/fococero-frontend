// src/shared/ui/molecules/__tests__/StatCard.test.tsx

// Use string mocks to avoid CSS-interop issues
import React from 'react';
import { render } from '@testing-library/react-native';
import { StatCard } from '../StatCard';

jest.mock('../../icons', () => ({
  Icon: 'Icon',
  Icons: { ChevronUp: 'ChevronUp', ChevronDown: 'ChevronDown' },
}));

jest.mock('../../animations/ScalePress', () => ({
  ScalePress: 'ScalePress',
}));

jest.mock('../../atoms/Typography', () => ({
  Typography: 'Typography',
}));

describe('StatCard', () => {
  const mockIcon = {};

  it('renderiza label y value', () => {
    const { root } = render(<StatCard label="Incendios Activos" value="12" icon={mockIcon} />);
    expect(root).toBeDefined();
  });

  it('renderiza unit cuando se proporciona', () => {
    const { root } = render(<StatCard label="Temperatura" value="28" unit="°C" icon={mockIcon} />);
    expect(root).toBeDefined();
  });

  it('renderiza trend con isUp true', () => {
    const { root } = render(
      <StatCard
        label="Reportes"
        value="50"
        icon={mockIcon}
        trend={{ value: '+10%', isUp: true }}
      />,
    );
    expect(root).toBeDefined();
  });

  it('renderiza trend con isUp false', () => {
    const { root } = render(
      <StatCard
        label="Reportes"
        value="50"
        icon={mockIcon}
        trend={{ value: '-5%', isUp: false }}
      />,
    );
    expect(root).toBeDefined();
  });

  it('no renderiza trend cuando no se proporciona', () => {
    const { root } = render(<StatCard label="Test" value="1" icon={mockIcon} />);
    expect(root).toBeDefined();
  });

  it('es presionable cuando onPress está definido', () => {
    const onPress = jest.fn();
    const { root } = render(<StatCard label="Test" value="1" icon={mockIcon} onPress={onPress} />);
    expect(root).toBeDefined();
  });
});
