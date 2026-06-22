# Fase UI-6: Analitica + Exportar (PENDIENTE)

## Resumen

Dashboard de analitica con KPIs visuales, graficos interactivos y exportacion de reportes en PDF y Excel. Proporciona inteligencia operativa para la toma de decisiones en la gestion de incendios.

## Dependencias

| Paquete | Version | Proposito |
|---------|---------|-----------|
| react-native-chart-kit | 6.12+ | Graficos de linea y barra |
| expo-print | 14.0+ | Generacion de PDF |
| react-native-xlsx | 1.2+ | Exportacion Excel |
| expo-sharing | 13.0+ | Compartir archivos |
| API Analitica | /api/analitica (KPIs, series temporales) | Datos |

## Dashboard con KPIs Visuales

| KPI | Tipo | Descripcion |
|-----|------|-------------|
| Alertas activas | Contador + Badge | Numero actual de incendios activos |
| Tasa de control | Porcentaje + ProgressBar | Alertas controladas vs totales del periodo |
| Tiempo promedio de respuesta | Time (hh:mm) | Desde creacion hasta primer despacho |
| Reportes ciudadanos | Contador | Reportes recibidos en las ultimas 24h |
| Recursos desplegados | Contador | Unidades activas en terreno |
| Zonas criticas | Mapa heatmap | Densidad geografica de incidentes |

Cada KPI es una MetricCard molecule con animacion de conteo (Reanimated 4).

## Line Charts (Tendencias Temporales)

- Alertas por dia (ultimos 30 dias): linea de tendencia con area sombreada
- Tasa de control acumulada semanal: linea con punto de quiebre semanal
- Tiempo de respuesta promedio diario: linea con desviacion estandar
- Interactivo: tooltip al presionar punto del grafico con valor exacto
- Eje X formateado como fecha local (dd/mm)
- Eje Y con escala automatica segun rango de datos

## Bar Charts (Comparaciones)

- Alertas por region: barras horizontales ordenadas por cantidad
- Recursos utilizados por tipo: barras agrupadas (terrestre, aereo, acuatico)
- Reportes por categoria: barras con color por categoria
- Comparativa mes actual vs mes anterior: barras lado a lado
- Animacion de entrada con stagger effect en las barras

## Interactive Date Filters

- Selector de rango de fechas (CalendarPicker nativo)
- Predefinidos: Hoy, Ultimos 7 dias, Ultimos 30 dias, Este mes, Personalizado
- Filtro por region (selector de zonas geograficas desde API Geo)
- Filtro por tipo de incidente (wildfire, quema controlada, columna de humo)
- Todos los graficos se actualizan con animacion de transicion al cambiar filtros

## PDF Export (expo-print)

- Plantilla de reporte ejecutivo con:
  - Encabezado: logo FocoCero + fecha de generacion + periodo analizado
  - Resumen ejecutivo: KPIs principales con valores
  - Graficos incrustados (captura como imagen via react-native-view-shot)
  - Tabla de datos detallada (alertas, despachos, recursos)
  - Pie de pagina: generado por, version del sistema, timestamp
- Opciones: orientacion vertical, fuente sans-serif, margenes de 20mm
- Preview antes de exportar (WebView con PDF generado)
- Compartir via expo-sharing (email, Drive, WhatsApp)

## Excel Export (react-native-xlsx)

- Workbook con hojas:
  - Hoja 1: Resumen de KPIs por periodo
  - Hoja 2: Detalle de alertas (ID, titulo, severidad, estado, fecha, region)
  - Hoja 3: Detalle de despachos (ID, recurso, unidad, destino, estado)
  - Hoja 4: Reportes ciudadanos (ID, categoria, ubicacion, fecha)
- Formato: celdas con headers en negrita, bordes, colores alternados
- Fecha en formato ISO 8601 para compatibilidad con Excel

## Geospatial Heatmap

- Integracion con react-native-maps para mapa de densidad
- Superposicion de calor en dashboard analitico
- Datos desde API Analitica endpoint /api/analitica/heatmap
- Actualizacion bajo demanda (no polling continuo)

## Seguridad

- Datos de analitica visibles solo para Admin y Brigadista jefe
- Exportacion de PDF/Excel no incluye datos de ubicacion exacta de personas
- Filtros de fecha limitados a datos historicos (no futuro)
- Cache de graficos invalidado al cambiar filtros

## Vulnerabilidades

| Riesgo | Mitigacion |
|--------|------------|
| Exposicion de datos agregados por region | Role-based access control en API |
| PDF generado con datos sensibles | Filtro automatico de columnas PII |
| XLSX malicioso generado por inyeccion | Libreria cliente-side, sin macros |
| Cache de datos analiticos obsoletos | staleTime corto (5 min) en queries |
