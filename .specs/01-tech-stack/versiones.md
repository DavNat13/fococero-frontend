# Versiones - FocoCero

Tabla de versiones de todos los runtimes, SDKs, bases de datos y herramientas del sistema de gestion de incendios forestales. Clean Architecture exige versiones fijas. Seguridad JWT requiere compatibilidad entre componentes.

## Runtimes

| Componente | Minima | Recomendada | Instalacion | Nota |
|-----------|--------|------------|------------|------|
| Node.js | 22.0.0 | 22.12.0 LTS | `nvm install 22` | `--openssl-legacy-provider` no necesario |
| npm | 10.9.0 | 11.0.0 | `npm install -g npm@latest` | `npm ci --strict` en CI |
| Docker | 24.0.0 | 27.0.0 | `winget install Docker.DockerDesktop` | multi-stage builds |
| Docker Compose | 2.24.0 | 2.29.0 | `docker compose version` | plugin incluido |

## SDKs y Frameworks

| Componente | Minima | Recomendada | Platforma | Seguridad |
|-----------|--------|------------|----------|-----------|
| React Native | 0.81.0 | 0.81.5 | Mobile | `react-native.config.js` |
| Expo SDK | 54 | 54 | Mobile | `expo build` |
| Expo Router | 6 | 6 | Mobile | `expo-router` |
| TypeScript | 5.5 | 5.9 strict | Ambas | `strict: true`, `noUncheckedIndexedAccess` |
| Express (Gateway) | 4.18 | 4.21 | Backend | `http-proxy-middleware` |
| Express (MS) | 5.0 | 5.1 | Backend | `express-rate-limit` |
| Firebase SDK Web | 12 | 12 | Frontend | `auth` |
| Firebase Admin SDK | 18 | 18 | Backend | `admin.auth()` |
| Eureka (Steeltoe) | 4 | 4 | Backend | `service-discovery` |
| PostGIS | 3.3 | 3.4 | Backend | `ST_MakeEnvelope` |
| Zod | 4 | 4 | Ambas | `strictNullChecks` |

## Bases de Datos

| Componente | Version | TTL | Seguridad |
|-----------|--------|-----|-----------|
| PostgreSQL | 15 | - | `pg` pool parametrizado |
| PostGIS | 3.3 | - | `ST_Contains`, `ST_DWithin` |
| Redis | 7 Alpine | TTL 300s (cache) | `EXPIRE` |

## Herramientas de Testing

| Herramienta | Minima | Recomendada | Coverage |
|-----------|--------|------------|---------|
| Jest | 29 | 30 | `branches: 60`, `functions: 70`, `lines: 75` |
| @testing-library/react-native | 12 | 12 | `queries` |
| Supertest | 6 | 7 | `http` |

## Herramientas de Lint

| Herramienta | Version | Configuracion |
|-----------|--------|-------------|
| ESLint | 9 | `eslint.config.mjs` flat |
| Prettier | 3 | `prettier --check` |

## Herramientas de Seguridad

| Herramienta | Version | Proposito |
|-----------|--------|-----------|
| Helmet | 7 | `helmet.contentSecurityPolicy` |
| CORS | 2 | `corsOptions.origin` |
| express-rate-limit | 7 | `rate-limit` con Redis store |
| crypto | built-in | `timingSafeEqual`, `randomBytes` |
| expo-secure-store | built-in | `setItemAsync`, `getItemAsync` |

## Vulnerabilidades por Version

| Componente | Version Obsoleta | Riesgo | Mitigacion |
|-----------|---------------|-------|-----------|
| TypeScript < 5.5 | `noUncheckedIndexedAccess` no activo | `any` implicito | Actualizar a 5.9 |
| Node < 22 | `--openssl-legacy-provider` no soporta | JWT firma debil | `nvm install 22` |
| Express < 5 | `express-rate-limit` no integrado | Rate limit bypass | Actualizar a 5 |
| Firebase Admin < 18 | `verifyIdToken` deprecated | Token expiracion sin verificar | Actualizar a 18 |
| PostGIS < 3.3 | `ST_*` funciones no seguras | Inyeccion espacial | Actualizar a 3.3 |

## Recomendaciones de Version

- **Nunca `latest`**: siempre version especifica (`postgres:15-alpine`, `redis:7-alpine`)
- **Nunca `*`**: `package.json` usa `~` (patch) o `^` (minor) con `resolutions`
- **Siempre `lock`**: `package-lock.json` y `yarn.lock` bloquean dependencias transitivas
- **Siempre `audit`**: `npm audit` en cada PR detecta versiones con CVEs

## Clean Architecture en Versiones

Cada capa tiene su propio `package.json`:

- **Capa de dominio**: `zod@4`, `typescript@5.9` (solo validacion, sin runtime)
- **Capa de aplicacion**: `express@5`, `firebase-admin@18` (API)
- **Capa de infraestructura**: `pg@8`, `redis@7`, `docker@24` (infra)

La capa de dominio no sabe que `express` corre en version 4 o 5. Solo la capa de infraestructura conoce la version de la herramienta.