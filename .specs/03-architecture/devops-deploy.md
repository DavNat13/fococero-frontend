# DevOps y Despliegue

## Orquestacion: Docker Compose

Todos los servicios se despliegan via `docker-compose.yml` con 11 servicios en total.

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    container_name: fococero-postgres
    environment:
      POSTGRES_MULTIPLE_DATABASES: auth_db,geo_db,alertas_db,reportes_db,multimedia_db,emergencias_db,analitica_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init-dbs.sh:/docker-entrypoint-initdb.d/init-dbs.sh
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - fococero-net

  redis:
    image: redis:7-alpine
    container_name: fococero-redis
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - fococero-net

  eureka-server:
    image: steeltoeoss/eureka-server:latest
    container_name: fococero-eureka
    ports:
      - "8761:8761"
    networks:
      - fococero-net

  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    container_name: fococero-gateway
    ports:
      - "3000:3000"
    depends_on:
      eureka-server: { condition: service_healthy }
    environment:
      INTERNAL_TOKEN_SECRET: ${INTERNAL_TOKEN_SECRET}
      FIREBASE_SERVICE_ACCOUNT_KEY: ${FIREBASE_SERVICE_ACCOUNT_KEY}
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode===200?0:1))"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - fococero-net

  # Similar para ms-auth, ms-geo, ms-alertas, ms-reportes,
  # ms-multimedia, ms-emergencias, ms-analitica
  # Cada uno con: build, depends_on (postgres, eureka-server),
  # environment (DB_*), healthcheck, networks

networks:
  fococero-net:
    driver: bridge

volumes:
  pgdata:
```

## Multi-Stage Builds

Cada microservicio utiliza Docker multi-stage para minimizar el tamano de la imagen.

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts
RUN cp -r node_modules /tmp/node_modules

# Stage 2: Runtime
FROM node:22-alpine AS runtime
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY . .
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
CMD ["node", "src/index.js"]
```

Tamano final de imagen: ~180MB (base Alpine 22) + codigo de la app.

## Health Checks

Todos los servicios exponen `GET /health` que retorna `{ status: 'ok', timestamp, uptime, db: 'connected' }`.

El health check de Docker verifica que el servicio responda correctamente antes de marcarlo como healthy.

## CI/CD: GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build
      - run: docker compose push
      - run: ssh deploy@server "docker compose pull && docker compose up -d"
```

## EAS Build (Frontend)

El frontend React Native se despliega via EAS Build:

```json
{
  "expo": {
    "name": "FocoCero",
    "slug": "fococero",
    "version": "1.0.0",
    "plugins": [
      "expo-secure-store",
      "expo-location",
      "expo-camera"
    ]
  }
}
```

- **EAS Update**: Over-the-air updates para cambios de JS.
- **EAS Submit**: Publicacion automatica a App Store / Google Play.

## Gestion de Variables de Entorno

- `.env` local para desarrollo (no versionado).
- GitHub Actions Secrets para CI/CD.
- Vault / AWS Secrets Manager para produccion (futuro).

Cada servicio define sus variables en archivo `.env.<service>`:

```
.env.api-gateway   -> PORT, INTERNAL_TOKEN_SECRET, FIREBASE_SERVICE_ACCOUNT_KEY
.env.ms-auth       -> PORT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
```

## Red y Puertos

- Red interna `fococero-net` (bridge) para comunicacion entre contenedores.
- Puertos expuestos al host solo para servicios que requieren acceso externo:
  - `:3000` (API Gateway)
  - `:8761` (Eureka - solo dev)
  - `:5432` (PostgreSQL - solo dev, con bind a 127.0.0.1)
- En produccion, solo el API Gateway se expone al exterior (detras de nginx/reverse proxy).

## Vulnerabilidades en DevOps

- **Imagenes base desactualizadas**: Escaneo semanal con `docker scout` para vulnerabilidades en node:22-alpine.
- **Secrets expuestos**: .env en .gitignore. Secrets de CI/CD rotados cada 90 dias.
- **Container escape**: Contenedores corren como usuario no root (`USER node` en Dockerfile).
- **Network sniffing**: Red interna Docker aislada. TLS para comunicacion externa.
