# Base de Datos

## Stack

| Componente | Version |
|---|---|
| PostgreSQL | 15.x |
| PostGIS | 3.3.x |
| Controlador Node.js | pg 8.x |
| Pool de conexiones | pg.Pool (max 20 por servicio) |

## Topologia: 7 Bases de Datos Independientes

Cada microservicio gestiona su propia base de datos. No hay relaciones cross-DB. La consistencia entre servicios se maneja a nivel de aplicacion.

```
PostgreSQL 15 + PostGIS
    |
    +-- auth_db        (ms-auth)
    +-- geo_db         (ms-geo)
    +-- alertas_db     (ms-alertas)
    +-- reportes_db    (ms-reportes)
    +-- multimedia_db  (ms-multimedia)
    +-- emergencias_db (ms-emergencias)
    +-- analitica_db   (ms-analitica)
```

## Inicializacion (Init Scripts)

Cada base de datos se inicializa con un script SQL numerado en `docker-compose`:

```
docker-entrypoint-initdb.d/
  01-auth.sql
  02-geo.sql
  03-alertas.sql
  04-reportes.sql
  05-multimedia.sql
  06-emergencias.sql
  07-analitica.sql
```

Cada script crea la base de datos, el schema, las tablas, los indices espaciales y los usuarios de aplicacion.

## PostGIS y Datos Espaciales

### Tipos de Dato

- **GEOGRAPHY**: Para datos con coordenadas geograficas (lat/lng). Usado en `reportes`, `alertas`, `emergencias`. Permite calculos precisos de distancia sobre el elipsoide WGS84.
- **GEOMETRY**: Para datos cartograficos proyectados (zonas de riesgo, poligonos). Usado en `geo_db` para capas SIG.

### Indices Espaciales (GIST)

```sql
CREATE INDEX idx_reportes_ubicacion ON reportes USING GIST (ubicacion);
CREATE INDEX idx_alertas_ubicacion  ON alertas  USING GIST (ubicacion);
CREATE INDEX idx_emergencias_ubic   ON emergencias USING GIST (ubicacion);
CREATE INDEX idx_zonas_riesgo_area  ON zonas_riesgo USING GIST (area);
```

Estos indices permiten consultas eficientes como:

```sql
SELECT * FROM reportes
WHERE ST_DWithin(ubicacion, ST_MakePoint(-70.65, -33.45)::geography, 5000);
```

### Funciones Clave

- `ST_DWithin` - Busqueda por radio.
- `ST_Distance` - Calculo de distancia.
- `ST_Area` - Area de poligonos.
- `ST_Intersects` - Interseccion de geometrias.

## Connection Pooling

Cada microservicio mantiene un pool de conexiones independiente con configuracion:

```javascript
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                  // Max conexiones simultaneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
});
```

En docker-compose, todas las conexiones DB son locales (red interna Docker). No se exponen puertos DB al exterior.

## Migraciones

No se utiliza un ORM. Las migraciones se gestionan con scripts SQL versionados en `migrations/` dentro de cada microservicio:

```
microservices/ms-auth/migrations/
  001_create_users.sql
  002_add_telefono.sql
  003_create_refresh_tokens.sql
```

Un script `migrate.js` ejecuta las migraciones en orden al iniciar el contenedor. Las migraciones aplicadas se registran en la tabla `_migrations`.

## Seguridad

- **Queries parametrizadas**: Toda interaccion con la DB usa parametros `$1, $2, ...` en pg. Sin concatenacion de strings.
- **Privilegios minimos**: Cada usuario de DB tiene permisos solo sobre su base de datos (GRANT SELECT, INSERT, UPDATE, DELETE).

```sql
GRANT CONNECT ON DATABASE auth_db TO auth_user;
GRANT USAGE ON SCHEMA public TO auth_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO auth_user;
```

- **Cifrado en reposo**: Se delega a PostgreSQL (cluster cifrado) o al sistema de archivos subyacente (LUKS, EBS encryption).
- **No exponer puertos DB**: Solo los contenedores de microservicios tienen acceso a la red de base de datos.

## Vulnerabilidades

- **SQL Injection**: Mitigada al 100% con queries parametrizadas. Revision periodica de codigo para detectar fugas.
- **Exposicion de datos**: Los datos geoespaciales se almacenan con precision ajustable (GEOGRAPHY) para evitar geolocalizacion exacta del denunciante.
- **Connection Exhaustion**: El pool limitado (max 20) evita DoS por agotamiento de conexiones. Monitorear con `pg_stat_activity`.

## DevOps

- Backup diario via `pg_dump` automatizado en cron del host Docker.
- Las migraciones se ejecutan como paso de CI/CD antes del deploy.
- La configuracion de conexion se inyecta via variables de entorno en cada servicio.
