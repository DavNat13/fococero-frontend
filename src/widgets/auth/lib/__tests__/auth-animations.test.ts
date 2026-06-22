// src/widgets/auth/lib/__tests__/auth-animations.test.ts

import { WELCOME_CHOREOGRAPHY } from '../auth-animations';

describe('WELCOME_CHOREOGRAPHY', () => {
  it('contiene LOGO con delay en ms', () => {
    expect(WELCOME_CHOREOGRAPHY.LOGO).toBeDefined();
    expect(typeof WELCOME_CHOREOGRAPHY.LOGO).toBe('number');
    expect(WELCOME_CHOREOGRAPHY.LOGO).toBeGreaterThan(0);
  });

  it('contiene TITLE con delay en ms', () => {
    expect(WELCOME_CHOREOGRAPHY.TITLE).toBeDefined();
    expect(typeof WELCOME_CHOREOGRAPHY.TITLE).toBe('number');
    expect(WELCOME_CHOREOGRAPHY.TITLE).toBeGreaterThan(0);
  });

  it('contiene SUBTITLE con delay en ms', () => {
    expect(WELCOME_CHOREOGRAPHY.SUBTITLE).toBeDefined();
    expect(typeof WELCOME_CHOREOGRAPHY.SUBTITLE).toBe('number');
    expect(WELCOME_CHOREOGRAPHY.SUBTITLE).toBeGreaterThan(0);
  });

  it('contiene BUTTONS con delay en ms', () => {
    expect(WELCOME_CHOREOGRAPHY.BUTTONS).toBeDefined();
    expect(WELCOME_CHOREOGRAPHY.BUTTONS).toBeGreaterThan(0);
  });

  it('contiene FOOTER con delay en ms', () => {
    expect(WELCOME_CHOREOGRAPHY.FOOTER).toBeDefined();
    expect(WELCOME_CHOREOGRAPHY.FOOTER).toBeGreaterThan(0);
  });

  it('los delays están en orden ascendente', () => {
    expect(WELCOME_CHOREOGRAPHY.LOGO).toBeLessThan(WELCOME_CHOREOGRAPHY.TITLE);
    expect(WELCOME_CHOREOGRAPHY.TITLE).toBeLessThan(WELCOME_CHOREOGRAPHY.SUBTITLE);
    expect(WELCOME_CHOREOGRAPHY.SUBTITLE).toBeLessThan(WELCOME_CHOREOGRAPHY.BUTTONS);
    expect(WELCOME_CHOREOGRAPHY.BUTTONS).toBeLessThan(WELCOME_CHOREOGRAPHY.FOOTER);
  });
});
