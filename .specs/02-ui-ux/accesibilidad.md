# Accesibilidad

FocoCero cumple con **WCAG 2.1 AA** como estandar minimo. La aplicacion debe ser operable por personas con discapacidad visual, motriz y cognitiva en condiciones de estres.

## Contraste de color (1.4.3)

Todos los pares de color cumplen relacion de contraste 4.5:1 para texto normal y 3:1 para texto grande (>18px bold o >24px regular).

Verificacion automatica con `react-native-accessibility-engine` en CI. Falla el build si cualquier par no cumple.

## Touch targets (2.5.5)

Todos los elementos interactivos tienen area minima de 44x44px:

| Componente | Tamano real | WCAG minima |
|------------|-------------|-------------|
| Button | 48px altura, padding 16px | 44x44px |
| IconButton | 44x44px minimal | 44x44px |
| Input | 48px altura | 44px altura |
| Switch | 44x28px (handle 44x44 con padding) | 44x44px |
| Card presionable | 44px alto minimo de contenido | 44x44px |
| Tab Bar item | 48x48px (icono + label) | 44x44px |

## Screen readers (4.1.2)

Todos los componentes incluyen props de accesibilidad:

```tsx
<Button
  title="Reportar incendio"
  accessibilityLabel="Reportar nuevo incendio"
  accessibilityRole="button"
  accessibilityState={{ disabled: loading }}
/>
```

### Prácticas obligatorias

- `accessibilityLabel` descriptivo (no el texto exacto, sino la intencion)
- `accessibilityRole` correcto: `button`, `link`, `header`, `image`, `text`, `alert`
- `accessibilityState` para disabled, selected, busy
- `accessibilityLiveRegion="polite"` para contenido que se actualiza (toast, alertas)
- Imagenes decorativas: `accessibilityElementsHidden`
- Grupos de elementos: `accessibilityViewIsModal` en modales

## Navegacion por teclado (2.1.1)

En dispositivos con teclado externo (tablets con teclado Bluetooth):

- `Tab` navega entre elementos interactivos
- `Enter/Space` activa el elemento enfocado
- `Escape` cierra modales y bottom sheets
- Orden de tabulacion sigue el orden visual (arriba a abajo, izquierda a derecha)

## Reduccion de movimiento (2.3.3)

Todas las animaciones respetan `AccessibilityInfo.isReduceMotionEnabled()`:

```tsx
const reduceMotion = useReducerMotion();
const duration = reduceMotion ? 0 : 300;
```

## Semantic headings (1.3.1)

Cada pantalla tiene una jerarquia de encabezados `<Typography variant="h1">` a `h3`. No se saltan niveles. Los headers se registran con `accessibilityRole="header"`.

## Pruebas de accesibilidad

- CI ejecuta `react-native-accessibility-engine` en cada PR
- Pruebas manuales con VoiceOver (iOS) y TalkBack (Android) antes de cada release
- Validacion de contraste con herramienta visual en modo oscuro y claro
- Checklist de accesibilidad en definition of done de cada tarea:
  - [ ] Contraste 4.5:1 verificado
  - [ ] Touch target 44x44px
  - [ ] accessibilityLabel descriptivo
  - [ ] accessibilityRole asignado
  - [ ] Reduce motion soportado
  - [ ] Navegacion por teclado funcional

## Seguridad y accesibilidad

- Los mensajes de error accesibles (accessibilityRole="alert") no revelan informacion interna
- Los valores de campos sensibles tienen `accessibilityLabel` generico "Campo de contrasena" en lugar de revelar el nombre exacto del campo
- Las notificaciones de error no son leidas automaticamente si contienen datos de sesion
- El foco automatico en login se dirige al campo email, no al de contrasena

## Vulnerabilidades de accesibilidad

- No se debe ocultar contenido del lector de pantalla que contenga informacion critica de seguridad
- Los modales de confirmacion (ej. "Cerrar sesion") deben ser accesibles por voz
- Los mensajes de error de autenticacion no deben diferenciar entre "usuario no existe" y "contrasena incorrecta" para prevenir enumeracion de usuarios
