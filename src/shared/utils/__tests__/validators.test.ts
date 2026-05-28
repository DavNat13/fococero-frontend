import { isValidRUT, isValidEmail } from '../validators';

describe('isValidRUT', () => {
  it('returns true for valid RUT 11111111-1', () => {
    expect(isValidRUT('11111111-1')).toBe(true);
  });

  it('returns true for valid RUT with dots', () => {
    expect(isValidRUT('12.345.678-5')).toBe(true);
  });

  it('returns false for invalid RUT (wrong DV)', () => {
    expect(isValidRUT('11111111-0')).toBe(false);
  });

  it('returns false for malformed input', () => {
    expect(isValidRUT('abc')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidRUT('')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('returns true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('returns true for email with subdomain', () => {
    expect(isValidEmail('user@sub.example.com')).toBe(true);
  });

  it('returns false for email without @', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
