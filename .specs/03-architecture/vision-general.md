# Vision General del Sistema

## Topologia

```
+-------------------------------------------------------------------+
|                        FRONTEND (Expo / React Native)              |
|  Feature-Sliced Design: app/ widgets/ features/ entities/ shared/  |
|  Zustand + TanStack Query + Axios (Result Pattern) + Firebase SDK |
+----------------------------------+--------------------------------+
                                   |
                              HTTPS :443
                                   |
+----------------------------------+--------------------------------+
|                      API GATEWAY (BFF) :3000                       |
|  Express 4 | http-proxy-middleware 3 | Helmet | CORS | rate-limit |
|  Firebase Admin verifyIdToken() -> inject x-internal-token (JWT)   |
+--+---------+---------+---------+---------+---------+---------+----+
   |         |         |         |         |         |         |
:3001      :3002     :3003     :3004     :3005     :3006     :3007
ms-auth   ms-geo   ms-alertas ms-rep.  ms-multi  ms-emerg  ms-analit.
   |         |         |         |         |         |         |
   +---------+---------+---------+---------+---------+---------+
                             |
                    +--------+--------+
                    |  Eureka Server  |
                    |    (Steeltoe)   |
                    |     :8761       |
                    +-----------------+
                    |  Redis 7 Alpine |
                    |  Cache (analit.)|
                    |     :6379       |
                    +-----------------+
                    |  RabbitMQ       |
                    |  (config. only) |
                    |  :5672 / :15672 |
                    +-----------------+
```

## Patrones de Comunicacion

### REST (Sincrono)

Toda la comunicacion actual entre frontend y backend es REST sobre HTTPS.

- Frontend -> API Gateway: REST con JWT en header `Authorization: Bearer <token>`.
- API Gateway -> Microservicios: REST con `x-internal-token` JWT.
- Microservicios -> Microservicios: REST directo (solo si es necesario, preferir orquestacion desde Gateway).

El Gateway actua como BFF (Backend For Frontend): cada ruta del frontend tiene una ruta espejo en el Gateway que enruta al microservicio correspondiente.

### Proxy (API Gateway)

El Gateway utiliza `http-proxy-middleware` 3 para enrutar peticiones:

```
/api/auth/*       -> ms-auth    :3001
/api/geo/*        -> ms-geo     :3002
/api/alertas/*    -> ms-alertas :3003
/api/reportes/*   -> ms-reportes:3004
/api/multimedia/* -> ms-multimedia:3005
/api/emergencias/*-> ms-emergencias:3006
/api/analitica/*  -> ms-analitica:3007
```

No se utiliza versionado de API (`/v1/`) en las rutas. El versionado se maneja mediante la compatibilidad contractual de los DTOs.

### Potencial Asincrono (RabbitMQ)

RabbitMQ esta configurado en docker-compose pero aun no operacional. El diseno futuro contempla:

- Evento `alerta.creada` -> notificar brigadistas via push.
- Evento `emergencia.activada` -> escalar a autoridades.
- Evento `reporte.nuevo` -> invalidar cache en ms-analitica.

La incorporacion de RabbitMQ no requiere cambios en la API Gateway ni en los contratos REST existentes.

## Descubrimiento de Servicios (Eureka)

Todos los microservicios se registran en Eureka Server con heartbeat cada 30 segundos. El Gateway consulta Eureka para resolver las URLs de los servicios destino, eliminando la necesidad de IPs fijas en configuracion.

## Seguridad en la Comunicacion

- **Externa (Frontend -> Gateway)**: HTTPS. Autenticacion via JWT de Firebase.
- **Interna (Gateway -> MS)**: HTTP dentro de la red Docker. Token JWT interno `x-internal-token` firmado con HMAC-SHA256.
- **Base de Datos**: Conexiones locales dentro del contenedor. Sin exposicion de puertos DB al exterior.

## Clean Architecture en Comunicaciones

La comunicacion entre capas en cada microservicio sigue el flujo:

```
Controller (DTO entrada) -> Service (logica de negocio / validacion Zod)
    -> Repository (queries parametrizadas / modelos DB)
    -> Controller (DTO salida con Result Pattern)
```

Este flujo asegura que el JWT se valide en la capa de Controller antes de llegar a Service, y que el acceso a datos este siempre parametrizado.
