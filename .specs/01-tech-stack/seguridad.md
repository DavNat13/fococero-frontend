# Seguridad - FocoCero

Modelo de confianza cero para sistema de incendios forestales. JWT como unico mecanismo de autenticacion interna. Clean Architecture en cada capa de seguridad.

## Flujo JWT

El sistema emite y verifica tokens JSON Web Token (JWT) segun RFC 7519. El flujo completo:

```
Cliente -> Firebase SDK -> Firebase Auth -> idToken (JWT) -> Gateway -> Admin SDK -> verifyIdToken() -> Microservicio
```

1. **Cliente movil**: Firebase SDK 12 obtiene `idToken` tras autenticacion OAuth 2.0 con PKCE
2. **Almacenamiento**: `expo-secure-store` guarda el `accessToken` con cifrado AES-256-GCM (Keychain iOS, Keystore Android)
3. **Envio**: Axios 1.15 inyecta el token en header `Authorization: Bearer` mediante interceptor
4. **Gateway**: middleware `extractToken` parsea el `idToken`, verifica `exp`, `iat`, `aud`, `iss`
5. **Verificacion**: `admin.auth().verifyIdToken(idToken)` retorna `DecodedIdToken` con `uid`, `email`, `claims`
6. **Microservicio**: `req.user` se inyecta con `uid`, `roles` (`admin`, `bombero`, `analista`, `ciudadano`)

```typescript
// auth.ts - middleware de verificacion JWT
const verifyIdToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });

  const decoded = await admin.auth().verifyIdToken(token); // RFC 7519
  req.user = { uid: decoded.uid, email: decoded.email, roles: decoded.roles ?? [] };
  next();
};
```

## RBAC (Role-Based Access Control)

Cada ruta protegida tiene un `authorizeRole` middleware:

```typescript
const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.some((r) => req.user.roles.includes(r)))
      return res.status(403).json({ error: 'FORBIDDEN' });
    next();
  };
};
```

Roles: `admin`, `bombero`, `analista`, `ciudadano`. El rol se obtiene de `req.user.roles` decodificado del `idToken`. No se consulta base de datos en cada request.

## Seguridad en Capas

### Capa 1: Transporte (HTTPS + Helmet)

| Header | Valor | Proposito |
|--------|------|-----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Previene downgrade HTTP |
| `X-Content-Type-Options` | `nosniff` | Previene MIME sniffing |
| `X-Frame-Options` | `DENY` | Previene clickjacking |
| `Content-Security-Policy` | `default-src 'self'` | Previene XSS |

### Capa 2: Gateway (Rate Limiting + CORS + Validation)

| Componente | Configuracion | Proposito |
|-----------|--------------|-----------|
| cors | `origin: ['https://app.fococero.app']` | Solo origenes autorizados |
| express-rate-limit | `windowMs: 15 * 60 * 1000, max: 100` | 100 requests por 15 min por IP |
| Zod validation | `z.string().min(1).max(255)` | Sanitizacion de input |

### Capa 3: Microservicio (Token Interno)

```typescript
const validateInternalToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-internal-token'];
  if (!token || !crypto.timingSafeEqual(token, process.env.INTERNAL_SECRET))
    return res.status(403).json({ error: 'FORBIDDEN' });
  next();
};
```

El `token` interno (`INTERNAL_SECRET`) se compara con `crypto.timingSafeEqual()` para prevenir timing attacks. No se usa `===`.

### Capa 4: Base de Datos (Postgres + PostGIS + Zod)

| Medida | Detalle |
|--------|---------|
| Parametrizacion | `pg` pool con `$1`, `$2` |
| Validacion | `z.object()` en cada DTO espacial |
| GeoJSON | `ST_MakeEnvelope` con `ST_Contains` |

PostGIS no escapa `ST_*` funciones; la validacion Zod previene inyeccion de geometrias arbitrarias.

## Privacidad de Datos

- **PII**: solo `email` y `uid` circulan en tokens. `name` y `phone` no se incluyen en el JWT
- **Logging**: `console.log` nunca imprime `req.user.uid` ni `req.headers.authorization`
- **Cifrado**: `expo-secure-store` cifra con `crypto.subtle.encrypt()`. No `AsyncStorage`
- **Backup**: `SecureStore` no se incluye en backups de iCloud/Google Drive

## Vulnerabilidades Mitigadas

| Vulnerabilidad | Mitigacion |
|--------------|-----------|
| JWT Replay | `jti` (JWT ID) unico. `exp` corto (1h). Blacklist en Redis |
| Token Injection | `crypto.timingSafeEqual` en `INTERNAL_SECRET` |
| Rate Limiting Bypass | `express-rate-limit` con Redis store |
| SQL Injection | `z.object()` + `pg` pool parametrizado |
| XSS | `helmet.contentSecurityPolicy` |
| Privilege Escalation | `authorizeRole` en cada ruta. `req.user.role` verificado contra `roles` del token