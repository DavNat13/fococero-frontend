# Fase 5: Estandarizacion

> Arquitectura hexagonal formalizada, plantilla de microservicio, 18 estandares de codigo documentados y pipeline CI automatizado.

---

## ms-template: arquetipo hexagonal

Se creo `services/ms-template/` como plantilla oficial para nuevos microservicios. Sigue **arquitectura hexagonal** (puertos y adaptadores) con cuatro capas:

```
ms-template/
├── src/
│   ├── controllers/     # Adaptadores de entrada (HTTP handlers)
│   ├── services/        # Casos de uso / logica de negocio
│   ├── repositories/    # Adaptadores de salida (base de datos)
│   └── models/          # Entidades de dominio (TypeScript types/interfaces)
├── db/
│   └── init/
│       ├── 001-init.sql
│       └── 002-seed.sql
├── tests/
├── .env.example
├── Dockerfile
├── tsconfig.json
└── package.json
```

**Principios**:
- Controllers no contienen logica de negocio, solo validacion de input y formato de respuesta
- Services implementan casos de uso puros, sin dependencias de infraestructura
- Repositories encapsulan consultas SQL con pg driver, devuelven modelos tipados
- Models son interfaces TypeScript que reflejan el dominio, no la base de datos

## 18 code standards documentados

En el directorio `.specs/skills/` se documentaron 18 estandares de codigo que cubren:

| Skill              | Descripcion                                    |
| ------------------ | ---------------------------------------------- |
| 01-typescript      | Reglas strictas de TypeScript                  |
| 02-eslint          | Flat Config con reglas de calidad              |
| 03-prettier        | Formateo consistente                           |
| 04-express         | Patrones de rutas y middlewares                |
| 05-pg-pool         | Conexion segura a PostgreSQL                   |
| 06-eureka          | Cliente de service discovery                   |
| 07-logger          | Logging estructurado (pino o winston)          |
| 08-env             | Variables de entorno tipadas                   |
| 09-errors          | Manejo de errores consistente                  |
| 10-http            | Responses HTTP estandarizadas                  |
| 11-auth            | Integracion con Firebase Auth                  |
| 12-middlewares      | Middlewares de seguridad y validacion          |
| 13-testing         | Configuracion de tests (vitest/jest)           |
| 14-docker          | Dockerfile multi-stage optimizado              |
| 15-ci              | Pipeline GitHub Actions                        |
| 16-git             | Convenciones de commits y branching            |
| 17-docs            | Documentacion de endpoints y arquitectura      |
| 18-seguridad       | Checklist de seguridad OWASP Top 10            |

## Arquitectura documentada

Se genero documentacion tecnica que incluye:

- Diagrama de arquitectura general (servicios, bases de datos, gateway, Eureka)
- Flujo de autenticacion (Firebase -> Gateway -> JWT -> Microservicio)
- Flujo de despacho de emergencias (correlation_id, retry, estados)
- Patrones de diseno implementados: idempotencia, graceful shutdown, cache-aside

## GitHub Actions CI

El pipeline de integracion continua ejecuta en cada push a `main` y `develop`:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx eslint services/*/src --max-warnings 0

  build:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build --workspaces
```

**Proximas mejoras planificadas**: agregar tests automatizados, docker build y push a registry, deploy a entorno staging.

## Seguridad en el codigo

Los estandares incluyen reglas explicitas para prevenir vulnerabilidades:

- Prohibicion de `child_process.exec()` sin sanitizacion
- Prohibicion de `eval()` y `Function()`
- Uso obligatorio de `helmet()` en Express
- Validacion de schemas de entrada (zod o joi) en todos los endpoints
- Logging sin datos sensibles (nunca contrasenas ni tokens en logs)
- Variables de entorno con valores por defecto seguros

## Vulnerabilidades mitigadas

| Vulnerabilidad               | Mitigacion                                   |
| ---------------------------- | -------------------------------------------- |
| Inyeccion de comandos        | Prohibicion de exec() sin sanitizacion       |
| Injection de prototipos      | TypeScript strict + validacion de schemas    |
| Errores de lint en produccion| CI bloquea con --max-warnings 0              |
| Malas practicas de equipo    | 18 skills documentados y aplicados           |
| Despliegues inconsistentes   | Docker multi-stage + plantilla estandar      |
