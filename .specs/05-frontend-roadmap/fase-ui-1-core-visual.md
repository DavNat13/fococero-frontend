# Fase UI-1: Core Visual (COMPLETADO)

## Resumen

Fundacion visual y arquitectura de componentes del sistema FocoCero. Establece el sistema de diseno atomico, el tema dark tactical, las animaciones base y la navegacion por roles.

## Theme: Dark Tactical + Light

- **Modo oscuro**: Paleta #0D1B2A (fondo), #1B263B (superficie), #E0E1DD (texto primario), #E63946 (acento peligro), #457B9D (acento informacion)
- **Modo claro**: fondo #F1FAEE, superficie #FFFFFF, texto #1D3557, mismos acentos
- **Modo alto contraste**: Cumple AA WCAG 2.1 para accesibilidad en operaciones criticas
- **Theme Provider**: Contexto React con persistencia en SecureStore (no AsyncStorage)

## Atomic Design: 12 Atoms + 12 Molecules

### Atoms (componentes base)
| Atom | Props | Estado |
|------|-------|--------|
| Button | variant, size, loading, disabled | Produccion |
| Text | variant, color, weight | Produccion |
| Input | label, error, icon | Produccion |
| Icon | name, size, color (SVG nativo) | Produccion |
| Badge | type, count, pulse | Produccion |
| Chip | label, selected, onDelete | Produccion |
| Avatar | src, size, fallback, badge | Produccion |
| Divider | orientation, color | Produccion |
| Spinner | size, color | Produccion |
| ProgressBar | value, determinate | Produccion |
| Card | elevation, padding, onPress | Produccion |
| Tooltip | content, position | Produccion |

### Molecules (composiciones funcionales)
| Molecule | Atoms Internos | Proposito |
|----------|---------------|-----------|
| SearchBar | Input + Icon + Chip | Busqueda global |
| FilterChips | Chip[] | Filtros rapidos |
| DataRow | Text + Badge + Icon | Filas de datos |
| FormField | Input + Text (error) + Tooltip | Campos de formulario |
| ModalHeader | Text + Button (close) | Cabecera modal |
| EmptyState | Icon + Text + Button | Estado vacio |
| ErrorState | Icon + Text + Button(retry) | Estado error |
| LoadingOverlay | Spinner + Text | Carga bloqueante |
| ConfirmDialog | Text + Button*2 | Confirmacion destructiva |
| StatusTimeline | Badge + Text + Divider | Timeline vertical |
| MetricCard | Text + ProgressBar + Badge | Indicador numerico |
| SectionHeader | Text + Button(see all) | Encabezado de seccion |

## 4 Layouts Base

| Layout | Slots | Uso |
|--------|-------|-----|
| AuthenticatedLayout | Header + TabBar + Content | App principal logueada |
| GuestLayout | Header + Content + SkipButton | Onboarding y guest |
| AdminLayout | Header + SideMenu + Content + TabBar | Consola administrador |
| ModalLayout | Header + ScrollContent + Footer | Formularios modales |

## 7 Animaciones (Reanimated 4)

| Animacion | Tecnica | Entry Point |
|-----------|---------|-------------|
| FadeIn | opacity + translateY | Widgets al montar |
| SlideUp | translateY con spring | Modales |
| ScalePress | scale con gesture handler | Botones tactiles |
| ShakeError | translateX alternado | Input en error |
| PulseAlert | opacity ciclico | Badges de alerta activa |
| SkeletonLoader | shimmer con SVG mask | Carga de listas |
| TransitionRoute | interpolate con layout | Transiciones entre tabs |

## 3 SVG Illustrations

- **WildfireMap**: Mapa topografico con marcadores de incendio (animado con Reanimated)
- **EmergencyRoute**: Ruta de evacuacion con waypoints
- **TeamDispatch**: Equipo de brigadistas desplegandose

## Tab Bar Navigation por Rol

| Rol | Tabs |
|-----|------|
| Admin | Dashboard | Alertas | Mapa | Despachos | Config |
| Brigadista | Alertas | Mapa | Reportes | Perfil | |
| Ciudadano | Mapa | Alertas | Reportar | Perfil | |

Implementado con Expo Router (grupos `(admin)`, `(brigadista)`, `(ciudadano)`) y role guard en el layout raiz.

## Seguridad

- Tema oscuro por defecto en operaciones nocturnas para reducir fatiga visual
- Alto contraste validado con axe-core para cumplimiento accessibility
- SecureStore para persistencia de preferencias de tema

## DevOps

- Atomic components en `shared/ui/atoms/` con tests unitarios por componente
- Molecules en `shared/ui/molecules/` con tests de integracion
- Snapshot testing con Jest para evitar regresiones visuales
- Storybook integrado para catalogo visual
