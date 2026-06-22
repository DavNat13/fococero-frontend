# Componentes

La biblioteca de componentes sigue la arquitectura **Atomic Design**: atomos, moleculas, organismos y templates. Todos los componentes estan en `src/components/` y exportados desde `src/components/index.ts`.

## Atomos (12)

Componentes atomicos, indivisibles, con una sola responsabilidad.

| Componente | Props clave | Descripcion |
|------------|-------------|-------------|
| `Avatar` | `uri`, `name`, `size`, `onPress` | Imagen circular con iniciales fallback |
| `Badge` | `label`, `variant` (primary/danger/warning/success/info) | Indicador de estado numerico o textual |
| `Button` | `title`, `variant`, `loading`, `disabled`, `onPress`, `icon` | Boton primario/secundario/outline/ghost. minHeight 48px |
| `Card` | `children`, `padding`, `onPress`, `elevation` | Contenedor base con borderRadius 16px |
| `Checkbox` | `checked`, `onChange`, `label`, `disabled` | Checkbox con label |
| `Divider` | `color`, `thickness` | Separador horizontal/vertical |
| `IconButton` | `icon`, `onPress`, `size`, `disabled` | Boton solo icono, minHeight 44px |
| `Input` | `value`, `onChangeText`, `placeholder`, `leftIcon`, `rightIcon`, `error`, `secureTextEntry` | Campo de texto. minHeight 48px, borderRadius 12px |
| `ProgressBar` | `progress`, `color`, `height` | Barra de progreso lineal |
| `Spinner` | `size`, `color` | Indicador de carga circular |
| `Switch` | `value`, `onValueChange`, `disabled` | Toggle binario |
| `Typography` | `variant`, `weight`, `color`, `numberOfLines` | Texto con estilos predefinidos |

## Moleculas (12)

Combinaciones de atomos para patrones de uso frecuente.

| Componente | Atomos que usa | Descripcion |
|------------|----------------|-------------|
| `ActionCard` | Card, Typography, IconButton | Card con accion principal, icono y chevron |
| `AlertBanner` | Typography, IconButton | Banner de alerta contextual (danger/warning/success/info) |
| `BottomSheet` | Card, Typography, Button, IconButton | Modal desde abajo, 70% altura con handle |
| `EmptyState` | Typography, Button, Ilustracion SVG | Estado vacio con ilustracion y accion |
| `InfoListItem` | Typography, IconButton, Divider | Fila de informacion con label y valor |
| `InputGroup` | Typography, Input, IconButton | Input con label y mensaje de error integrado |
| `ModalDialog` | Card, Typography, Button | Modal de confirmacion de 2-3 acciones |
| `SearchBar` | Input, IconButton | Input de busqueda con icono y boton de limpiar |
| `SectionHeader` | Typography, IconButton/Button | Header de seccion con titulo y accion opcional |
| `StatCard` | Card, Typography | Card con valor numerico grande y descripcion |
| `StepIndicator` | Typography | Indicador de progreso multi-paso |
| `Toast` | Typography, IconButton | Notificacion temporal, auto-dismiss 3s |

## Layouts (4)

| Componente | Descripcion |
|------------|-------------|
| `SafeAreaLayout` | Contenedor con safe area insets |
| `FocusAwareStatusBar` | StatusBar reactivo al foco |
| `KeyboardScrollLayout` | ScrollView con keyboard avoidance |
| `ScreenHeader` | Header de pantalla con titulo y acciones |

## API de diseno

Todos los componentes siguen este patron:

```tsx
interface ComponentProps {
  /** Descripcion clara de la prop */
  className?: string; // estilos adicionales desde tema
  testID?: string; // para testing
  accessibilityLabel?: string; // para lectores de pantalla
}
```

- Los componentes no manejan estado de negocio
- Las props con valores por defecto se definen en la desestructuracion
- Los eventos siguen nomenclatura `on{Evento}`: `onPress`, `onChangeText`, `onSubmit`
- No se usan default exports; solo exports nombrados

## Seguridad y Clean Architecture

- Los componentes no almacenan ni exponen datos sensibles
- `Input` con `secureTextEntry` previene captura de pantalla en iOS (campo de contrasena)
- Los componentes no importan servicios ni casos de uso directamente
- Las props `testID` se usan para testing automatizado, no para logica de produccion
- `Button` con `loading` previene doble envio en formularios, mitigando CSRF-like accidental
