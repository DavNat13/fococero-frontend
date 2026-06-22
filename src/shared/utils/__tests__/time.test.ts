import { getRelativeTime, getTacticalTime } from '../time';

describe('getRelativeTime (tiempo relativo)', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('retorna "Justo ahora" para menos de 60 segundos', () => {
    const date = new Date(Date.now() - 30000);
    expect(getRelativeTime(date)).toBe('Justo ahora');
  });

  it('retorna "Hace X m" para minutos', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Hace 5 m');
  });

  it('retorna "Hace X h" para horas', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Hace 3 h');
  });

  it('retorna "Ayer" para 1 día atrás', () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Ayer');
  });

  it('retorna "Hace X d" para días', () => {
    const date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Hace 4 d');
  });

  it('retorna fecha formateada para fechas antiguas', () => {
    const date = new Date('2024-12-25T12:00:00.000Z');
    const result = getRelativeTime(date);
    expect(result).toMatch(/25\s+dic/i);
  });
});

describe('getTacticalTime (hora táctica)', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T14:30:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('retorna hora en formato HH:mm hrs', () => {
    expect(getTacticalTime()).toMatch(/^\d{2}:\d{2} hrs$/);
  });

  it('usa una fecha personalizada', () => {
    const d = new Date('2025-01-15T12:00:00.000Z');
    const result = getTacticalTime(d);
    expect(result).toMatch(/\d{2}:\d{2} hrs/);
  });
});
