import {
  getNivelColor,
  getNivelIcon,
  getEstadoColor,
  getEstadoIcon,
  mapEstado,
  getEstadoLabel,
  mapEstadoANivel,
} from '../emergencia.utils';

describe('getNivelColor (color de nivel)', () => {
  it('retorna rojo para crítico', () => {
    expect(getNivelColor('critico')).toBe('#DC2626');
  });

  it('retorna rojo para alto', () => {
    expect(getNivelColor('alto')).toBe('#EF4444');
  });

  it('retorna naranja para medio', () => {
    expect(getNivelColor('medio')).toBe('#F97316');
  });

  it('retorna verde para bajo', () => {
    expect(getNivelColor('bajo')).toBe('#22C55E');
  });

  it('retorna gris para nivel desconocido', () => {
    expect(getNivelColor('unknown')).toBe('#6B7280');
  });
});

describe('getNivelIcon (icono de nivel)', () => {
  it('retorna alert-octagon para crítico', () => {
    expect(getNivelIcon('critico')).toBe('alert-octagon');
  });

  it('retorna fire para alto', () => {
    expect(getNivelIcon('alto')).toBe('fire');
  });

  it('retorna fire-alert para medio', () => {
    expect(getNivelIcon('medio')).toBe('fire-alert');
  });

  it('retorna fire-extinguisher para bajo', () => {
    expect(getNivelIcon('bajo')).toBe('fire-extinguisher');
  });

  it('retorna alert para nivel desconocido', () => {
    expect(getNivelIcon('unknown')).toBe('alert');
  });
});

describe('getEstadoColor (color de estado)', () => {
  it('retorna rojo para activa', () => {
    expect(getEstadoColor('activa')).toBe('#EF4444');
  });

  it('retorna naranja para controlada', () => {
    expect(getEstadoColor('controlada')).toBe('#F97316');
  });

  it('retorna verde para extinguida', () => {
    expect(getEstadoColor('extinguida')).toBe('#22C55E');
  });

  it('retorna naranja para pendiente', () => {
    expect(getEstadoColor('pendiente')).toBe('#F97316');
  });

  it('retorna azul para en_proceso', () => {
    expect(getEstadoColor('en_proceso')).toBe('#3B82F6');
  });

  it('retorna verde para resuelto', () => {
    expect(getEstadoColor('resuelto')).toBe('#22C55E');
  });

  it('retorna gris para estado desconocido', () => {
    expect(getEstadoColor('unknown')).toBe('#6B7280');
  });
});

describe('getEstadoIcon (icono de estado)', () => {
  it('retorna alert-circle para activa', () => {
    expect(getEstadoIcon('activa')).toBe('alert-circle');
  });

  it('retorna progress-clock para controlada', () => {
    expect(getEstadoIcon('controlada')).toBe('progress-clock');
  });

  it('retorna check-circle para extinguida', () => {
    expect(getEstadoIcon('extinguida')).toBe('check-circle');
  });

  it('retorna information para estado desconocido', () => {
    expect(getEstadoIcon('unknown')).toBe('information');
  });
});

describe('mapEstado (mapeo de estado)', () => {
  it('mapea PENDIENTE a pendiente', () => {
    expect(mapEstado('PENDIENTE')).toBe('pendiente');
  });

  it('mapea EN_REVISION a en_proceso', () => {
    expect(mapEstado('EN_REVISION')).toBe('en_proceso');
  });

  it('mapea APROBADO a resuelto', () => {
    expect(mapEstado('APROBADO')).toBe('resuelto');
  });

  it('mapea CERRADO a resuelto', () => {
    expect(mapEstado('CERRADO')).toBe('resuelto');
  });

  it('retorna pendiente para estado desconocido', () => {
    expect(mapEstado('UNKNOWN')).toBe('pendiente');
  });
});

describe('getEstadoLabel (etiqueta de estado)', () => {
  it('retorna Pendiente para pendiente', () => {
    expect(getEstadoLabel('PENDIENTE')).toBe('Pendiente');
  });

  it('retorna En proceso para en_proceso', () => {
    expect(getEstadoLabel('EN_REVISION')).toBe('En proceso');
  });

  it('retorna Resuelto para resuelto', () => {
    expect(getEstadoLabel('CERRADO')).toBe('Resuelto');
  });
});

describe('mapEstadoANivel (mapeo estado a nivel)', () => {
  it('mapea CRITICA a alto', () => {
    expect(mapEstadoANivel('CRITICA')).toBe('alto');
  });

  it('mapea EN_PROCESO a alto', () => {
    expect(mapEstadoANivel('EN_PROCESO')).toBe('alto');
  });

  it('mapea PENDIENTE a medio', () => {
    expect(mapEstadoANivel('PENDIENTE')).toBe('medio');
  });

  it('mapea REPORTADA a medio', () => {
    expect(mapEstadoANivel('REPORTADA')).toBe('medio');
  });

  it('mapea VERIFICADA a bajo', () => {
    expect(mapEstadoANivel('VERIFICADA')).toBe('bajo');
  });

  it('mapea RESUELTA a bajo', () => {
    expect(mapEstadoANivel('RESUELTA')).toBe('bajo');
  });

  it('mapea DESCARTADA a bajo', () => {
    expect(mapEstadoANivel('DESCARTADA')).toBe('bajo');
  });

  it('retorna medio para estado desconocido', () => {
    expect(mapEstadoANivel('UNKNOWN')).toBe('medio');
  });
});
