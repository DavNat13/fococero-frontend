# Infraestructura - FocoCero

Arquitectura de despliegue con 11 servicios Docker. Seguridad JWT integrada en cada capa de red. Clean Architecture aplicada a topologia de contenedores.

## Topologia de Red

Todos los servicios corren en una misma red Docker (`fococero-net`) con `bridge` driver. La comunicacion entre servicios usa el nombre del contenedor como hostname.

| Servicio | Puerto | Imagen | Base |
|---------|--------|--------|------|
| postgis | 5432 | postgres:15-alpine | Servicio: postgres |
| pgadmin | 5050 | dpage/pgadmin4 | Frontend: admin |
| redis-cache | 6379 | redis:7-alpine | Cache: geodata, sesiones |
| eureka-server | 8761 | steeltoe/eureka | Discovery |
| api-gateway | 3000 | node:22-alpine | Gateway: JWT |
| auth-ms | 3001 | node:22-alpine | Autenticacion |
| geo-ms | 3002 | node:22-alpine | Geoespacial |
| alertas-ms | 3003 | node:22-alpine | Alertas |
| reportes-ms | 3004 | node:22-alpine | Reportes |
| multimedia-ms | 3005 | node:22-alpine | Multimedia |
| emergencias-ms | 3006 | node:22-alpine | Emergencias |
| analitica-ms | 3007 | node:22-alpine | Analitica |

## Mapeo de Puertos

El puerto 5432 (Postgres) solo es accesible desde `postgis` y desde el Gateway si el microservicio requiere datos espaciales. Los microservicios (3001-3007) no exponen puertos al host; solo el Gateway (3000) y pgadmin (5050) son accesibles desde el exterior.

```yaml
ports:
  - "3000:3000"   # API Gateway (unico punto de entrada)
  - "5050:5050"   # pgadmin (consola de administracion)
  - "8761:8761"   # eureka (dashboard de servicios)
```

Los microservicios 3001-3007 no exponen puertos en modo produccion. Se comunican internamente a traves de la red Docker.

## Volumenes y Persistencia

| Volumen | Servicio | Ruta | TTL |
|---------|--------|------|-----|
| pg_data | postgis | /var/lib/postgresql/data | Persistente |
| redis_data | redis | /data | Cache: expiracion LRU |

El volumen `pg_data` se declara en `docker-compose.yml` con `driver: local`. No se montan volúmenes `tmpfs` para evitar perdida de datos de sesiones JWT.

## Multi-Stage Builds

Cada microservicio usa `Dockerfile` multi-stage:

```dockerfile
FROM node:22-alpine AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS build
COPY --from=deps /node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=3001
```

`npm ci --omit=dev` elimina dependencias de desarrollo (Jest, Supertest) de la imagen final, reduciendo la superficie de ataque y el tamano de imagen.

## Variables de Entorno

| Variable | Servicio | Valor | Sensible |
|---------|--------|--------|----------|
| INTERNAL_SECRET | gateway | uuid | Si: solo en runtime |
| FIREBASE_SERVICE_ACCOUNT | auth-ms | path | Si: montada como volumen |
| DATABASE_URL | postgis | postgresql:// | Si: sin log |
| PORT | cada MS | 3001-3007 | No |

El archivo `.env.production` nunca se incluye en el repositorio. Solo se pasa como `--env-file` en `docker compose up`. Las variables sensibles (INTERNAL_SECRET, FIREBASE_SERVICE_ACCOUNT) se marcan con `env_file: .env.secret` y se montan con volumen `tmpfs` para que no persistan en disco.

## EAS Build

Para despliegue movil, `eas.json` configura:

```json
{
  "production": {
    "env": {
      "API_URL": "https://gateway.fococero.app",
      "EXPO_PUBLIC_FIREBASE_API_KEY": "<hidden>"
    }
  }
}
```

Las variables de entorno de Expo se inyectan en build time. `EXPO_PUBLIC_*` es visible en el bundle compilado. Firebase API Key se rota periodicamente.

## Privacidad en Infraestructura

- Los logs de Docker se capturan con `json-file` driver. No se loggean PII
- Los contenedores no comparten `/proc` ni `/sys` del host
- El `ulimit` para `nofile` se establece en 65536 para prevenir DoS por agotamiento de descriptores
- Cada servicio tiene su propia `NETWORK_ADMIN` capability, no comparten permisos de red

## Vulnerabilidades en Infraestructura

- **Puertos expuestos**: solo gateway (3000) es publico. Red interna oculta microservicios
- **Volumenes**: `pg_data` no es accesible desde otros contenedores
- **Secretos**: `INTERNAL_SECRET` se pasa como variable de entorno, nunca en un archivo dentro del contenedor
- **Version de imagenes**: `postgres:15-alpine` se fija a major 15. No `latest`