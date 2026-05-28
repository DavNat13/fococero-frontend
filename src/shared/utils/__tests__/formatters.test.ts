import { formatRUT, formatPhone, capitalize, formatearFecha } from '../formatters';

describe('formatRUT', () => {
  it('formats a standard RUT', () => {
    expect(formatRUT('123456789')).toBe('12.345.678-9');
  });

  it('handles K as dv', () => {
    expect(formatRUT('12345678K')).toBe('12.345.678-K');
  });

  it('handles lowercase k dv', () => {
    expect(formatRUT('12345678k')).toBe('12.345.678-K');
  });

  it('strips dots and dash from input', () => {
    expect(formatRUT('12.345.678-9')).toBe('12.345.678-9');
  });

  it('returns empty for empty input', () => {
    expect(formatRUT('')).toBe('');
  });

  it('returns empty for only non-digit chars', () => {
    expect(formatRUT('abc')).toBe('');
  });
});

describe('formatPhone', () => {
  it('formats a 9-digit Chilean mobile number', () => {
    expect(formatPhone('912345678')).toBe('+56 9 1234 5678');
  });

  it('strips non-digit characters', () => {
    expect(formatPhone('+56 9 1234 5678')).toBe('+56 9 1234 5678');
  });

  it('returns raw phone for non-9-digit length', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter of each ASCII word', () => {
    expect(capitalize('juan perez')).toBe('Juan Perez');
  });

  it('handles single word', () => {
    expect(capitalize('brigadista')).toBe('Brigadista');
  });

  it('handles already capitalized', () => {
    expect(capitalize('Juan Perez')).toBe('Juan Perez');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('formatearFecha', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('formats ISO date to Chilean locale', () => {
    const result = formatearFecha('2025-01-14T15:30:00.000Z');
    expect(result).toMatch(/14/i);
  });

  it('returns Invalid Date string for invalid date', () => {
    const result = formatearFecha('not-a-date');
    expect(result).toMatch(/invalid/i);
  });
});
