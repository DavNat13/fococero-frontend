# Geo — ms-geo (puerto 3002)

## Descripcion General

Microservicio de inteligencia geoespacial. Gestiona focos de incendio con PostGIS, permitiendo reportar, consultar por cercania, actualizar perimetros y generar datos para mapas de calor. Endpoints publicos para consultas basicas sin autenticacion.

## Arquitectura de Datos Espaciales

- Base de datos: PostgreSQL 16 con extension PostGIS 3.4
- Columna geometrica: `geometry(Point, 4326)` para coordenadas WGS84
- Indice: `GIST (geom)` para acelerar queries de distancia y bounding box
- Proyeccion: SRID 4326 (WGS84) para entrada/salida; SRID 32719 (UTM 19S) para calculos de area

## Endpoints

| Metodo | Endpoint | Auth | Descripcion |
|---|---|---|---|
| POST | /api/geo | JWT (CIUDADANO+) | Reportar nuevo foco de incendio |
| GET | /api/geo | Opcional | Listar focos (con filtros) |
| GET | /api/geo/cercanos | Opcional | Focos cercanos a una ubicacion |
| GET | /api/geo/:id | Opcional | Obtener foco por ID |
| PATCH | /api/geo/:id/estado | BRIGADISTA, ADMIN | Cambiar estado del foco |
| PATCH | /api/geo/:id/perimetro | BRIGADISTA, ADMIN | Actualizar perimetro del foco |

### Endpoints Publicos

Los endpoints GET no requieren autenticacion. Esto permite que mapas embebidos y widgets publicos consuman datos sin token. El rate limiting se aplica igualmente (30 req/min para no autenticados).

## Reportar Foco de Incendio

```
POST /api/geo
  Payload: {
    latitud: -33.456,        // WGS84
    longitud: -70.678,
    nombre?: "Foco Las Lomas",
    descripcion?: "Foco visible desde ruta 5",
    fuente: "ciudadano" | "brigadista" | "satelite" | "drone",
    nivel_confianza: 0.85    // 0-1
  }
  → Crea geometry Point
  → Estado inicial: "activo"
  → Si fuente=ciudadano → nivel_confianza default 0.5
  → Dispara evento a ms-alertas si nivel_confianza > 0.7
```

## Consultas de Cercania

- `GET /api/geo/cercanos?lat=-33.456&lng=-70.678&radius=10&unidad=km`
- Implementacion: `ST_Distance(geography(f.geom), geography(ST_MakePoint(lng, lat)))`
- Indice GIST permite ejecucion en < 50ms para 100k registros
- Parametros: `radius` default 10km, `unidad` soporta km/m

## Estados del Foco

| Estado | Descripcion | Transiciones Permitidas |
|---|---|---|
| activo | Incendio en curso | controlado, extinto |
| controlado | Incendio contenido | activo, extinto |
| extinto | Incendio apagado | activo (reavivamiento) |

## Actualizacion de Perimetro

- `PATCH /api/geo/:id/perimetro`
- Payload: `{ poligono: [[lng,lat], ...] }` — array de coordenadas formando poligono cerrado
- Almacenado como `geometry(Polygon, 4326)`
- Calculo automatico de area en hectareas via `ST_Area(geography(poligono)) / 10000`
- Solo BRIGADISTA y ADMIN pueden actualizar perimetro

## Heatmap Data

- `GET /api/geo/heatmap?bbox=-71,-34,-70,-33&zoom=12`
- Retorna grid de intensidad: `{ grid: [{ lat, lng, peso }] }`
- `peso` = combinacion de nivel_confianza + cantidad de reportes en el area
- Cacheable por 5 minutos (inmutabilidad de datos historicos)

## Seguridad y Privacidad

- Endpoints publicos GET no exponen datos personales del reportante
- Coordenadas exactas visibles en todos los niveles (dato de bien publico)
- Rate limiting diferenciado: 30 req/min publico, 100 req/min autenticado

## DevOops

- Migraciones PostGIS con `knex` usando `knex.raw('CREATE EXTENSION IF NOT EXISTS postgis')`
- Indices GIST creados en migracion inicial
- Backups diarios de tabla geo con `pg_dump --format=custom`
- Monitoreo de queries lentas (> 200ms) en logs estructurados

## Vulnerabilidades

| Vulnerabilidad | Mitigacion |
|---|---|
| Spam de focos | Rate limit 3 focos/hora por CIUDADANO; sin limite para BRIGADISTA/ADMIN |
| Coordenadas invalidas | Validacion: lat -90 a 90, lng -180 a 180 + bounding box Chile |
| Poligono malformado | Validacion de cierre (primer punto = ultimo punto) y no interseccion |
| Data poisoning por multiples reportes | Promedio ponderado de coordenadas por confianza |
| Inyeccion PostGIS | Parametrizacion estricta con Knex raw bindings |
