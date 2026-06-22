# Fase 2: Microservicios Core

> Cinco microservicios fundamentales implementados: autenticacion, geolocalizacion, alertas, reportes y multimedia.

---

## ms-auth

**Proposito**: autenticacion y autorizacion de usuarios mediante Firebase Admin SDK + JWT + RBAC.

**Base de datos**: `db_auth` - tabla `usuarios` con campos uid, email, rol, activo, creado, actualizado.

**Funcionalidades**:
- Verificacion de tokens JWT emitidos por Firebase Authentication
- CRUD completo de usuarios (crear, listar, obtener, actualizar, desactivar)
- RBAC con roles: `admin`, `brigadista`, `analista`, `ciudadano`
- Middleware de autorizacion por rol para proteger rutas en otros servicios

**Seguridad**:
- Firebase Admin SDK inicializado con credenciales de servicio (cuenta de servicio JSON)
- JWT verificado criptograficamente en cada request
- Contrasenas gestionadas por Firebase, nunca almacenadas localmente
- Endpoints protegidos: solo admin puede crear/desactivar usuarios

**Endpoints**:
```
POST   /auth/verify       Verificar token JWT
GET    /auth/usuarios     Listar usuarios (admin)
POST   /auth/usuarios     Crear usuario (admin)
GET    /auth/usuarios/:id Obtener usuario
PUT    /auth/usuarios/:id Actualizar usuario
DELETE /auth/usuarios/:id Desactivar usuario (soft delete)
```

## ms-geo

**Proposito**: consultas espaciales sobre datos geograficos de incendios, zonas y puntos de interes.

**Base de datos**: `db_geo` con extension PostGIS. Tablas con columna `geom geometry(Point, 4326)` e indices GIST.

**Funcionalidades**:
- Creacion y consulta de geometrias (puntos, poligonos, lineas)
- Busqueda por proximidad: `ST_DWithin(point, geom, radio)`
- Interseccion de poligonos: `ST_Intersects`
- Pertenencia de punto a poligono: `ST_Contains`
- Obtencion de areas de incendio en hectareas
- Zonas de riesgo predefinidas con colores y niveles

**Optimizacion**: indices GIST sobre columnas geometry, queries parametrizadas para prevenir SQL injection.

## ms-alertas

**Proposito**: gestion de alertas de incendio con historial de cambios y eliminacion logica.

**Base de datos**: `db_alertas` - tablas `alertas` y `historial_alertas`.

**Funcionalidades**:
- CRUD completo de alertas con soft delete (columna `activo = false`)
- Historial automatico: cada cambio registra usuario, fecha, campo modificado, valor anterior
- Cambio de estado: creada, verificada, en_curso, controlada, extinguida
- Listado con filtros por estado, fecha, gravedad

**Historial**: implementado via trigger SQL o logica en repositorio. Cada accion INSERT/UPDATE en alertas genera un registro en historial_alertas.

## ms-reportes

**Proposito**: reportes de incendio con categorizacion y seguimiento de estados.

**Base de datos**: `db_reportes` - tablas `reportes`, `categorias_reporte`, `historial_estados`.

**Funcionalidades**:
- CRUD de reportes con titulo, descripcion, ubicacion, categoria
- Categorias predefinidas: incendio_activo, columna_humo, quema_controlada, falso_alarma
- Estados: pendiente, en_revision, confirmado, descartado
- Historial de cambios de estado con timestamp y usuario
- Asociacion entre reporte y alerta (un reporte confirmado puede generar una alerta)

## ms-multimedia

**Proposito**: gestion de archivos multimedia (imagenes, videos, documentos) asociados a incendios o alertas.

**Base de datos**: `db_multimedia` - tabla `archivos` con metadatos (nombre, tipo, tamano, ruta, entidad_asociada).

**Funcionalidades**:
- Subida de archivos con validacion de tipo y tamano maximo
- Descarga por ID
- Eliminacion fisica y logica
- Listado por entidad asociada (alerta, reporte, emergencia)
- Almacenamiento en sistema de archivos con estructura por entidad

**Seguridad**:
- Validacion de tipo MIME en upload
- Tamano maximo configurable via entorno
- Path traversal prevention: sanitizacion de nombres de archivo
- Acceso solo a usuarios autenticados

## Vulnerabilidades mitigadas

| Vulnerabilidad        | Mitigacion                              |
| --------------------- | --------------------------------------- |
| Token falsificacion   | Firebase Admin SDK verifyIdToken()      |
| Acceso no autorizado  | Middleware RBAC en rutas protegidas     |
| SQL injection         | Queries parametrizadas (pg)             |
| Path traversal        | Sanitizacion de filename + path join    |
| Upload malicioso      | Validacion MIME + limite de tamano      |
| Perdida de datos      | Soft delete en alertas y multimedia     |
