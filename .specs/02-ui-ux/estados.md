# Estados de Componentes

Cada componente en FocoCero puede existir en uno de siete estados visuales. El sistema garantiza que el usuario siempre comprenda el estado actual del sistema y pueda tomar la accion correspondiente.

## Estados definidos

| Estado | Gatillo | Visual | Sonido/Haptic |
|--------|---------|--------|---------------|
| Default | Render inicial sin interaccion | Estilo base del componente | Ninguno |
| Pressed | Touch inicio | Opacidad 0.8, scale 0.98 | Haptic ligero (opcional) |
| Disabled | Prop `disabled=true` | Opacidad 0.5, pointer-events none | Ninguno |
| Loading | Prop `loading=true` (o datos no disponibles) | Spinner o skeleton shimmer | Ninguno |
| Error | Validacion fallida, red error | Borde rojo, texto de error, `ShakeError` | HapticWarning |
| Offline | NetInfo detecta sin conexion | Icono WifiOff, opacidad reducida, banner | Ninguno |
| Empty | Lista sin datos, busqueda sin resultados | `EmptyState` con ilustracion y accion | Ninguno |

## Patrones visuales por estado

### Default
- Fondo: `--color-card` (#171B26)
- Borde: `--color-border` (#2A2F3E)
- Texto: `--color-text-primary` (#FFFFFF)

### Pressed
- Button: `ScalePress` aplica `transform: [{ scale: 0.98 }]` y `opacity: 0.8`
- Card: misma transformacion que button, borde cambia a primary
- IconButton: opacidad 0.7, sin escala

### Disabled
- Opacidad 0.5 para todo el componente
- `pointer-events: none` para prevenir interaccion
- Texto usa `--color-text-disabled` (#4B5563)
- El componente mantiene estructura visual para evitar layout shift

### Loading
- Botones: spinner reemplaza el texto, ancho fijo (no colapsa)
- Cards/tarjetas: `SkeletonShimmer` con rectangulos del tamano del contenido esperado
- Listas: 3-5 skeleton items mientras carga
- Pantallas completas: spinner centrado o skeleton layout segun contexto

### Error
- Input: borde cambia a `--color-danger`, icono de error a la derecha, mensaje debajo
- Formulario: `ShakeError` anima el input erroneo
- Toast: aparece con variante danger, duracion 4s
- Pantalla completa: `AlertBanner` con mensaje y boton de reintento

### Offline
- Banner persistente en la parte superior: "Sin conexion - Los cambios se guardaran localmente"
- Icono `WifiOff` en tab bar (si aplica)
- Botones de envio muestran "Guardando localmente" en lugar de "Enviar"
- Los datos en cache se muestran con indicador de posible desactualizacion

### Empty
- `EmptyState` con ilustracion SVG contextual (EmptyRadar, OfflineSatellite, CloudSyncSuccess)
- Mensaje claro: "No hay reportes cerca" no "Error 404"
- Boton de accion: "Reportar nuevo incendio" o "Recargar"

## Seguridad en estados

- Estado `Error` nunca muestra stack traces, codigos internos, ni informacion de la BD
- Estado `Offline` no revela informacion sobre la infraestructura de red
- Estado `Loading` previene doble tap en botones (mitigacion de race condition en envios)
- Estado `Disabled` en formularios previene envio de datos incompletos

## Clean Architecture

Los estados se gestionan en la capa de hooks de presentacion, no en los componentes. Cada hook expone `{ data, isLoading, error, isOffline }` que las pantallas mapean al estado del componente correspondiente. Los componentes no conocen la fuente de los datos ni la logica de negocio.
