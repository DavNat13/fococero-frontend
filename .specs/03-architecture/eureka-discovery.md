# Service Discovery con Eureka

## Proposito

Centralizar el registro y descubrimiento de servicios para que el API Gateway y los microservicios puedan localizarse entre si sin configuracion manual de IPs.

## Stack

- **Eureka Server**: Steeltoe Eureka Server (contenedor Docker `steeltoeoss/eureka-server`).
- **Eureka Client**: `eureka-js-client` (npm) en cada microservicio Node.js.
- **Puerto**: `:8761` (mapeado en docker-compose).

## Arquitectura

```
Eureka Server (:8761)
    |
    +-- api-gateway (se registra como instancia)
    |     - App: API-GATEWAY
    |     - VIP: api-gateway
    |
    +-- ms-auth (:3001) -- App: MS-AUTH
    +-- ms-geo (:3002)  -- App: MS-GEO
    +-- ms-alertas (:3003)
    +-- ms-reportes (:3004)
    +-- ms-multimedia (:3005)
    +-- ms-emergencias (:3006)
    +-- ms-analitica (:3007)
```

## Configuracion del Cliente (Estandar para todos los MS)

```javascript
const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
  instance: {
    app: process.env.EUREKA_APP_NAME,       // ej: 'MS-AUTH'
    hostName: process.env.HOSTNAME || 'localhost',
    instanceId: `${process.env.HOSTNAME}:${process.env.PORT}`,
    vipAddress: process.env.EUREKA_APP_NAME,
    port: {
      '$': parseInt(process.env.PORT),
      '@enabled': true,
    },
    statusPageUrl: `http://${process.env.HOSTNAME}:${process.env.PORT}/health`,
    healthCheckUrl: `http://${process.env.HOSTNAME}:${process.env.PORT}/health`,
    homePageUrl: `http://${process.env.HOSTNAME}:${process.env.PORT}/`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    metadata: {
      swagger: `http://${process.env.HOSTNAME}:${process.env.PORT}/api-docs`,
      firewall: 'internal',
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'eureka-server',
    port: 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 5,
    requestRetryDelay: 2000,
    heartbeatInterval: 30000,   // 30 segundos
    registryFetchInterval: 30000,
  },
});
```

## Heartbeat (30 segundos)

Cada microservicio envia un heartbeat a Eureka cada 30 segundos. Si Eureka no recibe 3 heartbeats consecutivos (90s), la instancia se marca como `DOWN` y se elimina del balanceo.

```javascript
client.start(error => {
  if (error) {
    logger.error('Eureka registration failed', { error, service: process.env.EUREKA_APP_NAME });
  } else {
    logger.info('Registered with Eureka', { service: process.env.EUREKA_APP_NAME });
  }
});
```

## Graceful Shutdown

Al recibir `SIGTERM`, cada microservicio ejecuta en orden:

1. **Deregister de Eureka**: `client.stop()` -> notifica al server que la instancia se da de baja.
2. **Cierre del servidor HTTP**: `server.close()` -> deja de aceptar nuevas conexiones.
3. **Cierre del pool de DB**: `pool.end()` -> libera conexiones a PostgreSQL.
4. **Cierre de Redis** (si aplica): `redisClient.quit()`.
5. **Exit**: `process.exit(0)`.

```javascript
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  await client.stop();                    // 1. Deregister from Eureka
  await new Promise(resolve => server.close(resolve)); // 2. Close HTTP
  await pool.end();                       // 3. Close DB pool
  if (redisClient) await redisClient.quit(); // 4. Close Redis
  process.exit(0);                        // 5. Exit
});
```

## Deteccion Hibrida Docker / Local

El sistema detecta automaticamente si corre en Docker o en entorno local:

- **Docker**: `process.env.HOSTNAME` se asigna al nombre del contenedor (`ms-auth`). Eureka resuelve por nombre de contenedor en la red `fococero-net`.
- **Local (desarrollo)**: `HOSTNAME` se configura como `localhost`. Eureka se accede via `localhost:8761`.

```javascript
const isDocker = process.env.DOCKER_ENV === 'true';
const hostName = isDocker ? process.env.HOSTNAME : 'localhost';
```

## Seguridad

- Eureka Server corre en red interna Docker, sin puerto expuesto al host en produccion.
- No se utiliza autenticacion en Eureka (red aislada). En entornos compartidos, se anade autenticacion basica via configuracion de Steeltoe.
- Los metadatos de instancia (`metadata.firewall: internal`) permiten que solo el Gateway filtre servicios internos.

## Vulnerabilidades

- **Eureka spoofing**: Un contenedor malicioso en la misma red Docker podria registrarse como servicio legítimo. Mitigacion: red Docker aislada, sin acceso externo.
- **Denial of Service**: Heartbeat flooding. Mitigacion: Eureka Server configurado con rate-limit de registro (no nativo, requiere proxy reverso).
- **Intercepcion de metadatos**: Los metadatos de servicio no incluyen informacion sensible.

## DevOps

- Health check en todos los servicios: `curl -f http://localhost:${PORT}/health || exit 1`.
- Eureka Server health check: `curl -f http://eureka-server:8761/actuator/health`.
- Los logs de registro/deregistro se recolectan via `traceId` para auditoria.
