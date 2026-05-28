import { calculateDistance, formatCoordinates } from '../geo';

describe('calculateDistance', () => {
  it('returns 0 for same coordinates', () => {
    expect(calculateDistance(-33.45, -70.66, -33.45, -70.66)).toBe(0);
  });

  it('calculates distance between Santiago and Valparaíso (~98 km)', () => {
    const santiagoLat = -33.4489;
    const santiagoLon = -70.6693;
    const valpoLat = -33.0472;
    const valpoLon = -71.6127;
    const dist = calculateDistance(santiagoLat, santiagoLon, valpoLat, valpoLon);
    expect(dist).toBeGreaterThan(90);
    expect(dist).toBeLessThan(110);
  });

  it('calculates small distance (~1 km)', () => {
    const lat = -33.45;
    const lon = -70.66;
    const dist = calculateDistance(lat, lon, lat + 0.009, lon);
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(2);
  });
});

describe('formatCoordinates', () => {
  it('formats coordinates with 5 decimal places', () => {
    expect(formatCoordinates(-33.44889, -70.66933)).toBe('-33.44889, -70.66933');
  });

  it('handles zero coordinates', () => {
    expect(formatCoordinates(0, 0)).toBe('0.00000, 0.00000');
  });

  it('handles positive coordinates', () => {
    expect(formatCoordinates(40.41678, -3.70379)).toBe('40.41678, -3.70379');
  });
});
