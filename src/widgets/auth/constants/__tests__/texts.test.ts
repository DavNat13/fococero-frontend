// src/widgets/auth/constants/__tests__/texts.test.ts

import { AUTH_TEXTS } from '../texts';

describe('AUTH_TEXTS', () => {
  it('contiene WELCOME.TITLE', () => {
    expect(AUTH_TEXTS.WELCOME.TITLE).toBeDefined();
    expect(typeof AUTH_TEXTS.WELCOME.TITLE).toBe('string');
  });

  it('contiene WELCOME.SUBTITLE', () => {
    expect(AUTH_TEXTS.WELCOME.SUBTITLE).toBeDefined();
    expect(typeof AUTH_TEXTS.WELCOME.SUBTITLE).toBe('string');
  });

  it('contiene WELCOME.CREATE_ACCOUNT_BTN', () => {
    expect(AUTH_TEXTS.WELCOME.CREATE_ACCOUNT_BTN).toBeDefined();
    expect(typeof AUTH_TEXTS.WELCOME.CREATE_ACCOUNT_BTN).toBe('string');
  });

  it('contiene LOGIN_FORM con campos', () => {
    expect(AUTH_TEXTS.LOGIN_FORM.TITLE).toBeDefined();
    expect(AUTH_TEXTS.LOGIN_FORM.RUT_LABEL).toBeDefined();
    expect(AUTH_TEXTS.LOGIN_FORM.PASSWORD_LABEL).toBeDefined();
  });

  it('contiene GUEST con textos', () => {
    expect(AUTH_TEXTS.GUEST.TITLE).toBeDefined();
    expect(AUTH_TEXTS.GUEST.WARNING_TEXT).toBeDefined();
    expect(AUTH_TEXTS.GUEST.PROCEED_BTN).toBeDefined();
    expect(AUTH_TEXTS.GUEST.CANCEL_BTN).toBeDefined();
  });

  it('contiene WELCOME.LEGAL_LINK y MODAL', () => {
    expect(AUTH_TEXTS.WELCOME.LEGAL_LINK).toBeDefined();
    expect(AUTH_TEXTS.WELCOME.MODAL_TITLE).toBeDefined();
    expect(AUTH_TEXTS.WELCOME.MODAL_CONTENT).toBeDefined();
    expect(AUTH_TEXTS.WELCOME.MODAL_CLOSE_BTN).toBeDefined();
  });
});
