# Fase 1: Fundacion

> Monorepo, contenedores, base de datos espacial y gateway. La base sobre la que se construyen los 8 microservicios.

---

## Monorepo workspace

El proyecto se organiza como un monorepo con npm workspaces. Cada microservicio reside en `services/ms-*` y comparte configuraciones base de TypeScript, ESLint y Prettier.

```
/
├── services/
│   ├── api-gateway/
│   ├── ms-auth/
│   ├── ms-geo/
│   └── ...
├── docker-compose.yml
├── .eslint.config.js
├── tsconfig.base.json
└── package.json (workspaces)
```

## Docker Compose

El archivo `docker-compose.yml` orquesta **11 servicios** en total:

| Servicio     | Imagen                  | Puerto  |
| ------------ | ----------------------- | ------- |
| postgis-main | postgis/postgis:16-3.4  | 5432    |
| postgis-geo  | postgis/postgis:16-3.4  | 5433    |
| redis        | redis:7-alpine          | 6379    |
| eureka-server| steeltoeoss/eureka-server| 8761   |
| api-gateway  | node:20-alpine          | 3000    |
| ms-auth      | node:20-alpine          | 4001    |
| ms-geo       | node:20-alpine          | 4002    |
| ms-alertas   | node:20-alpine          | 4003    |
| ms-reportes  | node:20-alpine          | 4004    |
| ms-multimedia| node:20-alpine          | 4005    |
| ms-emergencias| node:20-alpine         | 4006    |
| ms-analitica | node:20-alpine          | 4007    |

Todos los contenedores comparten una red bridge interna (`fococero-net`).

## PostGIS y datos espaciales

Se utiliza PostgreSQL 16 con la extension PostGIS 3.4. La base de datos principal (`db_geo`) almacena poligonos de incendios, puntos de interes y zonas de riesgo. Los indices GIST sobre geometrias permiten consultas spatiales como ST_Contains, ST_DWithin y ST_Intersects.

Cada microservicio tiene su propia base de datos con scripts de inicializacion numerados (`001-init.sql`, `002-seed.sql`).

## API Gateway

El gateway centraliza:

- Enrutamiento a cada microservicio por prefijo de ruta (`/auth/*`, `/geo/*`, `/alertas/*`, etc.)
- Middleware de autenticacion: verifica el token JWT de Firebase antes de reenviar
- Middleware de seguridad:
  - **Helmet**: headers HTTP seguros (X-Content-Type-Options, CSP, etc.)
  - **CORS**: lista blanca de origenes permitidos
  - **rate-limit**: 100 peticiones por minuto por IP
- Proxy reverso con `http-proxy-middleware`

## ESLint + Prettier + TypeScript strict

La configuracion de ESLint usa **Flat Config** (eslint.config.js) con reglas estrictas de TypeScript:

- `@typescript-eslint/strict-type-checked`
- `@typescript-eslint/stylistic-type-checked`
- Prohibicion de `any` explicito
- Prohibicion de `as` casts sin validacion
- Prohibicion de `require()` en modulo ES

Prettier se ejecuta como plugin de ESLint para evitar conflictos.

## Seguridad fundacional

En esta fase se establecen las bases de seguridad:

- **JWT**: verificacion de tokens Firebase en el gateway. Cada request autenticado incluye el uid y los claims del usuario en `req.user`.
- **Helmet**: previene ataques XSS, clickjacking y MIME sniffing.
- **Rate limiting**: mitigacion de ataques de fuerza bruta y DDoS basicos.
- **CORS**: solo origenes explicitos, sin wildcards en produccion.
- **Variables de entorno**: todas las credenciales via archivo `.env`, nunca en codigo fuente.

## Vulnerabilidades mitigadas

| Vulnerabilidad        | Mitigacion                          |
| --------------------- | ----------------------------------- |
| XSS                   | Helmet CSP, escaping en respuestas  |
| Clickjacking          | Helmet X-Frame-Options              |
| MIME sniffing         | Helmet X-Content-Type-Options       |
| Fuerza bruta          | rate-limit por IP                   |
| Token reutilizacion   | Verificacion JWT por request        |
| Exposicion de puertos | Red interna Docker, solo gateway expuesto |
