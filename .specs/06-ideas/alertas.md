# Alertas — ms-alertas (puerto 3003)

## Descripcion General

Sistema de alertas tempranas de incendios forestales. Gestiona el ciclo de vida completo desde la deteccion hasta la resolucion, con geolocalizacion PostGIS, niveles de severidad, flujo de verificacion y notificaciones push.

## Niveles de Alerta (Severidad)

| Nivel | Color | Codigo | Tiempo Respuesta Esperado | Descripcion |
|---|---|---|---|---|
| CRITICO | Rojo | CRITICAL | < 15 min | Incendio activo con riesgo a comunidades |
| ALTO | Naranja | HIGH | < 30 min | Foco en crecimiento, viento favorable |
| MEDIO | Amarillo | MEDIUM | < 60 min | Foco controlable, sin riesgo inmediato |
| BAJO | Verde | LOW | < 120 min | Quema controlada o foco extinguido |

## Endpoints CRUD

| Metodo | Endpoint | Rol | Descripcion |
|---|---|---|---|
| POST | /api/alertas | BRIGADISTA, ADMIN | Crear alerta |
| GET | /api/alertas | TODOS | Listar alertas (query params: status, level, page, limit) |
| GET | /api/alertas/mis-alertas | BRIGADISTA, ADMIN | Alertas asignadas al usuario |
| GET | /api/alertas/cercanas | TODOS | Alertas geograficamente cercanas (lat, lng, radius) |
| GET | /api/alertas/:id | TODOS | Obtener alerta por ID |
| PATCH | /api/alertas/:id/estado | BRIGADISTA, ADMIN | Cambiar estado |
| POST | /api/alertas/:id/verificar | BRIGADISTA, ADMIN | Verificar alerta |
| DELETE | /api/alertas/:id | ADMIN | Soft delete |

## Flujo de Verificacion

```
POST /api/alertas/:id/verificar
  → Valida que alerta existe y no esta verificada
  → Valida que usuario tiene rol BRIGADISTA o ADMIN
  → Registra quien verifico + timestamp
  → Cambia estado a "verificada"
  → Si nivel CRITICO/ALTO → dispara notificacion push broadcast
  → Retorna alerta actualizada
```

## Maquina de Estados

```
[pendiente] → [verificada] → [en_curso] → [controlada] → [extinguida]
     ↓                            ↓
 [rechazada]                [escalada]
```

- **pendiente**: Alerta creada, esperando verificacion
- **verificada**: Brigadista confirmo la alerta como real
- **en_curso**: Recursos asignados, combate activo
- **controlada**: Incendio contenido, sin propagacion
- **extinguida**: Incendio completamente apagado
- **rechazada**: Alerta falsa o duplicada (solo ADMIN)
- **escalada**: Requiere recursos adicionales (CONAF, Bomberos)

## Geolocalizacion

- Coordenadas almacenadas como `geometry(Point, 4326)` en PostGIS
- Endpoint `/cercanas` usa `ST_Distance(geography, geography)` con indice GIST
- Query params: `lat`, `lng`, `radius` (en km, default 10)
- Retorna alertas ordenadas por distancia ascendente

## Historial de Cambios

- Tabla `alerta_historial` con cambios inmutables
- Cada transicion de estado registra: `alerta_id, estado_anterior, estado_nuevo, usuario_id, timestamp, motivo`
- `GET /api/alertas/:id/historial` expone linea de tiempo completa

## Seguridad y Privacidad

- Ciudadanos solo ven alertas con estado `verificada` o superior
- Coordenadas exactas visibles solo para BRIGADISTA y ADMIN
- Ciudadanos ven area aproximada (nivel comuna/region) hasta verificacion

## DevOps

- Notificaciones push via Firebase Cloud Messaging (FCM) en cola BullMQ
- Alertas CRITICO/ALTO tienen prioridad alta en cola de notificaciones
- Cache Redis 7 para listas de alertas con TTL 30s

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Falsas alertas por spam | Rate limit 3 alertas/hora por usuario no ADMIN |
| Geolocalizacion inexacta | Validacion de coordenadas con bounding box Chile |
| Notificaciones masivas | Filtro por roles y preferencias FCM topic |
| Escalada no autorizada | Solo ADMIN puede escalar a nivel CRITICO |
| Soft delete evadido | Todos los endpoints filtran `deleted_at IS NULL` |
