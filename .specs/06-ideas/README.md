# FocoCero — Mapa de Funcionalidades

> Documento maestro de trazabilidad entre microservicios, roles, y capacidades del sistema de gestion de incendios forestales.

## Arquitectura de Microservicios

| Microservicio | Puerto | Base Path | Autenticacion | Base de Datos |
|---|---|---|---|---|
| ms-auth | 3001 | /api/auth | Firebase + JWT | PostgreSQL + Firebase Admin |
| ms-geo | 3002 | /api/geo | JWT (opcional en reads) | PostgreSQL + PostGIS |
| ms-alertas | 3003 | /api/alertas | JWT | PostgreSQL |
| ms-reportes | 3004 | /api/reportes | JWT | PostgreSQL |
| ms-multimedia | 3005 | /api/multimedia | JWT | S3 + PostgreSQL |
| ms-emergencias | 3006 | /api/emergencias | JWT | PostgreSQL |
| ms-analitica | 3007 | /api/analitica | JWT | PostgreSQL + Redis 7 |

## Matriz de Funcionalidades por Rol

| Funcionalidad | Ciudadano | Brigadista | Admin | Microservicio |
|---|---|---|---|---|
| Registro (guest/full) | SI | - | - | ms-auth |
| Login (email/Google) | SI | SI | SI | ms-auth |
| Perfil propio (CRUD) | SI | SI | SI | ms-auth |
| Gestion usuarios | - | - | CRUD total | ms-auth |
| Ver alertas | SI | SI | SI | ms-alertas |
| Crear alertas | - | SI | SI | ms-alertas |
| Cambiar estado alerta | - | SI | SI | ms-alertas |
| Verificar alerta | - | SI | SI | ms-alertas |
| Crear reportes | SI | SI | SI | ms-reportes |
| Cambiar estado reporte | - | SI | SI | ms-reportes |
| Ver mapa incendios | SI | SI | SI | ms-geo |
| Reportar foco | SI | SI | SI | ms-geo |
| Gestionar focos | - | SI | SI | ms-geo |
| Crear despachos | - | SI | SI | ms-emergencias |
| Tracking emergencias | - | SI | SI | ms-emergencias |
| Dashboard analitico | - | SI | SI | ms-analitica |
| Exportar datos | - | - | SI | ms-analitica |
| Subir multimedia | SI | SI | SI | ms-multimedia |

## Prioridad de Implementacion

1. **P0 — Core Auth**: Registro, login, JWT, RBAC, guest access (ms-auth)
2. **P0 — Geo**: Reportar focos, mapa, PostGIS queries (ms-geo)
3. **P0 — Alertas**: CRUD, niveles, verificacion, notificaciones (ms-alertas)
4. **P1 — Reportes**: Sistema de reportes ciudadanos, categorias, historial (ms-reportes)
5. **P1 — Multimedia**: Upload/download de evidencias (ms-multimedia)
6. **P2 — Emergencias**: Despachos, idempotencia, agencias externas (ms-emergencias)
7. **P2 — Analitica**: Dashboard, metricas, exportacion, ML predictivo (ms-analitica)

## Seguridad y Privacidad

- **JWT**: Emitido por Firebase Admin SDK, verificado en Gateway Kong antes de propagar a microservicios
- **RBAC**: Middleware `authorizeRole()` en cada endpoint protegido
- **Rate Limiting**: 100 req/min por API key en Gateway
- **HTTPS**: Obligatorio en produccion; HSTS habilitado
- **Datos personales**: Solo nombre, email, foto; almacenados con cifrado en reposo
- **Auditoria**: Logs estructurados de todas las operaciones CRUD

## DevOps

- CI/CD con GitHub Actions: lint, test, build, deploy
- Contenedores Docker + ECS Fargate
- Redis 7 para cache analitica y sesiones
- Health checks en `/health` de cada microservicio
- Prometheus + Grafana para monitoreo

## Vulnerabilidades Conocidas y Mitigaciones

| Vulnerabilidad | Mitigacion |
|---|---|
| Inyeccion SQL | ORM con parametrizacion (Sequelize/Knex) |
| XSS | Sanitizacion en frontend (DOMPurify) |
| JWT reutilizado | TTL 15 min + refresh token rotativo |
| Acceso no autorizado | Middleware `authorizeRole()` en cada ruta |
| Datos expuestos | Solo fields autorizados por rol en responses |
