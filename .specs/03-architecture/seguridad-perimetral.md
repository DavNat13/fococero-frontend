# Seguridad Perimetral

## Principio de Defensa en Profundidad

La seguridad en FocoCero se implementa en multiples capas. Ningun componente confia en la capa anterior.

```
[Internet/Cliente]
    |
    v
[1] HTTPS/TLS        -> Cifrado en transito
[2] Helmet           -> Headers HTTP de seguridad (CSP, HSTS, X-Frame-Options)
[3] CORS             -> Whitelist de origenes permitidos
[4] Rate Limit       -> Limite de requests por IP (5/min en auth, 100/min general)
[5] JWT Verification -> Firebase Admin verifyIdToken()
[6] RBAC             -> authorizeRole middleware
[7] Internal Token   -> JWT HMAC-SHA256 entre servicios
[8] Zod Validation   -> Validacion de esquemas en todas las entradas
[9] Parametrized SQL -> Queries parametrizadas en todos los repositorios
[10] SecureStore     -> Almacenamiento seguro de tokens en cliente
```

## Capa 1: Helmet (HTTP Security Headers)

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.fococero.cl"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

Previene: XSS, clickjacking, MIME sniffing, referrer leakage.

## Capa 2: CORS

```javascript
const cors = require('cors');

const whitelist = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:8081'];  // Expo dev

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Idempotency-Key'],
  exposedHeaders: ['X-Trace-Id'],
}));
```

## Capa 3: Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// Endpoints de autenticacion: 5 intentos por minuto
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiados intentos. Intenta de nuevo en 1 minuto.' },
});

// Endpoints generales: 100 requests por minuto
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);
```

## Capa 4: JWT Verification (Firebase Admin SDK)

Ver detalle completo en `autenticacion.md`. Punto critico: el Gateway verifica el JWT con `admin.auth().verifyIdToken(token)` que usa las claves publicas RS256 de Firebase, no una implementacion propia.

## Capa 5: RBAC (Role-Based Access Control)

Cuatro roles definidos con permisos progresivos:

| Rol | Permisos |
|---|---|
| INVITADO | Acceso de solo lectura al mapa público y alertas activas |
| USUARIO | Crear reportes, ver sus reportes, ver mapa publico, ver alertas activas |
| BRIGADISTA | Todo lo de USUARIO + gestionar alertas, ver emergencias, acceder a dashboard |
| ADMIN | Todo lo de BRIGADISTA + gestionar usuarios, configurar sistema, acceder a analitica completa |

## Capa 6: Internal Token (Inter-Service)

- Algoritmo: HMAC-SHA256.
- Secreto: `INTERNAL_TOKEN_SECRET` (variable de entorno, 256 bits minimo).
- TTL: 60 segundos.
- Validacion en cada microservicio via middleware `InternalAuthMiddleware`.

## Capa 7: Zod Validation (Input Validation)

Todas las entradas HTTP (body, query, params) se validan con esquemas Zod antes de ser procesadas.

```javascript
const { z } = require('zod');

const createReporteSchema = z.object({
  ubicacion: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  descripcion: z.string().min(10).max(500),
  fotos: z.array(z.string().url()).max(5).optional(),
});

router.post('/reportes', FirebaseAuthMiddleware, async (req, res) => {
  const parsed = createReporteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, errors: parsed.error.errors });
  }
  // ...
});
```

## Capa 8: Trace ID (Request Tracing)

Cada request entrante recibe un `x-trace-id` (UUIDv4) que se propaga a traves del Gateway y los microservicios via headers HTTP.

```javascript
const traceIdMiddleware = (req, res, next) => {
  req.traceId = req.headers['x-trace-id'] || crypto.randomUUID();
  res.setHeader('x-trace-id', req.traceId);
  next();
};
```

## Almacenamiento Seguro en Cliente (SecureStore)

Todo dato sensible en el dispositivo movil se almacena en `expo-secure-store`:

- JWT de Firebase (`auth_token`).
- Refresh token de Firebase (`refresh_token`).
- Datos biometricos (opcional).

AsyncStorage solo se usa para cache no sensible (reportes vistos, preferencias de UI).

## Vulnerabilidades Abordadas

| Vulnerabilidad | Mitigacion |
|---|---|
| SQL Injection | Queries parametrizadas |
| XSS | Helmet + React Native (sin DOM) |
| CSRF | JWT en header (no cookies) |
| Broken Authentication | Firebase Admin verifyIdToken |
| Sensitive Data Exposure | SecureStore |
| Security Misconfiguration | Helmet defaults |
| DoS | Rate limiting + pool limit |
| Broken Access Control | RBAC en Gateway + MS |
