# Dependencias - FocoCero

Matriz comparativa de dependencias entre frontend (React Native) y backend (Node.js microservicios). Clean Architecture aplicada a la separacion de responsabilidades. Seguridad JWT en cada capa de dependencia.

## Frontend: Runtime vs DevDependencies

```json
{
  "dependencies": [
    "react-native@0.81.5",           "expo@54",
    "expo-router@6",                  "zustand@5",
    "@tanstack/react-query@5",        "axios@1.15",
    "nativewind@4",                   "firebase@12",
    "expo-auth-session",              "expo-secure-store",
    "react-native-maps@1.20",        "expo-location@19",
    "@react-native-async-storage",   "zod@4",
    "react-hook-form",               "react-native-reanimated@4",
    "react-native-gesture-handler",  "react-native-safe-area-context"
  ],
  "devDependencies": [
    "typescript@5.9",                 "@types/react-native",
    "jest",                           "@testing-library/react-native",
    "eslint",                         "prettier"
  ]
}
```

## Backend: Runtime vs DevDependencies

| Categoria | Dependencias | Proposito | Seguridad |
|----------|-------------|-----------|-----------|
| Runtime | `express@4`, `express@5`, `helmet`, `cors`, `express-rate-limit`, `http-proxy-middleware@3` | Gateway, Middleware, Proxying | `helmet` headers, `cors` CORS, `rate-limit` Throttling |
| Runtime | `firebase-admin`, `jsonwebtoken`, `zod@4` | Auth, JWT, Validation | `admin.auth().verifyIdToken()`, `z.object()` |
| Runtime | `pg` (postgres), `redis` (node-redis), `swagger-jsdoc`, `swagger-ui-express` | BD, Cache, Docs | `pg` pool parametrizado, `redis` TTL |
| Dev | `typescript@5.9`, `jest`, `supertest`, `eslint@9`, `prettier` | Lint, Test, Build | `tsconfig.json` strict, `jest --coverage` |

## Version Matrix

| Dependencia | Frontend | Backend (Gateway) | Backend (MS) | Compatibilidad |
|-----------|---------|-----------------|------------|--------------|
| TypeScript | 5.9 strict | 5.9 strict | 5.9 strict | misma config `tsconfig.json` |
| Zod | 4 | 4 | 4 | misma libreria. Esquemas compartidos |
| Jest | latest | latest | latest | misma config de coverage |
| React Query | 5 | - | - | solo frontend |
| Axios | 1.15 | - | - | solo frontend |
| Express | - | 4 | 5 | versiones distintas. Gateway como proxy |
| Firebase Admin | - | SDK 18 | SDK 18 | solo backend |
| pg | - | 8 | 8 | mismo pool |
| redis | - | 4 | 4 | mismo cliente |
| Docker | 24 | 24 | 24 | mismo `docker-compose` |

## Dependencias Transversales

| Dependencia | Ambito | Version | Vulnerabilidad |
|-----------|------|---------|--------------|
| `crypto` | Backend | built-in Node 22 | `timingSafeEqual` |
| `crypto.subtle` | Frontend (Expo) | browser API | AES-256-GCM |
| `zod` | Ambos | 4 | validacion en runtime |
| `firebase` | Frontend (SDK Web 12) / Backend (Admin SDK) | distintas | `idToken` vs `verifyIdToken` |

Ambos lados comparten el mismo esquema Zod para DTOs de autenticacion (`z.object({ email: z.string().email(), password: z.string().min(8) })`). Esto asegura que la validacion en el frontend y en el backend produzca el mismo resultado.

## Principio de Seguridad en Dependencias

- **No `any`**: ninguna dependencia usa `@types/any`. `tsconfig` fuerza `strict: true`
- **No `npm install` sin lock**: `package-lock.json` bloquea versiones. `npm ci` en CI
- **No `devDependencies` en runtime**: `npm prune --production` en contenedor Docker
- **Dependabot**: escanea `package.json` y `package-lock.json` semanalmente
- **Snyk**: integra `snyk test --all-projects` en pipeline CI

## Vulnerabilidades en Dependencias

| Riesgo | Mitigacion |
|-------|-----------|
| Supply chain attack | `npm ci --strict`, `--ignore-scripts` en build |
| Version drift | `resolutions` en `package.json` para mantener compatibilidad |
| Deprecacion | `npm deprecate` notifica en CI |
| CVE | `npm audit` en cada PR (se ejecuta `--audit-level=critical`) |

## Clean Architecture en Dependencias

Cada capa solo importa lo que necesita:

- **Capa de dominio**: `zod` + `typescript` (puro). No `express`, `axios`, `firebase`
- **Capa de aplicacion**: `express` + `zod` + `firebase` + `pg`
- **Capa de infraestructura**: `redis`, `docker`, `swagger`

La capa de dominio nunca conoce `express` ni `axios`. Solo la capa de infraestructura depende de `http-proxy-middleware` y `express-rate-limit`.

## Privacidad en Dependencias

`expo-secure-store` y `expo-auth-session` son las unicas dependencias que manejan datos sensibles (tokens, sesiones). No se usan en el backend. `jsonwebtoken` solo se usa en el backend para decodificar `idToken`. No se usa `jsonwebtoken.sign()` en ningun lado: Firebase Admin SDK emite y verifica los tokens.