# Mensajeria Asincrona (RabbitMQ)

## Estado Actual

RabbitMQ esta configurado en `docker-compose.yml` como servicio, pero NO esta operacional. Ningun microservicio publica ni consume mensajes en este momento.

## Stack

| Componente | Version | Estado |
|---|---|---|
| RabbitMQ | 3.13 management | Configurado, no operacional |
| amqplib | 0.10.x | Instalado en ms-template, sin uso |
| Puertos | 5672 (AMQP), 15672 (Management UI) | |

## Configuracion Actual en Docker Compose

```yaml
rabbitmq:
  image: rabbitmq:3.13-management-alpine
  container_name: fococero-rabbitmq
  ports:
    - "5672:5672"
    - "15672:15672"
  environment:
    RABBITMQ_DEFAULT_USER: fococero
    RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    RABBITMQ_DEFAULT_VHOST: /
  healthcheck:
    test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
    interval: 30s
    timeout: 10s
    retries: 5
  networks:
    - fococero-net
```

## Diseno Futuro de Eventos

### Eventos de Dominio

| Evento | Publicador | Consumidores | Routing Key |
|---|---|---|---|
| `alerta.creada` | ms-alertas | ms-multimedia, ms-analitica, push-notifications | `alerta.creada` |
| `reporte.nuevo` | ms-reportes | ms-analitica, ms-geo | `reporte.nuevo` |
| `emergencia.activada` | ms-emergencias | ms-alertas, ms-analitica, push-notifications | `emergencia.activada` |
| `emergencia.resuelta` | ms-emergencias | ms-analitica, ms-alertas | `emergencia.resuelta` |
| `usuario.registrado` | ms-auth | ms-analitica | `usuario.registrado` |

### Diseno de Exchanges y Queues

```javascript
// Declaracion futura
const exchange = 'fococero.events';
const exchangeType = 'topic';

// Queues
const queues = {
  alertas: { routingKeys: ['alerta.*', 'emergencia.*'] },
  analitica: { routingKeys: ['#'] },  // Consume todos los eventos
  multimedia: { routingKeys: ['alerta.*', 'reporte.nuevo'] },
  push: { routingKeys: ['alerta.creada', 'emergencia.*'] },
};
```

### Flujo Tipico

```
ms-alertas publica "alerta.creada"
    |
    v
RabbitMQ Exchange topic "fococero.events"
    |
    +---> Queue multimedia -> ms-multimedia: asocia imagenes pre-cargadas
    +---> Queue analitica  -> ms-analitica: invalida cache, actualiza metricas
    +---> Queue push       -> push-service: envia notificacion push
```

## Seguridad en Mensajeria

Cuando se active RabbitMQ:

- **Autenticacion**: Credenciales de usuario RabbitMQ inyectadas via variables de entorno (`RABBITMQ_DEFAULT_USER`, `RABBITMQ_DEFAULT_PASS`).
- **Cifrado**: Las conexiones AMQP usaran TLS en produccion (amqps).
- **Validacion**: Los consumidores validaran el schema del mensaje con Zod antes de procesarlo.
- **Idempotencia**: Cada mensaje incluira un `idempotencyKey` (UUIDv4) para evitar procesamiento duplicado.

## Vulnerabilidades

- **Colas sin consumidor**: Mensajes no consumidos pueden acumularse (queue overflow). Mitigacion: TTL de mensaje (48h) y DLQ (Dead Letter Queue).
- **Message spoofing**: Un servicio comprometido podria publicar eventos falsos. Mitigacion: firma HMAC del mensaje o validacion de origen via token interno.
- **Replay attack**: Un atacante podria reenviar mensajes capturados. Mitigacion: idempotency key + timestamp de expiracion.

## Integracion con el Ecosistema

- Los eventos de RabbitMQ reemplazaran las llamadas sincronas entre microservicios cuando aplique.
- La incorporacion no requiere cambios en el API Gateway ni en los contratos REST existentes.
- El ms-template incluye ya el codigo base para publicar/consumir eventos, listo para ser configurado.

## Monitoreo

RabbitMQ Management UI expone metricas en `:15672` (red interna):

- Tasa de publicacion/consumo por cola.
- Profundidad de cola (mensajes pendientes).
- Tasa de acknowledge/reject.

Estas metricas se integraran con el dashboard de monitoreo del sistema.
