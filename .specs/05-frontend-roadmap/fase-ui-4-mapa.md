# Fase UI-4: Mapa Interactivo (PENDIENTE)

## Resumen

Componente de mapa central de FocoCero con visualizacion en tiempo real de incendios, reportes, rutas de evacuacion y recursos desplegados. Integra react-native-maps con capas de calor, clustering y tracking.

## Dependencias

| Paquete | Version | Proposito |
|---------|---------|-----------|
| react-native-maps | 1.18+ | Mapa base nativo |
| react-native-maps-heatmap | 0.2+ | Capa de densidad de calor |
| react-native-maps-super-cluster | 2.0+ | Clustering de marcadores |
| expo-location | 18.0+ | GPS del dispositivo |
| @react-google-maps/api | (web) | Alternativa web si aplica |

## Modos de Visualizacion

| Modo | Tipo | Uso Principal |
|------|------|---------------|
| Estandar | MapType.standard | Navegacion general |
| Satelital | MapType.satellite | Evaluacion de terreno |
| 3D | MapType.hybrid + elevation | Visualizacion topografica |

Selector de modo en toolbar flotante (esquina superior derecha).

## Heatmap Layer

- Datos de entrada: array de {latitude, longitude, weight} desde API Geo
- Weight basado en severidad (1-4): bajo, medio, alto, critico
- Radio de punto configurable (default 30px)
- Opacidad progresiva con grado de densidad
- Gradiente personalizado: verde (baja) -> amarillo -> naranja -> rojo (critica)
- Actualizacion cada 30 segundos desde polling de React Query

## Custom Markers por Tipo

| Tipo | Icono | Color | Comportamiento |
|------|-------|-------|----------------|
| Incendio activo | Llama | Rojo | Pulso animado |
| Reporte ciudadano | Pin | Amarillo | Sin pulso |
| Brigadista | Escudo | Azul | Movimiento en tiempo real |
| Recurso hidrico | Gota | Cyan | Static |
| Punto de encuentro | Bandera | Verde | Static |
| Ruta de evacuacion | Linea | Blanco | Polilinea |

Cada marker tiene callout personalizado con informacion resumida y boton "Ver detalle".

## Zoom y Gestos

- Zoom min: 5 (vista regional), zoom max: 20 (vista de calle)
- Gestos habilitados: pan, zoom (pinch), rotate, tilt (en 3D)
- Botones de control: zoom in/out, centrar en ubicacion actual
- Animacion de camara con `animateCamera` para transiciones suaves
- Lazy loading de marcadores segun viewport visible

## Location Tracking

- Seguimiento continuo con `watchPositionAsync` de Expo Location
- Precisio: alta en foreground, baja en background
- Icono de ubicacion actual con precision ring
- Boton "Centrar en mi ubicacion" con animacion de camara
- Permiso de ubicacion en tiempo real con explicacion contextual

## Busqueda

- SearchBar integrada en toolbar superior
- Resultados: direcciones (Google Places / Nominatim), zonas, alertas cercanas
- Autocompletado con debounce 400ms
- Al seleccionar: animacion de camara al lugar + marcador temporal
- Historial de busquedas recientes (local en SecureStore)

## Rutas de Navegacion

- Polilinea desde punto A a punto B con waypoints
- Calculo de ruta optima (evitando zonas de incendio activo)
- Tiempo estimado de llegada (ETA) mostrado en tarjeta inferior
- Opciones: vehiculo, pie, todoterreno
- Actualizacion en tiempo real si la ruta cambia por evolucion del incendio

## Seguridad

- Coordenadas de brigadistas visibles solo para Admin y otros brigadistas
- Guest Access: mapa sin marcadores de recursos ni tracking
- Datos de ubicacion no persistidos en almacenamiento local
- Permiso de ubicacion solicitado con rationale explicito

## Vulnerabilidades

| Riesgo | Mitigacion |
|--------|------------|
| Exposicion de posicion de brigadistas | Role-based filtering en capa de mapa |
| Consumo excesivo de bateria por GPS | throttling a 10s en background |
| Datos de mapa cacheados sin control | Cache control con maxAge configurable |
| Clickjacking en callouts | Botones nativos con confirmacion |
