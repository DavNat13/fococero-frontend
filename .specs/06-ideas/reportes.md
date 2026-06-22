# Reportes — ms-reportes (puerto 3004)

## Descripcion General

Sistema de reportes ciudadanos y de brigadistas sobre incidentes de incendios forestales. Permite categorizar, dar seguimiento con historial de estados, adjuntar evidencia multimedia y mantener trazabilidad completa.

## Sistema de Categorias

- `GET /api/reportes/categorias` — listar categorias disponibles (publico)
- Categorias predefinidas: `incendio_activo`, `columna_humo`, `quema_ilegal`, `foco_controlado`, `falsa_alarma`, `otro`
- Cada categoria tiene: `id, nombre, descripcion, icono, requiere_evidencia (boolean), nivel_severidad_default`
- Gestion de categorias via seed de base de datos (no CRUD en API)

## Endpoints CRUD

| Metodo | Endpoint | Rol | Descripcion |
|---|---|---|---|
| POST | /api/reportes | TODOS | Crear reporte |
| GET | /api/reportes | TODOS | Listar reportes (filtros: status, categoria, fecha) |
| GET | /api/reportes/mis-reportes | TODOS | Reportes del usuario autenticado |
| GET | /api/reportes/:id | TODOS | Obtener reporte por ID |
| PUT | /api/reportes/:id | CREADOR/ADMIN | Actualizar reporte |
| DELETE | /api/reportes/:id | CREADOR/ADMIN | Soft delete |
| PATCH | /api/reportes/:id/estado | BRIGADISTA, ADMIN | Cambiar estado |
| GET | /api/reportes/:id/historial | TODOS | Historial de cambios de estado |

## Flujo de Creacion de Reporte

```
POST /api/reportes
  → Valida JWT y extrae uid + role del header X-User-*
  → Valida payload: categoria_id, descripcion, latitud, longitud, multimedia_ids?
  → Crea reporte con estado "pendiente"
  → Si requiere_evidencia=true y no hay multimedia_ids → rechaza con 422
  → Asigna ubicacion geografica (geometry Point)
  → Si nivel >= ALTO → crea alerta automatica en ms-alertas via evento
  → Retorna 201 con reporte creado
```

## Maquina de Estados

```
[pendiente] → [en_revision] → [verificado] → [resuelto]
                  ↓
            [rechazado]
```

- **pendiente**: Reporte creado, esperando revision
- **en_revision**: Brigadista asignado, investigando
- **verificado**: Confirmado como incidente real
- **resuelto**: Incidente gestionado, cerrado
- **rechazado**: Reporte invalido, duplicado o falsa alarma

### Reglas de Transicion

| Estado Actual | Estado Siguiente | Quien puede | Requisito |
|---|---|---|---|
| pendiente | en_revision | BRIGADISTA, ADMIN | - |
| en_revision | verificado | BRIGADISTA, ADMIN | Multimedia de evidencia |
| en_revision | rechazado | BRIGADISTA, ADMIN | Motivo obligatorio |
| verificado | resuelto | ADMIN | Solo ADMIN |
| verificado | en_revision | ADMIN | Reapertura con motivo |

## Historial de Estados

- `GET /api/reportes/:id/historial` retorna array inmutable de transiciones
- Cada entrada: `{ estado_anterior, estado_nuevo, usuario_id, timestamp, motivo, evidencia_ids }`
- Los cambios son inmutables; no se permite editar historial

## Multimedia Asociada

- Relacion N:M entre reportes y archivos multimedia
- Campos: `reporte_id, multimedia_id, tipo_evidencia (foto/video)`
- El upload se hace primero en ms-multimedia, luego se asocia al reporte

## Seguridad y Privacidad

- Ciudadano solo puede actualizar/eliminar sus propios reportes
- BRIGADISTA y ADMIN pueden actualizar/eliminar cualquier reporte
- Coordenadas exactas visibles para todos (reportes ciudadanos son publicos por diseno)
- Datos personales del creador (nombre, email) visibles solo para BRIGADISTA/ADMIN

## DevOps

- Eventos asincronos via RabbitMQ/BullMQ: creacion de reporte → posible alerta
- Cache Redis 7 para categorias (TTL 1 hora, invalidacion manual)
- Indices GIST en columna de geometria para queries espaciales

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Reportes duplicados | Validacion de coordenadas + tiempo: mismo punto en < 5 min es duplicado |
| Spam de reportes | Rate limit 5 reportes/hora por usuario CIUDADANO |
| Categorias manipuladas | Validacion contra lista fija en backend |
| Multimedia huérfana | Garbage collection semanal de multimedia no referenciada |
| Escalada de estado | Validacion estricta de reglas de transicion por rol |
