# Arquitectura de FocoCero

> Sistema de gestion de incendios forestales con frontend React Native (Expo) y backend de microservicios Node.js.

## Proposito

Documentar la arquitectura completa del sistema FocoCero, incluyendo decisiones tecnologicas, flujos de autenticacion, estrategia de datos offline, seguridad perimetral y despliegue DevOps.

## Principios Arquitectonicos

- **Clean Architecture**: Separacion en capas (controllers / services / repositories) en cada microservicio siguiendo el patron hexagonal.
- **Feature-Sliced Design** (FSD): Organizacion del frontend por funcionalidad, no por tipo de archivo.
- **Offline-first**: El sistema debe funcionar sin conectividad constante, sincronizando datos mediante el patron Outbox.
- **Seguridad por capas**: JWT (Firebase Auth) + token interno + RBAC + validacion Zod + parametrizacion SQL.

## Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| Frontend | Expo SDK 52, React Native 0.76, Expo Router |
| Estado global | Zustand 5 |
| Estado servidor | TanStack React Query 5 |
| API Gateway (BFF) | Express 4, http-proxy-middleware 3 |
| Microservicios (x7) | Node.js, Express 4, hexagonal |
| Servicio descubrimiento | Eureka Server (Steeltoe) |
| Cache | Redis 7 Alpine |
| Mensajeria | RabbitMQ (configurado, no operacional) |
| Base de datos | PostgreSQL 15 + PostGIS 3.3 |
| Autenticacion | Firebase Auth + Firebase Admin SDK |
| Contenedores | Docker Compose, multi-stage builds |

## Seguridad (JWT y Clean Architecture)

La autenticacion JWT sigue el flujo:

1. Firebase Auth emite un ID Token (JWT RFC 7519) desde el cliente.
2. El API Gateway valida el token con `admin.auth().verifyIdToken()`.
3. Gateway genera un JWT interno (`x-internal-token`) con claims minimos y lo propaga a los microservicios.
4. Cada microservicio verifica el token interno mediante un secreto compartido.
5. El middleware `authorizeRole` (`INVITADO`, `USUARIO`, `BRIGADISTA`, `ADMIN`) protege rutas especificas.

El uso de tokens JWT en todas las comunicaciones internas asegura que no existan puntos de confianza ciega dentro del sistema.

## Estrategia frente a Vulnerabilidades

Cada capa de la arquitectura aborda vectores de ataque OWASP Top 10:

- **Inyeccion SQL**: Queries parametrizadas en todos los repositorios. Sin concatenacion de cadenas.
- **XSS**: Helmet para headers HTTP + React Native (sin DOM manipulable).
- **CSRF**: Token-based auth (JWT en headers) elimina la necesidad de tokens CSRF.
- **Broken Authentication**: Firebase Admin SDK gestiona la verificacion segura de tokens. Los tokens internos usan HMAC-SHA256 con rotacion de secreto.
- **Sensitive Data Exposure**: SecureStore en cliente. Sin almacenamiento de tokens en AsyncStorage.

## Privacidad y Datos

- Los datos geoespaciales de reportes se almacenan con precision ajustable (GEOGRAPHY en PostGIS) para evitar la localizacion exacta de denunciantes.
- El cifrado en reposo se delega a PostgreSQL (TDE si el SO lo soporta) o a nivel de disco.
- Los logs de auditoria (traceId) no incluyen datos personales.

## DevOps

- 11 servicios en Docker Compose con health checks.
- Multi-stage builds (node:22-alpine) para imagenes minimas.
- CI/CD via GitHub Actions + EAS Build para el frontend.
- Variables de entorno por servicio, gestionadas via `.env` y vault en produccion.

## Vulnerabilidades Conocidas y Mitigacion

Ver documento `vulnerabilidades.md` para el analisis detallado OWASP Top 10.

## Servicios

| Servicio | Puerto | DB | Autenticacion |
|---|---|---|---|
| api-gateway | :3000 | - | Firebase JWT + interno |
| ms-auth | :3001 | auth_db | Interno |
| ms-geo | :3002 | geo_db | Interno + RBAC |
| ms-alertas | :3003 | alertas_db | Interno + RBAC |
| ms-reportes | :3004 | reportes_db | Interno + RBAC |
| ms-multimedia | :3005 | multimedia_db | Interno |
| ms-emergencias | :3006 | emergencias_db | Interno + RBAC |
| ms-analitica | :3007 | analitica_db | Interno |
| eureka-server | :8761 | - | - |
| redis | :6379 | - | - |
| rabbitmq | :5672 / :15672 | - | - |

## Documentos Relacionados

- `vision-general.md` - Diagrama topologico y patrones de comunicacion
- `patron-fsd.md` - Feature-Sliced Design en frontend
- `api-gateway.md` - Arquitectura BFF
- `microservicios.md` - Detalle de cada microservicio
- `base-datos.md` - Estrategia de base de datos
- `autenticacion.md` - Flujo JWT completo
- `seguridad-perimetral.md` - Capas de seguridad
- `offline-architecture.md` - Estrategia offline-first
- `devops-deploy.md` - Infraestructura y CI/CD
- `vulnerabilidades.md` - Analisis OWASP Top 10
