# ms-template: Arquetipo para nuevos microservicios

> Guia paso a paso para crear un nuevo microservicio a partir de la plantilla estandarizada.

---

## Estructura de la plantilla

```
services/ms-template/
├── src/
│   ├── controllers/       # Handlers HTTP (validan input, responden)
│   ├── services/          # Casos de uso (logica de negocio pura)
│   ├── repositories/      # Acceso a base de datos (pg pool)
│   └── models/            # Interfaces TypeScript del dominio
├── db/
│   └── init/
│       ├── 001-init.sql   # Creacion de tablas
│       └── 002-seed.sql   # Datos de prueba iniciales
├── tests/                 # Tests unitarios (pendiente)
├── .env.example           # Variables de entorno requeridas
├── Dockerfile             # Build multi-stage
├── tsconfig.json          # Extiende tsconfig.base.json
└── package.json           # workspace con nombre unico
```

## Paso a paso

### 1. Copiar la plantilla

```bash
cp -r services/ms-template services/ms-nuevo-servicio
```

### 2. Renombrar en package.json

Editar `services/ms-nuevo-servicio/package.json`:

```json
{
  "name": "ms-nuevo-servicio",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 3. Configurar variables de entorno

Crear `services/ms-nuevo-servicio/.env` a partir de `.env.example`:

```env
PORT=4008
DB_HOST=localhost
DB_PORT=5432
DB_NAME=db_nuevo_servicio
DB_USER=postgres
DB_PASSWORD=postgres
EUREKA_HOST=localhost
EUREKA_PORT=8761
SERVICE_NAME=ms-nuevo-servicio
```

### 4. Ajustar puerto y nombre de servicio

En `src/index.ts` verificar que `SERVICE_PORT` coincida con `PORT` del .env y que el nombre se registre correctamente en Eureka.

### 5. Crear tablas en la base de datos

Editar `db/init/001-init.sql` con el schema del nuevo servicio. Usar el patron numerado para mantener orden:

```sql
-- 001-init.sql
CREATE TABLE IF NOT EXISTS entidades (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Agregar datos de prueba en `002-seed.sql` si es necesario.

### 6. Registrar en docker-compose.yml

Agregar el nuevo servicio al archivo `docker-compose.yml`:

```yaml
ms-nuevo-servicio:
  build:
    context: ./services/ms-nuevo-servicio
    dockerfile: Dockerfile
  ports:
    - "4008:4008"
  environment:
    - PORT=4008
    - DB_HOST=postgis-main
    - DB_NAME=db_nuevo_servicio
    - EUREKA_HOST=eureka-server
  networks:
    - fococero-net
  depends_on:
    - postgis-main
    - eureka-server

postgis-nuevo-servicio:
  image: postgis/postgis:16-3.4
  environment:
    - POSTGRES_DB=db_nuevo_servicio
  volumes:
    - ./services/ms-nuevo-servicio/db/init:/docker-entrypoint-initdb.d
  networks:
    - fococero-net
```

### 7. Registrar rutas en el API Gateway

Agregar el proxy en `services/api-gateway/src/index.ts`:

```typescript
app.use('/nuevo-servicio', authenticate, createProxyMiddleware({
  target: `http://ms-nuevo-servicio:4008`,
  changeOrigin: true,
}));
```

### 8. Verificar registro en Eureka

Iniciar el entorno con `docker-compose up -d` y confirmar en `http://localhost:8761` que el nuevo servicio aparece en la lista de instancias registradas.

## Buenas practicas

- **No copiar logica de negocio**: si dos servicios comparten logica, extraer a un paquete compartido
- **Testing**: agregar tests en `tests/` antes de considerar el servicio completo
- **Documentacion**: actualizar `fase-6-proximos-pasos.md` cuando el servicio entre en operacion
- **Puertos**: mantener el rango 4001-4010 para microservicios. Reservar 4011+ para futuros servicios
- **Nombres de base de datos**: usar el prefijo `db_` seguido del nombre del servicio (ej: `db_nuevo_servicio`)

## Checklist de creacion

- [ ] Copiar ms-template
- [ ] Renombrar en package.json
- [ ] Configurar .env con puerto unico
- [ ] Crear tablas en 001-init.sql
- [ ] Agregar seed data en 002-seed.sql
- [ ] Registrar en docker-compose.yml
- [ ] Agregar base de datos en docker-compose.yml
- [ ] Registrar ruta en API Gateway
- [ ] Verificar registro en Eureka dashboard
- [ ] Confirmar conexion a base de datos
- [ ] Ejecutar `npm run build` sin errores
