# Microservicios

## Visor General

8 servicios Node.js (7 funcionales + 1 template), cada uno siguiendo arquitectura hexagonal: controllers -> services -> repositories -> DB.

## Listado de Servicios

### ms-auth (:3001)
- **Responsabilidad**: Registro, login, recuperacion de contrasena, gestion de perfil.
- **Autenticacion**: Token interno. No expone rutas publicas (Gateway gestiona auth con Firebase).
- **DB**: `auth_db` - Tablas: `users` (uid, email, role, nombre, telefono), `refresh_tokens`.
- **Rutas**: `POST /auth/register`, `POST /auth/login`, `GET /auth/profile`, `PUT /auth/profile`, `POST /auth/refresh`.
- **Seguridad**: Hash de contrasena con bcrypt (salt rounds 12). Zod para validacion.

### ms-geo (:3002)
- **Responsabilidad**: Datos geoespaciales: zonas de riesgo, incendios activos, capas cartograficas.
- **Autenticacion**: Token interno + RBAC (BRIGADISTA, ADMIN para escritura).
- **DB**: `geo_db` - PostGIS. Tablas: `zonas_riesgo` (GEOMETRY), `incendios_activos` (GEOGRAPHY), `capas_map`.
- **Rutas**: `GET /geo/zonas-riesgo`, `GET /geo/incendios`, `POST /geo/incendios`, `GET /geo/cercanos?lat&lng&radio`.
- **Seguridad**: Parametros de consulta con validacion Zod (lat entre -90/90, lng -180/180).

### ms-alertas (:3003)
- **Responsabilidad**: Gestion de alertas de incendio, notificaciones a brigadistas.
- **Autenticacion**: Token interno + RBAC.
- **DB**: `alertas_db` - Tablas: `alertas` (nivel: BAJA/MEDIA/ALTA/CRITICA, ubicacion GEOGRAPHY, activa boolean).
- **Rutas**: `GET /alertas/activas`, `POST /alertas`, `PATCH /alertas/:id/resolver`, `GET /alertas/historial`.
- **Seguridad**: Solo ADMIN y BRIGADISTA pueden crear/resolver alertas.

### ms-reportes (:3004)
- **Responsabilidad**: Reportes ciudadanos de incidentes (foco de humo, incendio).
- **Autenticacion**: Token interno + RBAC (INVITADO/USUARIO crea, ADMIN gestiona).
- **DB**: `reportes_db` - Tablas: `reportes` (ubicacion GEOGRAPHY, descripcion, estado: PENDIENTE/VERIFICADO/RECHAZADO, fotos JSON).
- **Rutas**: `POST /reportes`, `GET /reportes/mis-reportes`, `GET /reportes/:id`, `PATCH /reportes/:id/estado`.
- **Seguridad**: Los reportes de otros ciudadanos no son visibles. Validacion Zod estricta.

### ms-multimedia (:3005)
- **Responsabilidad**: Subida y gestion de imagenes/videos asociados a reportes y alertas.
- **Autenticacion**: Token interno.
- **DB**: `multimedia_db` - Tablas: `archivos` (url, tipo, entity_type, entity_id, metadata JSON, created_at).
- **Rutas**: `POST /multimedia/upload`, `GET /multimedia/:entity-type/:entity-id`, `DELETE /multimedia/:id`.
- **Seguridad**: Tamano maximo de archivo (10MB), validacion de tipo MIME, escaneo basico de contenido.

### ms-emergencias (:3006)
- **Responsabilidad**: Coordinacion de emergencias activas, asignacion de brigadistas, recursos.
- **Autenticacion**: Token interno + RBAC (solo ADMIN).
- **DB**: `emergencias_db` - Tablas: `emergencias` (nivel, ubicacion GEOGRAPHY, estado ACTIVA/CONTENIDA/EXTINGUIDA), `recursos`, `asignaciones`.
- **Rutas**: `POST /emergencias`, `GET /emergencias/activas`, `POST /emergencias/:id/asignar`, `POST /emergencias/:id/estado`.

### ms-analitica (:3007)
- **Responsabilidad**: Dashboard, metricas, historicos, estadisticas de incendios.
- **Autenticacion**: Token interno.
- **DB**: `analitica_db` - Tablas: `metricas_diarias`, `historial_incendios`, `reportes_agregados`.
- **Cache**: Redis 7 Alpine para consultas frecuentes (TTL 5 min).
- **Rutas**: `GET /analitica/dashboard`, `GET /analitica/historial?rango`, `GET /analitica/estadisticas`.

### ms-template (arquetipo)
- **Responsabilidad**: Servir como template base para crear nuevos microservicios.
- **Incluye**: Estructura hexagonal preconfigurada, Eureka Client, health check, logging con traceId, Dockerfile multi-stage, Zod validator, middleware de token interno.

## Arquitectura Hexagonal Comun

```
src/
  controllers/     # Handlers HTTP, validacion Zod del input
    routes.js      # Definicion de rutas Express
    controller.js  # Logica de controlador
  services/        # Logica de negocio
  repositories/    # Acceso a DB con queries parametrizadas
  models/          # Modelos/DTOs
  middleware/      # authMiddleware (x-internal-token), traceId, errorHandler
  validators/      # Esquemas Zod
  config/          # Variables de entorno, logger
  index.js         # Entry point: Express app, Eureka registration
```

## Eureka Registration (Comun en todos los MS)

```javascript
eureka: {
  instance: {
    app: 'ms-nombre',
    hostName: 'ms-nombre',
    port: { '$': PORT, '@enabled': true },
    healthCheckUrl: `http://ms-nombre:${PORT}/health`,
    statusPageUrl: `http://ms-nombre:${PORT}/health`,
    homePageUrl: `http://ms-nombre:${PORT}/`,
  },
  eureka: { host: 'eureka-server', port: 8761 },
}
```

Heartbeat cada 30s. Deregistro graceful en shutdown (SIGTERM).
