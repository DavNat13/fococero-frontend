# Backend Roadmap - FocoCero

> Microservicios en Node.js para la gestion de incendios forestales. Backend completado en 6 fases con arquitectura hexagonal, descubrimiento de servicios y analitica predictiva.

## Estado del proyecto

El backend de FocoCero esta completamente implementado. Consta de **8 microservicios** operativos, 7 bases de datos independientes con PostGIS, un gateway centralizado y un sistema de descubrimiento de servicios basado en Eureka (Steeltoe). La fase 6 documenta los proximos pasos planificados pero no iniciados.

## Tecnologias principales

| Componente        | Tecnologia                                     |
| ----------------- | ---------------------------------------------- |
| Runtime           | Node.js 20 LTS + TypeScript strict             |
| Framework API     | Express con middlewares de seguridad            |
| Gateway           | Express + Helmet + CORS + rate-limit           |
| Base de datos     | PostgreSQL 16 + PostGIS 3.4                    |
| Cache distribuido | Redis 7                                        |
| Service discovery | Eureka Server (Steeltoe) + cliente custom      |
| Contenedores      | Docker + Docker Compose (11 servicios)         |
| CI/CD             | GitHub Actions (lint + build)                  |
| Linter            | ESLint Flat Config + Prettier                  |

## Microservicios completados

| Servicio        | Base de datos | Proposito                                   |
| --------------- | ------------- | ------------------------------------------- |
| ms-auth         | db_auth       | Autenticacion Firebase + JWT + RBAC         |
| ms-geo          | db_geo        | Consultas espaciales PostGIS, GIST indexes  |
| ms-alertas      | db_alertas    | CRUD alertas, historial, soft delete        |
| ms-reportes     | db_reportes   | Reportes con categorias y estados           |
| ms-multimedia   | db_multimedia | Subida, descarga y eliminacion de archivos  |
| ms-emergencias  | db_emergencias| Despacho con idempotencia y reintentos      |
| ms-analitica    | db_analitica  | Dashboard, predicciones ML, cache Redis     |
| api-gateway     | N/A           | Proxy, autenticacion, rate limiting         |

## Arquitectura

Cada microservicio sigue **arquitectura hexagonal** (puertos y adaptadores) con separacion en controllers, services, repositories y models. El patron de descubrimiento es cliente/servidor Eureka: todos los servicios se registran al iniciar y se deregitran en el apagado graceful.

## Seguridad

- Autenticacion delegada a Firebase Admin SDK con verificacion JWT en el gateway
- RBAC por roles (admin, brigadista, analista, ciudadano)
- Headers de seguridad via Helmet
- Rate limiting global por IP
- CORS configurado por origen explicito

## Fases del roadmap

| Fase | Estado     | Contenido                                                   |
| ---- | ---------- | ----------------------------------------------------------- |
| 1    | Completado | Fundacion: monorepo, Docker Compose, PostGIS, gateway       |
| 2    | Completado | Microservicios core: auth, geo, alertas, reportes, multimedia|
| 3    | Completado | Service discovery: Eureka, graceful shutdown, hybrid network|
| 4    | Completado | Nuevos MS: emergencias, analitica, Redis, tablas particionadas|
| 5    | Completado | Estandarizacion: ms-template hexagonal, 18 skills, CI       |
| 6    | Pendiente  | Swagger unificado, tests >=80%, CI/CD full, RabbitMQ, tracing|

## Enlaces relacionados

- [Fase 1: Fundacion](./fase-1-fundacion.md)
- [Fase 2: Microservicios core](./fase-2-microservicios.md)
- [Fase 3: Service Discovery](./fase-3-service-discovery.md)
- [Fase 4: Nuevos microservicios](./fase-4-nuevos-ms.md)
- [Fase 5: Estandarizacion](./fase-5-estandarizacion.md)
- [Fase 6: Proximos pasos](./fase-6-proximos-pasos.md)
- [Plantilla ms-template](./ms-template-arquetipo.md)
