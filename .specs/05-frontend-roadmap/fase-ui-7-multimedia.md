# Fase UI-7: Multimedia + Extras (PENDIENTE)

## Resumen

Modulo de gestion multimedia (foto/video), galeria de evidencia, notificaciones push segmentadas por region y animaciones profesionales para la experiencia de usuario en operaciones de emergencia.

## Dependencias

| Paquete | Version | Proposito |
|---------|---------|-----------|
| expo-image-picker | 16.0+ | Camara y galeria |
| expo-video-thumbnails | 8.0+ | Thumbnails de video |
| expo-file-system | 18.0+ | Gestion de archivos locales |
| expo-notifications | 1.0+ | Push notifications |
| expo-image | 2.0+ | Optimizacion de imagenes |
| react-native-video | 6.0+ | Reproductor de video |
| API Multimedia | /api/multimedia (upload, gallery) | Backend |

## Photo/Video Upload

- Captura desde camara nativa o seleccion desde galeria (expo-image-picker)
- Compresion automatica: fotos a 1080px max, video a 720p
- Soporte de multiples archivos simultaneos (hasta 10)
- Barra de progreso por archivo (determinada con expo-file-system)
- Subida en segundo plano con reanudacion en caso de corte de red
- Metadata adjunta: coordenadas GPS, timestamp, tipo de evidencia, usuario
- Lazy upload con cola offline: los archivos se suben cuando hay conectividad

## Evidence Gallery

- Grid de miniaturas con carga progresiva (React Query pagination)
- Filtros: tipo (foto/video), fecha, alerta asociada, usuario
- Vista de detalle: imagen a pantalla completa o video con controles
- Gestos de zoom y pan en imagenes (Gesture Handler + Reanimated)
- Compartir evidencia via ShareSheet nativo
- Eliminacion con confirmacion modal y soft delete (30 dias en papelera)
- Videos con thumbnail generado localmente (expo-video-thumbnails)

## Push Notifications by Region

- Suscripcion a topicos por region geografica:
  - Region Metropolitana, Valparaiso, Biobio, La Araucania, etc.
  - Radio personalizado alrededor de ubicacion actual (5, 10, 25, 50 km)
- Tipos de notificacion configurables:
  - Alertas criticas (sonido + vibracion + pantalla de emergencia)
  - Cambios de estado en alertas seguidas
  - Despachos asignados al usuario
  - Reportes cercanos verificados
- Expo Notifications con canales Android personalizados por tipo
- Firebase Cloud Messaging para entregabilidad en background
- Token FCM registrado en API Usuario al login

## Professional Animations

- **Transiciones entre pantallas**: Reanimated Layout Animations con presets:
  - FadeIn + Slide para navegacion stack
  - Scale para modales
  - SlideLeft/Right para tabs
- **Micro-interacciones**:
  - Boton submit con estado loading -> success -> reset
  - Card press con efecto ripple nativo
  - Like/fav con bounce scale (resorte spring)
  - Error shake en formularios
- **Skeleton loaders**: shimmer animado con mascara SVG para:
  - Listas de alertas y reportes
  - Detalle de perfil
  - Dashboard de analitica
- **Pantalla de inicio**: animacion de logo con particulas de fuego (Canvas/Skia)

## Pull-to-Refresh

- Implementado en todas las listas con UIManager nativo
- Indicador de ultima actualizacion (timestamp relativo)
- Refresh silencioso con staleTime configurable en React Query
- Animacion de icono personalizado (llama giratoria) en lugar de spinner default

## Skeleton Loaders

- Componente reutilizable SkeletonBox con variantes:
  - ListItem: avatar + 2 lineas de texto
  - Card: imagen + titulo + descripcion
  - Chart: area rectangular con linea simulada
  - Map: rectangulo con marcador placeholder
- Animacion shimmer con gradiente lineal desplazado (Reanimated 4)
- Duracion configurable (default 1.5s ciclo)

## Seguridad

- Archivos multimedia escaneados por tipo MIME en backend antes de almacenar
- Thumbnails generados localmente, no enviados al servidor
- URLs de descarga firmadas con expiracion (pre-signed URLs)
- Eliminacion remota al borrar evidencia local
- Metadata GPS preservada solo para evidencia de alerta (no para fotos de perfil)

## Vulnerabilidades

| Riesgo | Mitigacion |
|--------|------------|
| Subida de archivos maliciosos | Validacion MIME + scan antivirus backend |
| Exfiltracion de metadata GPS | Stripping automatico en fotos no operacionales |
| Consumo excesivo de almacenamiento local | Cache limitado a 500MB + limpieza automatica |
| Push notifications spoofeadas | FCM token validado por backend |
