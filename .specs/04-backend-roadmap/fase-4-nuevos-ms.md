# Fase 4: Nuevos Microservicios

> Dos microservicios avanzados: emergencias (despacho con idempotencia) y analitica (predicciones con Redis y tablas particionadas). Siete bases de datos independientes.

---

## ms-emergencias

**Proposito**: gestion de despacho de emergencias con garantias de idempotencia, reintentos controlados y trazabilidad completa mediante correlation_id.

**Base de datos**: `db_emergencias` - tablas `emergencias`, `despachos`, `historial_despachos`.

### Flujo de despacho

1. Se recibe una solicitud POST /emergencias con datos de ubicacion, tipo y prioridad
2. El servicio asigna un `correlation_id` unico (UUID v4)
3. Se intenta el despacho: asignacion de brigada, envio de notificaciones
4. Si falla, se programa reintento automatico con backoff exponencial
5. El estado avanza: `pendiente` -> `asignado` -> `en_ruta` -> `en_escena` -> `controlado` -> `cerrado`

### Idempotencia

El endpoint `POST /emergencias/:id/retry` implementa idempotencia: si se invoca multiples veces con el mismo `correlation_id`, solo se procesa una vez. El servicio verifica si ya existe un despacho con ese correlation_id antes de crear uno nuevo.

```typescript
async function dispatch(correlationId: string, payload: DispatchPayload) {
  const existing = await findDispatchByCorrelationId(correlationId);
  if (existing) return existing; // ya procesado, retorna resultado existente
  return createDispatch(correlationId, payload);
}
```

### Estados de emergencia

| Estado      | Descripcion                                  |
| ----------- | -------------------------------------------- |
| pendiente   | Recien creada, sin asignar                   |
| asignado    | Brigada asignada                             |
| en_ruta     | Brigada en desplazamiento                    |
| en_escena   | Brigada en el lugar                          |
| controlado  | Incendio contenido                           |
| cerrado     | Emergencia finalizada                        |

## ms-analitica

**Proposito**: dashboard de metricas, analisis predictivo y cache distribuido con Redis.

**Base de datos**: `db_analitica` con tablas particionadas por mes para manejar grandes volumenes de datos historicos.

### Tablas particionadas

```sql
CREATE TABLE metricas_incendios (
  id SERIAL,
  fecha TIMESTAMP NOT NULL,
  region VARCHAR(100),
  area_afectada DOUBLE PRECISION,
  duracion_horas INTEGER
) PARTITION BY RANGE (fecha);

CREATE TABLE metricas_incendios_2026_01 PARTITION OF metricas_incendios
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### Redis cache

Redis se utiliza en modo cache distribuido para:
- Almacenar resultados de consultas frecuentes (dashboard, metricas diarias)
- TTL configurable por tipo de consulta (60s a 300s)
- Cache invalidation manual ante nuevos datos

```typescript
const cacheKey = `dashboard:resumen:${region}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
const data = await computeDashboard(region);
await redis.setex(cacheKey, 120, JSON.stringify(data));
return data;
```

### Analitica predictiva

El modulo de prediccion utiliza regresion lineal simple sobre datos historicos para estimar:
- Probabilidad de incendio por region basada en temperatura y humedad
- Tiempo estimado de control dado el area afectada
- Tendencia semanal de incidentes

Los modelos se recalculan periodicamente y los resultados se cachean en Redis.

## Siete bases de datos independientes

Cada microservicio gestiona su propia base de datos PostgreSQL con esquemas aislados. Esto garantiza independencia, aislamiento de fallos y despliegues autonomos.

| Base de datos  | Servicio asociado | Proposito                            |
| -------------- | ----------------- | ------------------------------------ |
| db_auth        | ms-auth           | Usuarios, roles, sesiones            |
| db_geo         | ms-geo            | Datos espaciales PostGIS             |
| db_alertas     | ms-alertas        | Alertas e historial                  |
| db_reportes    | ms-reportes       | Reportes, categorias, estados        |
| db_multimedia  | ms-multimedia     | Archivos y metadatos                 |
| db_emergencias | ms-emergencias    | Despachos y emergencias              |
| db_analitica   | ms-analitica      | Metricas, predicciones, tablas particionadas|

Cada base de datos tiene scripts de inicializacion numerados: `001-init.sql`, `002-seed.sql`, etc.

## Vulnerabilidades mitigadas

| Vulnerabilidad               | Mitigacion                                |
| ---------------------------- | ----------------------------------------- |
| Duplicacion de despachos     | Idempotencia por correlation_id UUIDv4    |
| Fallos de proceso            | Reintentos con backoff exponencial        |
| Cache obsoleto               | TTL + invalidation manual                 |
| Crecimiento de tablas        | Particionamiento por mes                  |
| Contencion de datos          | Bases de datos independientes por servicio|
