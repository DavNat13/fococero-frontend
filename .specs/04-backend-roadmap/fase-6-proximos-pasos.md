# Fase 6: Proximos Pasos (Pendiente)

> Trabajo planificado pero no iniciado. Estas tareas completarian el ciclo de desarrollo para produccion.

---

## 1. Documentacion unificada con Swagger/OpenAPI

Cada microservicio expone un endpoint `/api-docs` con su especificacion OpenAPI individual. El objetivo es unificarlas en un solo punto de acceso a traves del API Gateway.

**Estado**: Pendiente de implementar.

**Beneficios**:
- Documentacion centralizada accesible en `https://api.fococero.com/docs`
- Cliente SDK generable automaticamente
- Validacion de requests/responses contra schema
- Testing de contratos entre servicios

## 2. Pruebas unitarias con cobertura >= 80%

Actualmente no existen tests automatizados. Se requiere:

- Framework: Vitest o Jest con TypeScript
- Cobertura minima: 80% en statements, branches, functions, lines
- CI bloqueante si cobertura baja del umbral
- Mocking de Firebase Admin SDK, Eureka Client, Redis, pool de BD

**Prioridad**: Alta. Sin tests, no es seguro refactorizar ni desplegar a produccion.

## 3. Pipeline CI/CD completo

El pipeline actual solo ejecuta lint y build. El objetivo es:

- **CI**: lint -> test -> build -> docker build -> push a registry (Docker Hub o GitHub Container Registry)
- **CD**: deploy automatico a entorno staging (VPS o Kubernetes) desde rama develop
- **CD**: deploy a produccion desde rama main con aprobacion manual
- **SonarQube** o similar para analisis de calidad de codigo

## 4. Mensajeria asincrona con RabbitMQ

Actualmente toda la comunicacion entre servicios es sincrona via HTTP. Se planifica:

- **RabbitMQ** como message broker para eventos asincronos
- Eventos: `alerta.creada`, `reporte.confirmado`, `emergencia.asignada`
- Consumidores en ms-analitica, ms-alertas, ms-notificaciones (nuevo)
- Patron event-driven para desacoplar servicios

**Estado**: Pendiente. Se evaluo RabbitMQ como broker principal. No se descarta NATS o Redis Streams como alternativa.

## 5. Optimizacion para produccion

Pasos necesarios antes del despliegue a produccion:

- **HTTPS**: certificado SSL/TLS (Let's Encrypt o similar)
- **Secrets management**: HashiCorp Vault o GitHub Secrets en lugar de .env
- **Base de datos**: backup automatizado, failover, conexiones SSL
- **Health checks**: endpoints /health con verificacion de dependencias (BD, Redis, Eureka)
- **Logs centralizados**: forward a Loki, Elasticsearch o similar
- **Monitoring**: Prometheus metrics + Grafana dashboards

## 6. Distributed Tracing con OpenTelemetry

Implementar trazabilidad distribuida para diagnosticar latencia y errores entre servicios:

- **OpenTelemetry SDK** en Node.js para instrumentacion automatica de Express
- Exportador a Jaeger o Zipkin
- Propagacion de contexto via headers HTTP (traceparent, tracestate)
- Trazado de principio a fin: Gateway -> Servicio -> Base de datos -> Cache

## 7. Documentacion de 3 patrones de diseno

Como requisito academico, documentar 3 patrones de diseno implementados en el backend:

| Patron              | Donde se aplica                            |
| ------------------- | ------------------------------------------ |
| **Idempotency**     | ms-emergencias: POST /retry con correlation_id |
| **Cache-Aside**     | ms-analitica: Redis como cache de dashboard   |
| **Graceful Shutdown**| Todos los servicios: deregister -> close -> pool end |
| **Service Discovery**| Eureka Server + Client en todos los servicios |

Cada patron debe documentarse con: problema, solucion, implementacion concreta en FocoCero, diagrama de secuencia.

## Resumen de prioridades

| Tarea                     | Prioridad | Impacto             |
| ------------------------- | --------- | ------------------- |
| Pruebas unitarias         | Alta      | Calidad del codigo  |
| Swagger unificado         | Alta      | Developer Experience |
| Pipeline CI/CD completo   | Alta      | Velocidad de entrega|
| Produccion (HTTPS, SSL)   | Alta      | Seguridad           |
| RabbitMQ                  | Media     | Desacoplamiento     |
| Distributed tracing       | Media     | Observabilidad      |
| Documentacion patrones    | Baja      | Requisito academico |
