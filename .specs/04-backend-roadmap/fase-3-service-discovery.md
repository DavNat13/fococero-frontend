# Fase 3: Service Discovery

> Registro y descubrimiento de microservicios mediante Eureka Server (Steeltoe) con clientes personalizados en Node.js.

---

## Arquitectura

FocoCero implementa un patron de **service discovery** centralizado donde cada microservicio se registra en un servidor Eureka al iniciar y se deregitra al detenerse. Esto permite que el API Gateway y otros servicios localicen instancias sin configuracion estatica de IP/puerto.

```
                 +----------------+
                 | Eureka Server  |
                 | (Steeltoe)     |
                 +-------+--------+
                         |
        +----------------+----------------+
        |                |                |
   ms-auth          ms-geo          ms-alertas ...
   (cliente)       (cliente)        (cliente)
```

## Eureka Server

El servidor Eureka corre como contenedor Docker usando la imagen oficial de Steeltoe:

```yaml
eureka-server:
  image: steeltoeoss/eureka-server:latest
  ports:
    - "8761:8761"
  environment:
    EUREKA_SERVER_ENABLE_SELF_PRESERVATION: "false"
```

Expone un dashboard HTTP en `http://localhost:8761` para monitorear servicios registrados.

## Eureka Client

Cada microservicio incluye un cliente Eureka implementado con `eureka-js-client` (NPM). Se configura via variables de entorno:

```
EUREKA_HOST=eureka-server
EUREKA_PORT=8761
SERVICE_PORT=4001
SERVICE_NAME=ms-auth
```

**Registro**: el cliente envia un heartbeat cada 30 segundos. Si el servidor no recibe 3 heartbeats consecutivos, el servicio se marca como DOWN.

**Configuracion tipica**:

```typescript
const client = new EurekaClient({
  instance: {
    app: serviceName,
    hostName: os.hostname(),
    ipAddr: os.hostname(),
    port: { $: servicePort, '@enabled': true },
    vipAddress: serviceName,
    dataCenterInfo: { '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo', name: 'MyOwn' },
  },
  eureka: { host: eurekaHost, port: eurekaPort, servicePath: '/eureka/apps/' },
});
```

## Graceful Shutdown

Cada servicio implementa un patron de apagado graceful en tres pasos secuenciales:

1. **Deregistrar** instancia en Eureka (evita recibir nuevas peticiones)
2. **Cerrar HTTP server** con `server.close()` (espera conexiones activas hasta timeout)
3. **Cerrar pool de base de datos** con `pool.end()` (libera conexiones PostgreSQL)

Implementacion en `process.on('SIGTERM')` y `process.on('SIGINT')`.

```typescript
async function gracefulShutdown(signal: string) {
  logger.info(`Recibida senial ${signal}. Iniciando apagado graceful...`);
  await eurekaClient.deregister();
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  await dbPool.end();
  process.exit(0);
}
```

## Deteccion hibrida Docker/Local

Para desarrollo local sin Docker, cada microservicio detecta automaticamente el entorno:

- **Variable `DB_HOST_LOCAL`**: si existe, se usa en lugar de `DB_HOST`. Esto permite que el servicio se conecte a PostgreSQL local mientras corre en la maquina host.
- **Deteccion de entorno**: `process.env.DOCKER === 'true'` determina si se usa el hostname del contenedor o localhost.

Eureka se configura con `EUREKA_HOST=localhost` en desarrollo local. En Docker, apunta al nombre del servicio (`eureka-server`).

## Beneficios

- **Escalabilidad**: agregar instancias es transparente
- **Resiliencia**: si una instancia falla, Eureka la marca DOWN y el gateway deja de enrutar
- **Configuracion dinamica**: no se requieren cambios en el gateway al agregar nuevos servicios
- **Health checks**: Eureka monitorea el estado de cada instancia

## Vulnerabilidades mitigadas

| Vulnerabilidad                | Mitigacion                                |
| ----------------------------- | ----------------------------------------- |
| Conexiones colgantes          | Graceful shutdown con timeout             |
| Rutas a instancias muertas    | Deregistro en SIGTERM + heartbeat 30s     |
| Dependencia de IPs fijas      | Resolucion por nombre de servicio         |
| Perdida de peticiones         | Conexiones activas esperan cierre HTTP    |
