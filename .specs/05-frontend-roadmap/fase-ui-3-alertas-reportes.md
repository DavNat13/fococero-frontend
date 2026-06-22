# Fase UI-3: Alertas + Reportes (PENDIENTE)

## Resumen

Modulos de gestion de alertas de incendio y reportes ciudadanos. Implementa listas con filtros, formularios de creacion, detalle con timeline de estados y vinculacion entre alertas y reportes.

## Dependencias

| Requisito | Origen |
|-----------|--------|
| react-hook-form + zod | shared/libs |
| React Query | features/alertas/api, features/reportes/api |
| Zustand stores | entities/alertas, entities/reportes |
| useAlertaFeature | Facade hook (src/features/alertas) |
| useReporteFeature | Facade hook (src/features/reportes) |
| API Alertas | /api/alertas (CRUD + estados) |
| API Reportes | /api/reportes (CRUD + categorias) |

## Alerta List

- FlatList con virtualizacion + paginacion infinita (React Query cursor)
- Filtros: estado (activa, controlada, extinguida), severidad (baja, media, alta, critica), fecha, region
- SearchBar con debounce (300ms) + Chip de filtros activos
- Cada item: titulo, severidad (Badge color), ubicacion, timestamp relativo
- Pull-to-refresh con skeleton loader
- EmptyState personalizado segun filtros aplicados

## Create Alerta Form (Brigadista/Admin)

- Formulario multi-paso con validacion por paso
- Paso 1: Datos basicos (titulo, descripcion, severidad)
- Paso 2: Ubicacion en mapa (selector de punto con react-native-maps)
- Paso 3: Multimedia adjunta (fotos desde camara/galeria)
- Validacion zod con schema compuesto
- Estado submit: loading overlay + respuesta con id de alerta creada
- Offline: cola de creacion diferida con NetInfo

## Alerta Detail

- Header con titulo, severidad, estado actual y timestamp
- Timeline vertical de cambios de estado (StatusTimeline molecule)
- Mapa embebido con marcador de ubicacion
- Seccion de reportes vinculados (FlatList horizontal)
- Acciones: cambiar estado, asignar brigadista (Admin), cancelar alerta
- Boton "Compartir" que genera deep link con params de alerta

## Status Change (Brigadista/Admin)

- Selector de estado: Pendiente -> En Atencion -> Controlada -> Extinguida
- Confirmacion con modal de doble paso para cambios destructivos
- Campo obligatorio de observacion en cada transicion
- Notificacion push automatica a brigadistas asignados

## Report List

- FlatList con filtros: categoria (incendio, quema ilegal, columna de humo, otro), estado, fecha, usuario
- Geo-filtro: reportes cercanos a ubicacion actual (radio configurable)
- Cada item: categoria (icono), direccion aproximada, timestamp, estado de verificacion
- Mapa de calor de reportes (heatmap layer superpuesto)

## Create Report (Ciudadano/Brigadista)

- Formulario: categoria + descripcion + foto + ubicacion automatica (GPS)
- Geolocalizacion con permiso en tiempo real (Expo Location)
- Categorias con iconos descriptivos e ilustraciones contextuales
- Confirmacion: "Tu reporte ha sido recibido. ID: REP-XXXXX"
- Opcion de reporte anonimo (sin datos de usuario en el payload)

## Report Detail + Vinculacion

- Detalle completo con mapa de ubicacion exacta
- Historial de cambios de estado (verificado, en revision, cerrado)
- Boton "Vincular a alerta" (Brigadista/Admin): busca alertas cercanas
- Timeline unificado alerta + reportes vinculados
- Comentarios internos del equipo de emergencia

## Seguridad

- Validacion de roles en cada mutation (solo Brigadista/Admin crean alertas)
- Sanitizacion de coordenadas (no exponer ubicacion exacta del reportante)
- Rate limiting en creacion de reportes por IP/usuario
- Auditoria de cambios de estado con timestamp y usuario

## Vulnerabilidades

| Riesgo | Mitigacion |
|--------|------------|
| Coordenadas de reportante expuestas | Ofuscar +- 50m en vista publica |
| Spam de reportes | Rate limit + captcha silencioso |
| Escalada de estado no autorizada | Validacion backend + role check en facade |
| Inyeccion en campos de texto | Zod + escape en renderizado |
