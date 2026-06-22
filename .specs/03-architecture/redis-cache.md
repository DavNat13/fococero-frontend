# Cache con Redis

## Proposito

Proporcionar una capa de cache distribuida para reducir la carga en la base de datos y mejorar la velocidad de respuesta del microservicio `ms-analitica`, que maneja consultas agregadas de datos historicos.

## Stack

| Componente | Version |
|---|---|
| Redis | 7 Alpine (imagen `redis:7-alpine`) |
| Cliente Node.js | `ioredis` 5.x |
| Puerto | 6379 |

## Alcance Actual

Redis esta integrado exclusivamente con `ms-analitica` para cache de consultas de dashboard e historicos. No se utiliza para sesiones, rate-limiting (se maneja en Gateway) ni colas de mensajes.

## Estrategia de Cache

### Cache-Aside (Lazy Loading)

El microservicio consulta Redis primero. Si hay cache hit, devuelve el valor. Si es miss, consulta PostgreSQL, almacena en Redis y devuelve.

```javascript
async function getDashboardMetrics() {
  const cacheKey = 'analitica:dashboard';
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);  // cache hit
  }

  const metrics = await repository.getDashboardMetrics(); // PostgreSQL
  await redis.setex(cacheKey, 300, JSON.stringify(metrics)); // TTL 5 min
  return metrics;
}
```

### Claves de Cache

Formato: `analitica:<tipo>:<parametros>`.

| Clave | TTL | Descripcion |
|---|---|---|
| `analitica:dashboard` | 300s | Metricas del dashboard principal |
| `analitica:historial:YYYY-MM` | 600s | Datos historicos por mes |
| `analitica:estadisticas:tipo` | 300s | Estadisticas agregadas |
| `analitica:reportes:diarios` | 120s | Reportes del dia actual |

### Serializacion

Los datos se serializan con `JSON.stringify` / `JSON.parse`. No se utiliza MessagePack ni protobuf porque la complejidad adicional no se justifica para el volumen actual de datos.

## Politica de Invalidacion

Actualmente se usa TTL fijo (time-to-live) como mecanismo principal de invalidacion.

Cuando RabbitMQ este operativo, se implementara invalidacion por evento:

- Evento `reporte.nuevo` -> invalida `analitica:dashboard` y `analitica:reportes:diarios`.
- Evento `emergencia.activada` -> invalida `analitica:estadisticas:*`.

```javascript
// Futuro: invalidacion por evento
async function onReporteNuevo(event) {
  await redis.del('analitica:dashboard');
  await redis.del('analitica:reportes:diarios');
  // No invalidar historicos mensuales (cambian menos frecuentemente)
}
```

## Configuracion de Redis

```javascript
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 200, 3000); // Espera progresiva hasta 3s
  },
  lazyConnect: true,  // Conectar bajo demanda
});
```

## Seguridad

- Redis corre en red interna Docker sin autenticacion (`protected-mode no`) porque no hay acceso externo.
- No se almacenan datos sensibles (tokens, contrasenas, datos personales).
- Las claves de cache no contienen informacion de usuarios especificos.
- Timeout de conexion para evitar conexiones colgadas.

## Privacidad

Los datos cacheados son metricas agregadas, no incluyen datos personales ni ubicaciones exactas de ciudadanos. Esto asegura que incluso si Redis se compromete, no hay exposicion de datos de usuarios.

## Vulnerabilidades

- **Cache poisoning**: Un atacante que controle la respuesta de un microservicio podria envenenar el cache. Mitigacion: TTL corto y validacion de datos antes de cachear.
- **Key guessing**: Las claves siguen un patron predecible pero no contienen informacion sensible.
- **Denial of Service por cache miss**: Si Redis falla, el sistema degrada a consulta directa a PostgreSQL sin bloqueo.

## DevOps

- Redis se despliega como servicio en docker-compose con health check: `redis-cli ping`.
- Memoria maxima configurada: `maxmemory 256mb` con politica `allkeys-lru`.
- Persistencia RDB (snapshot cada 5 min) para recuperacion ante caida.
- No hay replicacion ni clustering (entorno monoinstancia). Para produccion se evaluara Redis Sentinel.
