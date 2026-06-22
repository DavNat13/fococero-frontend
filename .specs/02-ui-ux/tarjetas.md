# Tarjetas (Card System)

El sistema de tarjetas es el componente central de presentacion de informacion en FocoCero. Proporciona contenedores visuales jerarquizados para datos operativos.

## Design tokens de tarjetas

| Token | Valor |
|-------|-------|
| `borderRadius` | 16px |
| `padding` | 16px |
| `background` | `--color-card` (#171B26 oscuro / #FFFFFF claro) |
| `shadow` | iOS: `{ shadowColor: '#000', shadowOffset: {0,2}, shadowOpacity: 0.25, shadowRadius: 4 }` Android: `elevation: 4` |
| `border` | 1px solid `--color-border` (#2A2F3E / #E5E5E5) |

## Variantes de Card

### ActionCard

Card con accion principal. Usada en listas de alertas, reportes, usuarios.

```tsx
<ActionCard
  icon={<Flame size={24} color={theme.colors.primary} />}
  title="Incendio en Cerro San Cristobal"
  subtitle="Hace 5 min - Sector norte"
  status="danger" // colorea borde izquierdo
  onPress={() => router.push('/alertas/123')}
/>
```

Props: `icon`, `title`, `subtitle`, `status` (danger/warning/success/info), `onPress`, `badge`, `timestamp`.

### StatCard

Card de metrica numerica. Usada en dashboards.

```tsx
<StatCard
  value={47}
  label="Reportes activos"
  trend="up" // up/down/neutral
  trendValue="+12%"
  color="danger"
/>
```

Props: `value`, `label`, `trend` (up/down/neutral), `trendValue`, `color`, `icon`, `onPress`.

### InfoListItem

Fila de informacion tipo label-valor. Usada en perfiles, detalles.

```tsx
<InfoListItem label="Email" value="usuario@correo.com" />
<InfoListItem label="Rol" value="Brigadista" withDivider />
<InfoListItem label="Ultimo acceso" value={formatDate(lastLogin)} />
```

Props: `label`, `value`, `withDivider`, `icon`, `onPress`.

## Estados de tarjeta

| Estado | Visual | Comportamiento |
|--------|--------|----------------|
| Default | Fondo card, sin opacidad | - |
| Pressed | Opacidad 0.8, scale 0.98 via `ScalePress` | `onPress` se ejecuta |
| Disabled | Opacidad 0.5 | `onPress` no se ejecuta, pointer-events none |
| Loading | Esqueleto shimmer con `SkeletonShimmer` | Sin contenido hasta que carga |
| Selected | Borde izquierdo de 4px con color de estado | Para tarjetas seleccionables |

## Seguridad en tarjetas

- Las tarjetas de alerta no muestran coordenadas exactas en rol ciudadano
- Los `InfoListItem` con datos sensibles (email, telefono) se muestran truncados si la pantalla es compartida
- Las tarjetas de usuario en admin muestran `sub` del JWT como ID, no el ID interno de base de datos
- Los datos de ubicacion se redondean a 2 decimales en cards publicas

## Clean Architecture

Las tarjetas son componentes de presentacion puros. No acceden a almacenamiento, servicios ni API. Reciben toda la informacion via props desde el hook o caso de uso que las consume. El formato de datos (fechas, numeros) se realiza en la capa de presentacion, nunca en la tarjeta misma.
