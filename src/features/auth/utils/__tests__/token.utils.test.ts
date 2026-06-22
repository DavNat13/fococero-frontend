import { tokenUtils } from '../token.utils';

describe('tokenUtils (utilidades de JWT)', () => {
  describe('decodePayload', () => {
    it('decodifica un JWT válido correctamente', () => {
      // Token JWT simulado con payload: {"exp": 9999999999, "iat": 1000000000, "sub": "abc123", "email": "test@test.com"}
      const token =
        'header.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTAwMDAwMDAwMCwic3ViIjoiYWJjMTIzIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.signature';
      const result = tokenUtils.decodePayload(token);
      expect(result).not.toBeNull();
      expect(result!.sub).toBe('abc123');
      expect(result!.email).toBe('test@test.com');
      expect(result!.exp).toBe(9999999999);
      expect(result!.iat).toBe(1000000000);
    });

    it('retorna null para token vacío', () => {
      expect(tokenUtils.decodePayload('')).toBeNull();
    });

    it('retorna null para token sin dos partes', () => {
      expect(tokenUtils.decodePayload('solouna.parte')).toBeNull();
    });

    it('retorna null para token con payload malformado', () => {
      const token = 'header.esto-no-es-json.signature';
      expect(tokenUtils.decodePayload('header.invalidpayload.signature')).toBeNull();
    });

    it('retorna null para token con payload que no cumple el schema', () => {
      // Payload sin "exp" (campo requerido)
      const base64 = btoa(JSON.stringify({ sub: 'test' }));
      const token = `header.${base64}.signature`;
      expect(tokenUtils.decodePayload(token)).toBeNull();
    });
  });

  describe('isValid', () => {
    it('retorna false para token null', () => {
      expect(tokenUtils.isValid(null)).toBe(false);
    });

    it('retorna false para token vacío', () => {
      expect(tokenUtils.isValid('')).toBe(false);
    });

    it('retorna false para token expirado', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600, iat: 1000000000, sub: 'abc' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64}.sig`;
      expect(tokenUtils.isValid(token)).toBe(false);
    });

    it('retorna true para token vigente', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 7200; // 2 horas en el futuro
      const payload = { exp: futureExp, iat: 1000000000, sub: 'abc' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64}.sig`;
      expect(tokenUtils.isValid(token)).toBe(true);
    });
  });

  describe('needsRefresh', () => {
    it('retorna true para token null', () => {
      expect(tokenUtils.needsRefresh(null)).toBe(true);
    });

    it('retorna true para token a punto de expirar', () => {
      const nearExpiry = Math.floor(Date.now() / 1000) + 300; // 5 minutos
      const payload = { exp: nearExpiry, iat: 1000000000, sub: 'abc' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64}.sig`;
      // threshold default 1800 (30 min) - expira en 5 min, necesita refresh
      expect(tokenUtils.needsRefresh(token)).toBe(true);
    });

    it('retorna false para token con mucha vida', () => {
      const farFuture = Math.floor(Date.now() / 1000) + 7200; // 2 horas
      const payload = { exp: farFuture, iat: 1000000000, sub: 'abc' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64}.sig`;
      expect(tokenUtils.needsRefresh(token)).toBe(false);
    });
  });

  describe('getLifetimeDiagnostic', () => {
    it('retorna "Invalid Token" para token inválido', () => {
      expect(tokenUtils.getLifetimeDiagnostic('bad-token')).toBe('Invalid Token');
    });

    it('retorna "Expira en X min" para token vigente', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hora
      const payload = { exp: futureExp, iat: 1000000000, sub: 'abc' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64}.sig`;
      const result = tokenUtils.getLifetimeDiagnostic(token);
      expect(result).toMatch(/Expira en \d+ min/);
    });

    it('retorna "Expirado" para token vencido', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hora atrás
      const payload = { exp: pastExp, iat: 1000000000, sub: 'abc' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64}.sig`;
      expect(tokenUtils.getLifetimeDiagnostic(token)).toBe('Expirado');
    });
  });
});
