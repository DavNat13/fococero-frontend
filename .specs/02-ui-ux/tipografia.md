# Tipografia

El sistema tipografico de FocoCero utiliza las familias **Inter** (regular, bold) para texto de interfaz y **Roboto** (medium) para datos numericos y monotareas. Ambas estan incluidas via `expo-font` con precarga en el root layout.

## Familias y pesos

| Familia | Pesos | Uso principal |
|---------|-------|---------------|
| Inter | Regular (400), Bold (700) | Texto de interfaz, titulos, contenido general |
| Roboto | Medium (500) | Datos numericos, metricas, dashboard, coordenadas |

La precarga se realiza en `app/_layout.tsx` usando `useFonts` de `expo-font`. Si la carga falla, se usan fuentes nativas de sistema como fallback (San Francisco en iOS, Roboto en Android).

## Escala tipografica

| Token | Size | Line Height | Weight | Uso |
|-------|------|-------------|--------|-----|
| `--fs-xs` | 12px | 16px | 400 | Captions, metadata, timestamps |
| `--fs-sm` | 14px | 20px | 400 | Cuerpo secundario, labels de formulario |
| `--fs-base` | 16px | 24px | 400 | Cuerpo principal de texto |
| `--fs-lg` | 18px | 26px | 700 | Subtitulos, headers de seccion |
| `--fs-xl` | 20px | 28px | 700 | Titulos de pantalla, cards destacadas |
| `--fs-2xl` | 24px | 32px | 700 | Headers principales |
| `--fs-3xl` | 32px | 40px | 700 | Numeros de dashboard, metricas grandes |

## Componentes Typography

```tsx
<Typography variant="h1" weight="bold">Titulo</Typography>
<Typography variant="body" color="secondary">Texto secundario</Typography>
<Typography variant="caption">12px metadata</Typography>
```

El componente Typography acepta: `variant` (h1, h2, h3, body, caption, label, number), `weight` (regular, bold, medium), `color` (primary, secondary, disabled, danger, success, warning), y `numberOfLines` para truncamiento.

## Reglas de uso

- El texto corporal nunca debe ser menor a 14px (`--fs-sm`)
- Los touch targets textuales (enlaces, botones de texto) usan --fs-base
- Los datos numericos en dashboard usan siempre Roboto Medium para mejor legibilidad
- El texto deshabilitado usa opacidad 0.5 sobre el color base, no un color separado
- Los labels de formulario usan --fs-sm con color secondary, los valores --fs-base

## Seguridad en texto

- Los JWT nunca se muestran en pantalla ni en logs de UI
- Los mensajes de error tecnicos se registran via `console.error` solo en dev; en prod se muestran mensajes genericos y legibles
- Los datos sensibles (email, telefono) se muestran truncados en pantallas compartidas: `usu***@correo.com`
- La informacion de coordenadas exactas de brigadistas solo es visible para admin y el propio brigadista

## Clean Architecture

La capa de presentacion no importa tipografia directamente. Usa tokens CSS definidos en `global.css`. Los componentes reciben `variant` y `style` como props, y el tema se aplica via contexto. Esto permite cambiar la fuente completa sin modificar componentes individuales.
