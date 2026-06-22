# Layout y Grid

El sistema de layout de FocoCero esta optimizado para dispositivos moviles con una mano. Utiliza un enfoque basado en espaciado constante (multiples de 4px), safe areas nativas y componentes de layout reutilizables.

## Espaciado (Spacing scale)

| Token | Valor | Uso |
|-------|-------|-----|
| `--sp-1` | 4px | Micro-espaciado entre icono y texto |
| `--sp-2` | 8px | Espaciado interno compacto, gap entre elementos inline |
| `--sp-3` | 12px | Espaciado entre label e input, entre titulo y subtitulo |
| `--sp-4` | 16px | Padding interno de cards y contenedores |
| `--sp-5` | 24px | Margen entre secciones, padding de pantalla |
| `--sp-6` | 32px | Espaciado entre bloques mayores |
| `--sp-7` | 48px | Separacion de secciones principales |
| `--sp-8` | 64px | Margen superior de pantalla, hero spacing |

## Safe Areas

Todas las pantallas usan `SafeAreaLayout` que integra `useSafeAreaInsets` de `react-native-safe-area-context`.

```tsx
<SafeAreaLayout edges={['top', 'bottom']}>
  {children}
</SafeAreaLayout>
```

El componente SafeAreaLayout acepta prop `edges` para controlar que bordes respetan el safe area. Por defecto aplica `top` y `bottom`.

## Keyboard avoidance

`KeyboardScrollLayout` es el componente base para pantallas con formularios:

```tsx
<KeyboardScrollLayout>
  <ControlledInput name="email" />
  <ControlledInput name="password" />
</KeyboardScrollLayout>
```

- Utiliza `KeyboardAvoidingView` con comportamiento `padding` en iOS
- En Android, `windowSoftInputMode="adjustResize"` se configura en el AndroidManifest
- Scroll automatico al campo activo mediante `scrollTo` con offset de 100px sobre el teclado

## Responsive breakpoints

| Categoria | Rango | Comportamiento |
|-----------|-------|----------------|
| Telefono | < 400px | Layout columna unica, tab bar compacta |
| Phone+ | 400-600px | Layout columna unica con padding ampliado |
| Tablet | > 600px | Layout de dos columnas en dashboards, sidebar opcional |

La deteccion se realiza via `useWindowDimensions` de React Native. No se usan media queries CSS.

## Componentes de layout

- **SafeAreaLayout**: Envuelve contenido respetando safe areas
- **FocusAwareStatusBar**: StatusBar que se activa/desactiva segun focus de pantalla
- **KeyboardScrollLayout**: ScrollView con keyboard avoidance
- **ScreenHeader**: Header con titulo, boton de retroceso y acciones opcionales

## Clean Architecture

Los componentes de layout no contienen logica de negocio. Son contenedores puros que reciben children y configuracion via props. La decision de que layout usar se toma en la capa de presentacion (pantallas).

## Seguridad

- Los componentes de layout no manejan datos sensibles
- `FocusAwareStatusBar` ayuda a prevenir shoulder surfing al ocultar contenido cuando la app pierde foco
- En pantallas de formulario de login, `KeyboardScrollLayout` previene que el teclado exponga accidentalmente el campo de contrasena
- Los layout no registran eventos de navegacion que puedan exponer patrones de uso
