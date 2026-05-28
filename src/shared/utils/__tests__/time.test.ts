import { getRelativeTime, getTacticalTime } from '../time';

describe('getRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns "Justo ahora" for less than 60 seconds', () => {
    const date = new Date(Date.now() - 30000);
    expect(getRelativeTime(date)).toBe('Justo ahora');
  });

  it('returns "Hace X m" for minutes', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Hace 5 m');
  });

  it('returns "Hace X h" for hours', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Hace 3 h');
  });

  it('returns "Ayer" for 1 day ago', () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Ayer');
  });

  it('returns "Hace X d" for days', () => {
    const date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(date)).toBe('Hace 4 d');
  });

  it('returns formatted date for older dates', () => {
    const date = new Date('2024-12-25T12:00:00.000Z');
    const result = getRelativeTime(date);
    expect(result).toMatch(/25\s+dic/i);
  });
});

describe('getTacticalTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T14:30:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns time in HH:mm hrs format', () => {
    expect(getTacticalTime()).toMatch(/^\d{2}:\d{2} hrs$/);
  });

  it('uses custom date', () => {
    const d = new Date('2025-01-15T12:00:00.000Z');
    const result = getTacticalTime(d);
    expect(result).toMatch(/\d{2}:\d{2} hrs/);
  });
});
