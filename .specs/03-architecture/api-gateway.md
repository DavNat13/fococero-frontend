# API Gateway (BFF)

## Proposito

El API Gateway actua como Backend For Frontend (BFF): un unico punto de entrada para el frontend React Native que enruta peticiones a los microservicios, aplica seguridad centralizada y orquesta respuestas.

## Stack

| Componente | Version | Proposito |
|---|---|---|
| Express | 4.x | Framework HTTP |
| http-proxy-middleware | 3.x | Proxy reverso |
| Helmet | 7.x | Headers de seguridad HTTP |
| cors | 2.x | Control de acceso CORS |
| express-rate-limit | 7.x | Rate limiting |
| firebase-admin | 12.x | Verificacion de tokens JWT |
| jsonwebtoken | 9.x | Emision de token interno |
| zod | 3.x | Validacion de esquemas |

## Middleware Chain (Orden de Ejecucion)

```
Request entrante
    |
    v
[1] traceId Middleware     -> Inyecta x-trace-id en request y response headers
    |
    v
[2] Helmet                -> Headers de seguridad: CSP, HSTS, X-Frame-Options, etc.
    |
    v
[3] CORS                  -> Permite solo origenes en whitelist (.env)
    |
    v
[4] express-rate-limit    -> Limita intentos en rutas de auth (max 5/min)
    |
    v
[5] Firebase Auth MW      -> Verifica Authorization Bearer JWT
    |                        admin.auth().verifyIdToken(token)
    |                        Inyecta req.user = { uid, email, role }
    v
[6] Internal Token MW     -> Genera/inyecta x-internal-token JWT
    |                        Claims: { sub, role, iat, exp }
    v
[7] Proxy Middleware      -> http-proxy-middleware segun ruta
                            Resuelve target via Eureka Client
```

## Proxy Routing

| Ruta Frontend | Proxy Target |
|---|---|
| /api/auth/* | http://ms-auth:3001 |
| /api/geo/* | http://ms-geo:3002 |
| /api/alertas/* | http://ms-alertas:3003 |
| /api/reportes/* | http://ms-reportes:3004 |
| /api/multimedia/* | http://ms-multimedia:3005 |
| /api/emergencias/* | http://ms-emergencias:3006 |
| /api/analitica/* | http://ms-analitica:3007 |

No se utiliza versionado de API. Los targets se resuelven via Eureka Client en lugar de IPs fijas.

## Integracion con Eureka

```javascript
const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
  instance: {
    app: 'api-gateway',
    hostName: 'api-gateway',
    ipAddr: '172.x.x.x',
    port: { '$': 3000, '@enabled': true },
    vipAddress: 'api-gateway',
    statusPageUrl: 'http://api-gateway:3000/health',
    healthCheckUrl: 'http://api-gateway:3000/health',
  },
  eureka: {
    host: 'eureka-server',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});
```

Al iniciar el proxy, el Gateway consulta Eureka para resolver `ms-auth:3001` a IP real.

## Swagger / OpenAPI

El Gateway expone un endpoint `/api-docs` con la especificacion OpenAPI 3.1 agregada de todos los microservicios. Cada microservicio publica su spec en Eureka metadata.

## Seguridad

- El Gateway **no debe** almacenar claves privadas de Firebase en el repositorio. Se inyectan via variable de entorno `FIREBASE_SERVICE_ACCOUNT_KEY`.
- El token interno (`x-internal-token`) usa HMAC-SHA256 con secreto rotable `INTERNAL_TOKEN_SECRET`.
- Las rutas publicas (`/api/auth/register`, `/api/auth/login`) no pasan por el middleware de Firebase Auth.
- Zod valida el body de las rutas que reciben datos del frontend (login, registro) antes de proxy.

## Vulnerabilidades Mitigadas

- **Broken Access Control**: Validacion JWT en cada request entrante.
- **Security Misconfiguration**: Helmet establece defaults seguros.
- **Excessive Data Exposure**: El Gateway filtra headers sensibles antes de reenviar al frontend.
- **Rate Limiting**: Protege endpoints de auth contra fuerza bruta.
