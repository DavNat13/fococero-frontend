# Emergencias — ms-emergencias (puerto 3006)

## Descripcion General

Sistema de coordinacion de emergencias. Gestiona la creacion de despachos a agencias externas (CONAF, Bomberos) con garantia de idempotencia, reintentos automaticos ante fallos y tracking en tiempo real del estado de la emergencia.

## Endpoints

| Metodo | Endpoint | Rol | Descripcion |
|---|---|---|---|
| POST | /api/emergencias/despachos | BRIGADISTA, ADMIN | Crear despacho |
| GET | /api/emergencias/despachos | BRIGADISTA, ADMIN | Listar despachos |
| GET | /api/emergencias/despachos/:id | BRIGADISTA, ADMIN | Obtener despacho por ID |
| GET | /api/emergencias/despachos/correlacion/:correlation_id | BRIGADISTA, ADMIN | Tracking por correlation_id |
| POST | /api/emergencias/despachos/retry | ADMIN | Reintentar despachos fallidos |
| GET | /api/emergencias/agencias | TODOS | Listar agencias disponibles |

## Creacion de Despacho con Idempotencia

```
POST /api/emergencias/despachos
  Payload: {
    correlation_id: "uuid-v4-unico",     // Generado por el cliente
    tipo_emergencia: "incendio_forestal" | "incendio_estructural" | "rescate",
    alerta_id: 123,
    geo_id: 456,
    prioridad: "alta" | "media" | "baja",
    agencias: ["conaf", "bomberos"],
    descripcion: "Incendio en sector oriente, viento favorable",
    ubicacion: { lat: -33.456, lng: -70.678 }
  }

  Respuesta exitosa (201):
  → Si correlation_id ya existe → retorna 409 Conflict (idempotencia)
  → Registra despacho con estado "pendiente"
  → Encola notificacion a cada agencia via webhook/configuracion
  → Retorna despacho creado con ID interno
```

### Idempotencia

- `correlation_id` es UNIQUE en base de datos
- Si se recibe un POST con mismo `correlation_id` ya procesado → HTTP 409
- Si se recibe un POST con mismo `correlation_id` en proceso → HTTP 425 (Too Early)
- Permite que el frontend reintente sin duplicar despachos en caso de timeout

## Estados del Despacho

| Estado | Descripcion |
|---|---|
| pendiente | Despacho creado, esperando confirmacion de agencia |
| enviado | Notificacion enviada a agencia(s) |
| confirmado | Agencia confirmo recepcion |
| en_curso | Recursos movilizados, emergencia activa |
| completado | Emergencia resuelta |
| fallido | Error en envio a agencia |
| cancelado | Despacho cancelado por ADMIN |

## Mecanismo de Retry

```
POST /api/emergencias/despachos/retry
  Payload: { despacho_id: 456 }
  → Solo ADMIN
  → Verifica que despacho esta en estado "fallido"
  → Incrementa intento: `intentos + 1`
  → Si `intentos > 3` → bloquea despacho, requiere intervencion manual
  → Re-envia notificacion a agencia(s)
  → Log de reintento: `{ despacho_id, intento, timestamp, resultado }`
```

## Integracion con Agencias Externas

- Cada agencia tiene configuracion: `{ nombre, webhook_url, api_key_encriptada, timeout_ms, formatos_permitidos }`
- `GET /api/emergencias/agencias` retorna lista activa
- Notificacion via POST al webhook de la agencia con payload estandarizado
- Firmado con HMAC-SHA256 usando api_key compartida
- Timeout por agencia: 10s; fallo = estado `fallido`

## Tracking en Tiempo Real

- Cliente puede hacer polling a `/despachos/correlacion/:correlation_id`
- Respuesta incluye: `{ estado, agencias_confirmadas, actualizado_en, intentos }`
- Webhook opcional via WebSocket (Socket.io) para updates en vivo

## Seguridad y Privacidad

- Solo BRIGADISTA y ADMIN pueden crear/ver despachos
- Ciudadanos no tienen acceso a este microservicio
- API keys de agencias almacenadas en Secrets Manager (AWS) con cifrado AES-256
- Logs de despachos no incluyen datos personales del operador
- Comunicacion con agencias via HTTPS mutual TLS (mTLS)

## DevOps

- Health check: `GET /api/emergencias/health`
- RabbitMQ/BullMQ para cola de notificaciones a agencias
- Dead letter queue para despachos fallidos despues de 3 intentos
- Metricas Prometheus: despachos/segundo, tasa de fallo, latencia por agencia

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Despacho duplicado por timeout | Idempotencia con correlation_id UNIQUE |
| Fuga de datos de agencias | Secrets Manager + env vars, nunca en codigo |
| Ataque a webhook de agencia | HMAC firmado + whitelist de IPs |
| Denegacion de servicio en agencias | Circuit breaker: 5 fallos consecutivos = pausa 5 min |
| Retry infinito | Max 3 intentos; despues bloqueo manual por ADMIN |
