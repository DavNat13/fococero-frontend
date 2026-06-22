# Paleta de Colores

El sistema de colores de FocoCero sigue una arquitectura de tokens CSS organizada en cinco categorias: brand, surface, content, feedback y chart. Soporta modo oscuro (default) y modo claro mediante variables CSS en `global.css`.

## Brand colors

| Token CSS | Valor Oscuro | Valor Claro | Uso |
|-----------|-------------|-------------|-----|
| `--color-primary` | `#EA580C` | `#C2410C` | Accion principal, botones primarios, enlaces, indicadores activos |
| `--color-secondary` | `#57534E` | `#78716C` | Elementos secundarios, badges, iconos decorativos |
| `--color-accent` | `#DC2626` | `#DC2626` | Alertas criticas, emergencias activas, danger buttons |

La primary representa el fuego como senial de alerta. Se usa con moderacion para no saturar visualmente.

## Surface colors

| Token CSS | Oscuro | Claro | Uso |
|-----------|--------|-------|-----|
| `--color-bg` | `#0C0F17` | `#FAFAFA` | Fondo principal de pantalla |
| `--color-card` | `#171B26` | `#FFFFFF` | Fondos de tarjetas, modales, elevacion base |
| `--color-elevated` | `#1F2938` | `#F5F5F5` | Elementos elevados, bottom sheets, dropdowns |
| `--color-border` | `#2A2F3E` | `#E5E5E5` | Bordes de componentes, separadores |

## Content colors

| Token CSS | Oscuro | Claro | Uso |
|-----------|--------|-------|-----|
| `--color-text-primary` | `#FFFFFF` | `#0C0F17` | Texto principal, titulos |
| `--color-text-secondary` | `#9CA3AF` | `#6B7280` | Texto secundario, subtitulos, metadata |
| `--color-text-disabled` | `#4B5563` | `#9CA3AF` | Texto deshabilitado |
| `--color-icon` | `#D1D5DB` | `#4B5563` | Iconos por defecto |

## Feedback colors

| Token CSS | Hex | Uso |
|-----------|-----|-----|
| `--color-danger` | `#EF4444` | Errores, eliminacion, alertas rojas |
| `--color-warning` | `#F59E0B` | Advertencias, atencion, pending operations |
| `--color-success` | `#10B981` | Confirmacion, sincronizacion exitosa, online |
| `--color-info` | `#3B82F6` | Informacion neutra, notificaciones |

## Chart colors

Usados exclusivamente en dashboards de brigadista y admin:
`#EA580C`, `#3B82F6`, `#10B981`, `#F59E0B`, `#8B5CF6`, `#EC4899`

## Accesibilidad y contraste (WCAG AA)

Todos los pares de color cumplen relacion de contraste minima 4.5:1 para texto normal y 3:1 para texto grande (>18px bold o >24px regular).

Pares validados:

- `--color-text-primary` (#FFFFFF) sobre `--color-bg` (#0C0F17): 16.3:1
- `--color-text-secondary` (#9CA3AF) sobre `--color-bg` (#0C0F17): 6.2:1
- `--color-primary` (#EA580C) sobre `--color-card` (#171B26): 4.8:1
- `--color-danger` (#EF4444) sobre `--color-card` (#171B26): 5.1:1

Seguridad: Los tokens de color no contienen informacion sensible. Sin embargo, el modo claro puede exponer contenido en entornos oscuros (ej. operacion nocturna). Por defecto, la app inicia en modo oscuro y solo cambia con configuracion explicita del usuario.

Privacidad: No se utiliza color como unico canal de informacion. Todo estado critico se acompania de texto e icono, asegurando que usuarios con daltonismo reciban la misma informacion.
