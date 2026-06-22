import { generateUUID } from '../uuid';

describe('generateUUID (generación de UUID)', () => {
  it('genera un string de longitud 36', () => {
    expect(generateUUID()).toHaveLength(36);
  });

  it('coincide con el formato UUID v4', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('genera valores únicos', () => {
    const uuids = Array.from({ length: 100 }, () => generateUUID());
    const unique = new Set(uuids);
    expect(unique.size).toBe(100);
  });
});
