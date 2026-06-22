# Animaciones

El sistema de animaciones utiliza **react-native-reanimated 4** con Worklets para animaciones declarativas en el hilo de UI. Todas las animaciones respetan la configuracion de accesibilidad `reduceMotion` del sistema operativo.

## Principios

- Duracion estandar: 300ms (entradas/salidas); 150ms (micro-interacciones)
- Easing: `EaseInOut` para movimientos naturales, `EaseOut` para entradas
- Las animaciones nunca bloquean interaccion del usuario
- Todas las animaciones son cancelables si el componente se desmonta
- Respetar `useReducedMotion()`: si activo, animaciones duran 0ms

## Animaciones registradas

```tsx
// Ejemplos de uso
<FadeIn duration={300}>
  <Card />
</FadeIn>

<ScalePress onPress={handlePress}>
  <Button title="Presioname" />
</ScalePress>

<SlideUpCard>
  <BottomSheet />
</SlideUpCard>

<ShakeError>
  <Input error={true} />
</ShakeError>

<PulseAlert>
  <AlertBanner variant="danger" />
</PulseAlert>
```

## Catalogo de animaciones

| Animacion | Tipo | Duracion | Uso |
|-----------|------|----------|-----|
| `FadeIn` | Entrada | 300ms | Cards, contenido que aparece al navegar |
| `ScalePress` | Interaccion | 150ms | Botones, cards presionables (scale 0.98, opacity 0.8) |
| `SlideUpCard` | Entrada | 300ms | BottomSheet, ModalDialog (translacion 100px -> 0) |
| `ShakeError` | Feedback | 400ms | Input con error, formularios con validacion fallida |
| `PulseAlert` | Llamada de atencion | Infinite | AlertBanner de emergencia, badge de alerta activa |
| `SkeletonShimmer` | Carga | 1500ms loop | Skeleton loaders, shimmer effect en cards |
| `KeyboardShift` | Layout | 300ms | Scroll automatico al campo activo con offset |

## Skeleton loaders

Para contenido asincrono, usar `SkeletonShimmer` envuelto en un componente placeholder:

```tsx
<View style={styles.card}>
  <SkeletonShimmer width={120} height={16} />
  <SkeletonShimmer width={200} height={48} style={{ marginTop: 8 }} />
</View>
```

Los skeleton loaders tienen borderRadius 8px, color base `--color-card` (#171B26) y shimmer `--color-elevated` (#1F2938).

## Pull-to-refresh

Implementado con `RefreshControl` nativo de React Native. Al hacer pull:

1. Icono de sincronizacion animado (rotacion 360 grados)
2. Ejecuta `syncOrchestrator.sync()` que procesa la outbox y refresca datos
3. Al completar, feedback visual con `Toast` de exito o error
4. En caso de error de red, muestra `AlertBanner` con opcion de reintento

## Micro-interacciones

- Tab bar: icono seleccionado escala 1.1 con bounce al cambiar de tab
- Checkbox/Switch: animacion suave de 200ms al cambiar estado
- Toast: slide in desde arriba, fade out a los 3s
- Boton loading: el icono gira mientras `loading=true`

## Devops y rendimiento

- Animaciones se evaluan en el hilo de UI con Reanimated Worklets, sin pasar por el bridge JS
- El bundle de Reanimated se audita con `react-native-bundle-visualizer`
- Animaciones condicionales: `PulseAlert` solo corre cuando la pantalla esta en foco (useIsFocused)
- No se usan librerias de animacion adicionales; Reanimated 4 cubre todos los casos de uso
