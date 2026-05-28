import { generateUUID } from '../uuid';

describe('generateUUID', () => {
  it('generates a string of length 36', () => {
    expect(generateUUID()).toHaveLength(36);
  });

  it('matches UUID v4 format', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates unique values', () => {
    const uuids = Array.from({ length: 100 }, () => generateUUID());
    const unique = new Set(uuids);
    expect(unique.size).toBe(100);
  });
});
