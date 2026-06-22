# Pantallas (Screen Map)

Mapa completo de pantallas por rol con ruta, descripcion, datos requeridos y guards de acceso.

## Grupo (auth) — Sin autenticacion

| Pantalla | Ruta | Descripcion | Datos requeridos |
|----------|------|-------------|------------------|
| Login | `/(auth)/login` | Inicio de sesion con email + password | JWT (respuesta), refresh token |
| Register | `/(auth)/register` | Registro de nuevo usuario | Nombre, email, password, rol |
| ForgotPassword | `/(auth)/forgot-password` | Solicitud de restablecimiento | Email |

Guard: Si el usuario ya tiene JWT valido, redirige a su grupo correspondiente.

## Grupo (ciudadano) — Rol: ciudadano

| Pantalla | Ruta | Descripcion | Datos requeridos |
|----------|------|-------------|------------------|
| Inicio | `/(ciudadano)/(tabs)/inicio` | Resumen de alertas cercanas | Ubicacion, alertas activas, ultimos reportes |
| Reportar | `/(ciudadano)/(tabs)/reportar` | Formulario de reporte de incendio | Ubicacion, fotos, descripcion, tipo de incendio |
| Alertas | `/(ciudadano)/(tabs)/alertas` | Lista de alertas de incendio | Alertas activas (paginated), filtros |
| Perfil | `/(ciudadano)/(tabs)/perfil` | Datos personales, configuracion, logout | Nombre, email, avatar, preferencias |

Guard: `rol !== 'ciudadano'` redirige a login.

## Grupo (brigadista) — Rol: brigadista

| Pantalla | Ruta | Descripcion | Datos requeridos |
|----------|------|-------------|------------------|
| Dashboard | `/(brigadista)/(tabs)/dashboard` | Metricas tacticas, resumen de operaciones | Incidentes activos, recursos, metricas en tiempo real |
| Mapa | `/(brigadista)/(tabs)/mapa` | Mapa interactivo de incidentes | Incidentes geolocalizados, calor de fuego |
| Reportes | `/(brigadista)/(tabs)/reportes` | Historial detallado de reportes | Reportes (paginated), filtros por fecha/tipo |
| Emergencias | `/(brigadista)/(tabs)/emergencias` | Emergencias activas en tiempo real | Emergencias activas, prioridad, recursos asignados |
| Perfil | `/(brigadista)/(tabs)/perfil` | Datos personales y configuracion operativa | Nombre, email, rol, zona asignada, preferencias |

Guard: `rol !== 'brigadista'` redirige a login.

## Grupo (admin) — Rol: admin

| Pantalla | Ruta | Descripcion | Datos requeridos |
|----------|------|-------------|------------------|
| Dashboard | `/(admin)/(tabs)/dashboard` | Metricas globales del sistema | Usuarios activos, reportes, rendimiento |
| Mapa | `/(admin)/(tabs)/mapa` | Mapa general con todas las operaciones | Todos los incidentes, brigadistas, recursos |
| Usuarios | `/(admin)/(tabs)/usuarios` | Gestion de usuarios del sistema | Lista de usuarios, roles, estado |
| Config | `/(admin)/(tabs)/config` | Configuracion del sistema | Parametros de alerta, zonas, umbrales |
| Perfil | `/(admin)/(tabs)/perfil` | Datos personales, configuracion, logout | Nombre, email, avatar, preferencias |

Guard: `rol !== 'admin'` redirige a login.

## Seguridad y RBAC

- Los guards se ejecutan en el root layout, antes de renderizar cualquier contenido
- La verificacion usa el JWT decodificado: `{ sub, rol, iat, exp }`
- Si el JWT esta expirado, se intenta refresh; si falla, se redirige a login
- Las rutas deep link se validan contra el rol activo antes de navegar
- No existe ruta que exponga datos de otro rol ni aunque se acceda manualmente
- Las pantallas de perfil permiten logout que limpia SecureStore y AsyncStorage

## Clean Architecture

Cada pantalla importa solo su hook de presentacion correspondiente. No importa servicios, repositorios ni casos de uso directamente. Los hooks exponen `{ data, isLoading, error, actions }` que la pantalla mapea a componentes de UI.
