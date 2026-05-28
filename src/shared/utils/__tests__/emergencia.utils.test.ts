import {
  getNivelColor,
  getNivelIcon,
  getEstadoColor,
  getEstadoIcon,
  mapEstado,
  getEstadoLabel,
  mapEstadoANivel,
} from '../emergencia.utils';

describe('getNivelColor', () => {
  it('returns red for critico', () => {
    expect(getNivelColor('critico')).toBe('#DC2626');
  });

  it('returns red for alto', () => {
    expect(getNivelColor('alto')).toBe('#EF4444');
  });

  it('returns orange for medio', () => {
    expect(getNivelColor('medio')).toBe('#F97316');
  });

  it('returns green for bajo', () => {
    expect(getNivelColor('bajo')).toBe('#22C55E');
  });

  it('returns gray for unknown level', () => {
    expect(getNivelColor('unknown')).toBe('#6B7280');
  });
});

describe('getNivelIcon', () => {
  it('returns alert-octagon for critico', () => {
    expect(getNivelIcon('critico')).toBe('alert-octagon');
  });

  it('returns fire for alto', () => {
    expect(getNivelIcon('alto')).toBe('fire');
  });

  it('returns fire-alert for medio', () => {
    expect(getNivelIcon('medio')).toBe('fire-alert');
  });

  it('returns fire-extinguisher for bajo', () => {
    expect(getNivelIcon('bajo')).toBe('fire-extinguisher');
  });

  it('returns alert for unknown level', () => {
    expect(getNivelIcon('unknown')).toBe('alert');
  });
});

describe('getEstadoColor', () => {
  it('returns red for activa', () => {
    expect(getEstadoColor('activa')).toBe('#EF4444');
  });

  it('returns orange for controlada', () => {
    expect(getEstadoColor('controlada')).toBe('#F97316');
  });

  it('returns green for extinguida', () => {
    expect(getEstadoColor('extinguida')).toBe('#22C55E');
  });

  it('returns orange for pendiente', () => {
    expect(getEstadoColor('pendiente')).toBe('#F97316');
  });

  it('returns blue for en_proceso', () => {
    expect(getEstadoColor('en_proceso')).toBe('#3B82F6');
  });

  it('returns green for resuelto', () => {
    expect(getEstadoColor('resuelto')).toBe('#22C55E');
  });

  it('returns gray for unknown estado', () => {
    expect(getEstadoColor('unknown')).toBe('#6B7280');
  });
});

describe('getEstadoIcon', () => {
  it('returns alert-circle for activa', () => {
    expect(getEstadoIcon('activa')).toBe('alert-circle');
  });

  it('returns progress-clock for controlada', () => {
    expect(getEstadoIcon('controlada')).toBe('progress-clock');
  });

  it('returns check-circle for extinguida', () => {
    expect(getEstadoIcon('extinguida')).toBe('check-circle');
  });

  it('returns information for unknown estado', () => {
    expect(getEstadoIcon('unknown')).toBe('information');
  });
});

describe('mapEstado', () => {
  it('maps PENDIENTE to pendiente', () => {
    expect(mapEstado('PENDIENTE')).toBe('pendiente');
  });

  it('maps EN_REVISION to en_proceso', () => {
    expect(mapEstado('EN_REVISION')).toBe('en_proceso');
  });

  it('maps APROBADO to resuelto', () => {
    expect(mapEstado('APROBADO')).toBe('resuelto');
  });

  it('maps CERRADO to resuelto', () => {
    expect(mapEstado('CERRADO')).toBe('resuelto');
  });

  it('returns pendiente for unknown estado', () => {
    expect(mapEstado('UNKNOWN')).toBe('pendiente');
  });
});

describe('getEstadoLabel', () => {
  it('returns Pendiente for pendiente', () => {
    expect(getEstadoLabel('PENDIENTE')).toBe('Pendiente');
  });

  it('returns En proceso for en_proceso', () => {
    expect(getEstadoLabel('EN_REVISION')).toBe('En proceso');
  });

  it('returns Resuelto for resuelto', () => {
    expect(getEstadoLabel('CERRADO')).toBe('Resuelto');
  });
});

describe('mapEstadoANivel', () => {
  it('maps CRITICA to alto', () => {
    expect(mapEstadoANivel('CRITICA')).toBe('alto');
  });

  it('maps EN_PROCESO to alto', () => {
    expect(mapEstadoANivel('EN_PROCESO')).toBe('alto');
  });

  it('maps PENDIENTE to medio', () => {
    expect(mapEstadoANivel('PENDIENTE')).toBe('medio');
  });

  it('maps REPORTADA to medio', () => {
    expect(mapEstadoANivel('REPORTADA')).toBe('medio');
  });

  it('maps VERIFICADA to bajo', () => {
    expect(mapEstadoANivel('VERIFICADA')).toBe('bajo');
  });

  it('maps RESUELTA to bajo', () => {
    expect(mapEstadoANivel('RESUELTA')).toBe('bajo');
  });

  it('maps DESCARTADA to bajo', () => {
    expect(mapEstadoANivel('DESCARTADA')).toBe('bajo');
  });

  it('returns medio for unknown estado', () => {
    expect(mapEstadoANivel('UNKNOWN')).toBe('medio');
  });
});
