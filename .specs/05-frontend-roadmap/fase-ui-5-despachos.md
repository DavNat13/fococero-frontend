# Fase UI-5: Despachos (PENDIENTE)

## Resumen

Sistema de despacho de recursos para emergencias activas. Gestiona la creacion, seguimiento en tiempo real, notificaciones de cambio de estado e integracion con agencias externas (CONAF, Bomberos).

## Dependencias

| Requisito | Origen |
|-----------|--------|
| API Emergencias | /api/emergencias (despachos CRUD + tracking) |
| useEmergenciaFeature | Facade hook (src/features/emergencias) |
| React Query | features/emergencias/api |
| Zustand store | entities/emergencias |
| Expo Notifications | push para cambios de estado |
| react-native-maps | polilineas de ruta de despacho |

## Create Dispatch Form

- Formulario con seleccion de:
  - **Tipo de recurso**: Brigada terrestre, Brigada helitransportada, Camion cisterna, Avion cisterna, Maquinaria pesada
  - **Cantidad de unidades**: numero con stepper
  - **Alerta destino**: selector de alerta activa cercana (filtrada por distancia)
  - **Punto de encuentro**: selector en mapa o coordenadas manuales
  - **Prioridad**: urgente, alta, normal, programada
- Validacion zod: cantidad minima 1, alerta destino requerida
- Confirmacion con resumen antes de enviar
- Respuesta con ID de despacho y estimacion de tiempo de arribo

## Real-Time Dispatch Tracking

- Tarjeta de despacho activo con:
  - Estado actual (pendiente, en ruta, en escena, completado, cancelado)
  - Unidades asignadas con iconos animados
  - Ubicacion en tiempo real de cada unidad (punto movil en mapa)
  - ETA actualizado cada 30 segundos (WebSocket polling)
- Polilinea de ruta desde origen hasta destino
- Timeline de eventos del despacho (StatusTimeline molecule)

## Active Dispatch List

- FlatList agrupada por estado:
  - **Activos**: en ruta + en escena (prioridad visual)
  - **Pendientes**: agendados o en espera de asignacion
  - **Completados**: ultimas 24 horas
- Filtros: tipo de recurso, prioridad, fecha, zona
- Cada item: tipo + cantidad + alerta destino + ETA + estado (Badge)
- Pull-to-refresh con skeleton loading
- Notificacion visual de nuevos despachos via badge en tab

## State Change Notifications

| Transicion | Notificacion | Destinatario |
|------------|--------------|--------------|
| Creado -> Asignado | Recurso asignado a alerta X | Brigadistas asignados |
| Asignado -> En ruta | Unidad en camino | Admin + alerta responsable |
| En ruta -> En escena | Unidad llego a destino | Admin + todos los brigadistas |
| En escena -> Completado | Despacho finalizado | Admin + alerta responsable |
| Cualquier estado -> Cancelado | Despacho cancelado | Todos los involucrados |

Notificaciones via Expo Push Notifications + Firebase Cloud Messaging.

## External Agency Integration (CONAF, Bomberos)

- Formulario de despacho externo con campos especificos:
  - Agencia destino (CONAF / Bomberos / ONEMI / Otra)
  - Contacto y telefono del oficial a cargo
  - Tipo de solicitud: apoyo aereo, apoyo terrestre, insumos, evacuacion
- API endpoint dedicado en microservicio Emergencias
- Estado del despacho externo con polling separado
- Log de comunicacion con timestamps y resultados
- Fallback: generacion de PDF resumen para envio por correo o fax

## Seguridad

- Solo Admin y Brigadista jefe pueden crear despachos
- Firmas digitales en despachos externos (hash con timestamp)
- Auditoria completa de cada cambio de estado
- Notificaciones con payload minimo (sin datos sensibles en push)

## Vulnerabilidades

| Riesgo | Mitigacion |
|--------|------------|
| Despacho duplicado | Idempotencia con request ID unico |
| Coordenadas de unidad expuestas | Role-based filtering + cifrado en transito |
| Notificaciones push interceptadas | Payload sin datos de ubicacion exacta |
| Cancelacion no autorizada | Confirmacion con segundo factor (codigo SMS) |
