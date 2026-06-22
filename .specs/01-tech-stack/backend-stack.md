# Stack Backend - FocoCero

Arquitectura de microservicios para gestion de incendios forestales. Cada servicio sigue el patron Clean Architecture con capas de dominio, aplicacion e infraestructura. Seguridad JWT en todas las comunicaciones.

## Runtime y Lenguaje

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Node.js | 22 LTS | Runtime con soporte nativo para Fetch API, WebSocket. Seguridad: sandbox de procesos |
| TypeScript | 5.9 (strict) | Compilacion a JS con tipado. `strictNullChecks` elimina `undefined` no controlados |

## Framework y Puerta de Entrada

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Express.js (Gateway) | 4 | API Gateway como unico punto de entrada. Middleware de seguridad JWT |
| Express.js (Microservicios) | 5 | Servidores individuales con middleware aislado |

El Gateway implementa `http-proxy-middleware` 3 con verificacion JWT en cada ruta protegida. Los microservicios Express 5 corren en modo `strictRouting` para prevenir conflictos de ruta.

## Base de Datos y Geoespacial

| Componente | Version | Proposito |
|-----------|---------|-----------|
| PostgreSQL | 15 | Base relacional con 7 bases separadas por dominio |
| PostGIS | 3.3 | Extension espacial. Geometrias GeoJSON, consultas ST_Contains, ST_DWithin |

Cada microservicio tiene su propia base: `auth_db`, `geo_db`, `alertas_db`, `reportes_db`, `multimedia_db`, `emergencias_db`, `analitica_db`. Esto aplica el principio de **Database per Service** de Clean Architecture: ninguna base es compartida entre dominios.

## Descubrimiento de Servicios

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Netflix Eureka | Steeltoe | Registro y descubrimiento. Los microservicios se registran al iniciar |

Eureka corre en el contenedor `eureka-server` con puerto 8761. Cada microservicio (puertos 3001-3007) se registra con un `heartbeat` de 30 segundos. El Gateway consulta Eureka para enrutar.

## Cache Distribuido

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Redis | 7 Alpine | Cache en memoria. TTL configurado por servicio. Soporte para rate limiting |

Redis almacena sesiones JWT revocadas (blacklist), cache de consultas PostGIS, y colas de rate limiting distribuidas. El TTL por defecto es 300 segundos con expiracion LRU.

## Autenticacion y Seguridad

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Firebase Admin SDK | - | Verificacion de JWTs. `admin.auth().verifyIdToken(idToken)` |
| Zod | 4 | Validacion de esquemas en runtime. `z.object()` en cada DTO |

El flujo de seguridad completo:

1. Cliente envia `accessToken` en header `Authorization: Bearer`
2. Gateway extrae el token con middleware `extractToken`
3. `admin.auth().verifyIdToken()` verifica firma, expiracion, issuer
4. Token decodificado se inyecta en `req.user` (uid, email, roles)
5. Microservicio recibe `req.user` con `claims` (RBAC)

Los microservicios se comunican entre si con un **token interno** (`INTERNAL_SECRET`) generado por el Gateway. Este token se valida con `crypto.timingSafeEqual()` para prevenir timing attacks.

## Validacion y Contenedores

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Docker | 24+ | Contenedores. Imagenes `node:22-alpine` multi-stage |
| Docker Compose | 2.24+ | Orquestacion local con 11 servicios |

## Testing

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Jest | - | Framework de testing |
| Supertest | - | Pruebas de integracion HTTP. Verifica status codes y payloads |

## Linting

| Componente | Version | Proposito |
|-----------|---------|-----------|
| ESLint (Flat Config) | 9 | `eslint.config.mjs` plano. Reglas personalizadas |
| Prettier | - | Formateo automatico. `prettier --check` en CI |

## Buenas Practicas de Seguridad

- **Helmet**: headers `X-Content-Type-Options`, `Strict-Transport-Security`
- **CORS**: lista blanca de origenes en `corsOptions.origin`
- **rate-limit**: `express-rate-limit` con almacenamiento Redis
- **Privacy**: no se loggean datos personales (PII). `console.log` filtrado por ESLint

## Arquitectura Limpia

Cada microservicio sigue:

- **Capa de Dominio**: entidades, value objects, interfaces de repositorio
- **Capa de Aplicacion**: casos de uso, DTOs validados con Zod
- **Capa de Infraestructura**: adaptadores (Express, Firebase, Postgres, Redis)

Las dependencias fluyen hacia el dominio. La capa de infraestructura nunca importa la capa de dominio directamente; lo hace a traves de interfaces.

## Vulnerabilidades Mitigadas

- **Injection SQL**: consultas parametrizadas con `pg` pool. No concatenacion de strings
- **XSS**: Helmet bloquea `Content-Type` no autorizados
- **JWT Replay**: `jti` (JWT ID) unico por sesion. Blacklist en Redis
- **Privilege Escalation**: `authorizeRole` middleware verifica `req.user.role` contra `requiredRoles` en cada ruta protegida