# DevOps - FocoCero

Pipelines CI/CD para sistema de incendios forestales. Seguridad JWT en cada etapa de integracion. Clean Architecture aplicada a la automatizacion de builds.

## CI/CD con GitHub Actions

El pipeline principal se ejecuta en `main` y `develop`. Cada PR pasa por:

```
1. Lint (ESLint + Prettier)
2. Test (Jest + Supertest + covertura 60%)
3. Build (Docker multi-stage)
4. Security Scan (trivy, npm audit)
```

### Workflow: CI Pipeline

```yaml
name: CI
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: ESLint
        run: npx eslint --config eslint.config.mjs
      - name: Prettier
        run: npx prettier --check .
```

El linter ejecuta `eslint.config.mjs` plano (flat config). `prettier --check` previene commits con formato inconsistente que expondrian vulnerabilidades de legibilidad en JWT.

### Workflow: Testing Pipeline

```yaml
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx jest --coverage --ci
        env:
          JEST_COVERAGE: 60
```

El pipeline exige `coverageThreshold`:

```json
{
  "global": {
    "branches": 60,
    "functions": 70,
    "lines": 75,
    "statements": 75
  }
}
```

Cualquier PR que no alcance el umbral falla con `--coverage`. `npm ci` instala desde `package-lock.json` con `--strict` para prevenir `supply chain` attacks en dependencias.

### Workflow: Docker Build and Push

```yaml
  build:
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t fococero/api-gateway .
      - run: docker push ghcr.io/fococero/api-gateway:${{ github.sha }}
```

Multi-stage build siempre usa `node:22-alpine` como base y `npm ci --omit=dev` en la etapa de instalacion. El tag `${{ github.sha }}` asegura trazabilidad entre commit e imagen.

### Workflow: EAS Build (Mobile)

```yaml
  deploy-mobile:
    needs: [lint, test]
    steps:
      - uses: expo/expo-github-action@v8
      - run: npx eas build --platform all --profile production
```

`eas build` usa `eas.json` con credenciales de Expo Application Services. Las variables de entorno se pasan con `--env`.

## Conventional Commits

Cada mensaje de commit sigue:

```
type(scope): description

tipos: feat, fix, refactor, perf, security, docs
```

Ejemplo:

```
feat(auth-ms): agregar middleware verifyIdToken para JWT
security(gateway): implementar rate limiting en /auth/*
```

El tipo `security` activa un escaneo adicional con `npm audit --audit-level=high` en el hook `pre-commit`.

## GitFlow

Las ramas siguen el modelo:

- `main` -> produccion. Solo `fix` y `security` commits
- `develop` -> integracion. `feat` commits
- `feature/*` -> nuevas funcionalidades. PR a develop
- `hotfix/*` -> correcciones urgentes. PR directo a main

`develop` nunca recibe un commit directo. Solo PRs con `squash merge` para mantener el historio lineal.

## Seguridad en DevOps

- **Secrets**: `FIREBASE_SERVICE_ACCOUNT` se almacena en `GitHub Secrets`. Nunca en `env` del workflow
- **Audit**: `npm audit` en cada PR detecta dependencias con CVEs conocidos
- **Snyk**: escaneo de imagenes Docker para vulnerabilidades en paquetes del SO
- **Trivy**: escaneo de `node:22-alpine` por capa de imagen. `CRITICAL` y `HIGH` bloquean el push
- **Dependabot**: `dependabot.yml` configura actualizaciones semanales con `target-branch: develop`

## Privacidad en CI/CD

- Los logs de GitHub Actions no exponen `npm install` output si `NODE_ENV=production`
- `jest --coverage` nunca publica reportes de covertura en repositorios publicos
- `trivy` escanea solo imagenes finales. No las `build` temporales

## Clean Architecture en DevOps

Los pipelines respetan:

- **Capa de infraestructura**: Docker, Kubernetes, GitHub Actions
- **Capa de aplicacion**: scripts de build, lint, test
- **Capa de dominio**: nunca toca el codigo del microservicio

La capa de infraestructura (CI/CD) no conoce la capa de dominio (logica de negocio). Solo la capa de aplicacion (scripts YAML) interactua con el codigo.