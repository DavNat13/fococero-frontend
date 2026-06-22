# Analitica — ms-analitica (puerto 3007)

## Descripcion General

Microservicio de inteligencia de negocio. Centraliza metricas operativas, analisis espacial, predicciones basadas en ML y exportacion de reportes. Cachea resultados en Redis 7 para responder en tiempo real a dashboards.

## Endpoints

| Metodo | Endpoint | Rol | Descripcion |
|---|---|---|---|
| GET | /api/analitica/ops/metricas | BRIGADISTA, ADMIN | Metricas operativas en tiempo real |
| GET | /api/analitica/ops/historial | BRIGADISTA, ADMIN | Historial de operaciones |
| GET | /api/analitica/core/dashboard | BRIGADISTA, ADMIN | KPIs principales del dashboard |
| GET | /api/analitica/core/resumen | BRIGADISTA, ADMIN | Resumen ejecutivo |
| GET | /api/analitica/espacial/* | BRIGADISTA, ADMIN | Analisis espacial (mapas) |
| GET | /api/analitica/filtros/* | BRIGADISTA, ADMIN | Filtros interactivos |
| GET | /api/analitica/predictiva/* | ADMIN | Predicciones ML |
| GET | /api/analitica/exportar/pdf | ADMIN | Exportar dashboard como PDF |
| GET | /api/analitica/exportar/excel | ADMIN | Exportar datos como Excel |

## Dashboard — KPIs Principales

### Metricas Operativas (`/ops/metricas`)
- Alertas activas por nivel (CRITICO, ALTO, MEDIO, BAJO)
- Tiempo promedio de respuesta (desde alerta hasta despacho)
- Focos activos vs controlados vs extintos
- Reportes pendientes de revision
- Distribucion geografica de incidentes (cluster por comuna)

### Core Dashboard (`/core/dashboard`)
- Alertas por hora en las ultimas 24h
- Tasa de confirmacion de alertas (% verificadas vs total)
- Tiempo medio hasta verificacion por brigadista
- Top 5 comunas con mayor actividad

## Analisis Espacial (`/espacial/*`)

- Mapas de calor historicos superpuestos por mes
- Zonas de riesgo calculadas por densidad historica de focos
- Buffer zones alrededor de areas urbanas vulnerables
- Isocronas de respuesta de brigadistas desde puntos de origen

## Filtros Interactivos (`/filtros/*`)

- Filtros combinables: `?fecha_desde&fecha_hasta&comuna&nivel&estado&tipo_reporte`
- Retornan metricas filtradas sin recalcular desde cero (cache segmentado)
- Parametros validados contra listas fijas para evitar injection

## Prediccion ML (`/predictiva/*`)

- Modelos entrenados offline, servidos via ONNX Runtime
- Prediccion de riesgo de propagacion basado en: viento, humedad, temperatura, pendiente, cobertura vegetal
- Output: `{ nivel_riesgo: "alto" | "medio" | "bajo", probabilidad: 0.85, ventana_horas: 6 }`
- Solo ADMIN puede acceder a predicciones (datos sensibles de modelo interno)

## Estrategia de Cache (Redis 7)

| Tipo de Dato | TTL | Invalidacion |
|---|---|---|
| Metricas dashboard | 30s | Por evento de alerta/reporte nuevo |
| Analisis espacial | 5 min | TTL fijo (datos historicos) |
| Filtros | 1 min | Por cambio en datos subyacentes |
| Predicciones | 15 min | Recalculo programado cada 15 min |
| Exportaciones | 10 min | TTL fijo; descarga unica |

## Exportacion

### PDF (expo-print)
- `GET /api/analitica/exportar/pdf?tipo=dashboard&periodo=diario`
- Genera PDF con graficos embebidos (base64) mediante `expo-print`
- Incluye: resumen ejecutivo, KPIs, graficos de tendencia, tabla de alertas activas

### Excel (react-native-xlsx)
- `GET /api/analitica/exportar/excel?tipo=alertas&fecha_desde=...`
- Genera archivo XLSX con libreria `xlsx` en backend
- Hojas separadas por tipo de dato: resumen, detalle, geolocalizacion

## Seguridad y Privacidad

- Datos agregados: no incluyen informacion personal identificable
- Predicciones ML: solo ADMIN; contienen datos de modelo propietario
- Exportaciones: limitadas a 10 por hora por ADMIN
- Cache en Redis 7: no almacena datos personales, solo metricas agregadas

## DevOps

- Worker separado para computo de metricas pesadas (BullMQ)
- Cache warming: precarga de KPIs al iniciar el microservicio
- Health check: `GET /api/analitica/health` verifica conexion Redis + DB
- Monitoreo Prometheus: hit rate de cache, latencia de queries predictivas

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Cache poisoning | Redis con clave segmentada por rol + query params sanitizados |
| Exfiltracion de datos exportados | URL de descarga firmada + TTL 10 min + un solo uso |
| Modelo ML adversarial | Input validation con bounding en features continuas |
| Denegacion por queries pesadas | Rate limit 5 req/min en predictiva; timeout 30s en queries espaciales |
| Datos de prueba en produccion | Cache invalidado si detecta anomalia estadistica > 3 sigma |
