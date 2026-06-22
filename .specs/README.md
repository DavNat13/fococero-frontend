# .specs — Especificaciones Técnicas Globales

## Proposito

Este directorio centraliza todas las especificaciones tecnicas, arquitectonicas y de diseno del sistema **FocoCero** (plataforma offline-first de gestion de incendios). Unifica la documentacion previamente distribuida en los subproyectos `fococero-backend/.specs/` y `fococero-frontend/.specs/`.

## Estructura

| Directorio | Contenido | Prioridad |
|---|---|---|
| `01-tech-stack/` | Stack tecnologico completo (frontend, backend, infra, devops, seguridad, dependencias, versiones) | [1] Conocimiento base |
| `02-ui-ux/` | Sistema de diseno: filosofia, colores, tipografia, iconografia, layout, componentes, navegacion, animaciones, notificaciones, estados, formularios, offline-first, pantallas, accesibilidad | [2] Experiencia de usuario |
| `03-architecture/` | Arquitectura del sistema: FSD, API Gateway, microservicios, Eureka, PostGIS, Redis, auth JWT, offline, seguridad, vulnerabilidades | [3] Estructural |
| `04-backend-roadmap/` | Roadmap del backend (COMPLETADO): 6 fases de desarrollo + ms-template | [4] Historial |
| `05-frontend-roadmap/` | Roadmap del frontend (EN PROGRESO): 7 fases UI + APIs integradas | [5] Planificacion activa |
| `06-ideas/` | Funciones detalladas del sistema: auth, alertas, reportes, geo, emergencias, analitica, multimedia, usuarios, permisos RBAC | [6] Dominio funcional |
| `skills/` | 18 estandares de codigo (call-site honesty, clean architecture, CQS, TDD, etc.) | [7] Calidad |
| `tasks/` | Tareas completadas (`done/`) y pendientes (`draft/`) | [8] Seguimiento |

## Principios Transversales

Cada archivo en `.specs/` incorpora los siguientes principios:

- **Seguridad informatica:** JWT (Firebase tokens RFC 7519), Helmet, CORS, rate-limit, validacion Zod
- **Privacidad:** SecureStore para datos sensibles, RBAC, minimizacion de datos en cache
- **Permisos:** RBAC (INVITADO/USUARIO/BRIGADISTA/ADMIN), middleware authorizeRole, route guards
- **DevOps:** Docker multi-stage, health checks, CI/CD GitHub Actions, EAS Build
- **Vulnerabilidades:** Cobertura OWASP Top 10, parametrizacion SQL, XSS/CSRF hardening
- **Clean Architecture:** FSD frontend, hexagonal backend, repositorios abstractos, DI

## Convenciones

- **Idioma:** Documentacion en espanol, codigo y terminos tecnicos en ingles
- **Formato:** Markdown, maximo 200 lineas por archivo
- **Actualizacion:** Mantener sincronizado con el codigo fuente tras cada cambio significativo

## Autores

- Mauro Almonacid
- Ignacio Chacon
- David Nahuelcar

Proyecto desarrollado para **DSY1106: DESARROLLO FULLSTACK III** — DUOC UC
