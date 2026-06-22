# Vulnerabilidades y Cobertura OWASP Top 10

## Proposito

Documentar la postura de seguridad del sistema FocoCero frente al OWASP Top 10 (2021), detallando las mitigaciones implementadas en cada capa de la arquitectura.

## A01: Broken Access Control

**Riesgo**: Un usuario accede a recursos o acciones para los que no tiene permisos.

**Mitigaciones**:
- RBAC con cuatro roles (`INVITADO`, `USUARIO`, `BRIGADISTA`, `ADMIN`) verificado en dos capas:
  - API Gateway: middleware `authorizeRole()` despues de `verifyIdToken()`.
  - Microservicio: middleware `InternalAuthMiddleware()` valida rol del token interno.
- Cada microservicio aplica verificacion de pertenencia (un ciudadano solo ve sus propios reportes).
- Las rutas de administracion (`/emergencias`, `/admin/*`) requieren rol ADMIN explicitamente.

**Estado**: Cubierto.

## A02: Cryptographic Failures

**Riesgo**: Exposicion de datos sensibles por cifrado debil o ausente.

**Mitigaciones**:
- JWT de Firebase usa RS256 (RSA 2048 bits). No se implementa JWT manualmente.
- Token interno usa HMAC-SHA256 con secreto de 256 bits rotable.
- HTTPS obligatorio para toda comunicacion externa.
- SecureStore para tokens en cliente (iOS Keychain / Android EncryptedSharedPreferences).
- Ningun dato personal se almacena sin cifrar en el dispositivo.

**Estado**: Cubierto.

## A03: Injection (SQL, NoSQL, OS)

**Riesgo**: Inyeccion de codigo malicioso via inputs no validados.

**Mitigaciones**:
- **SQL Injection**: 100% de las queries a PostgreSQL usan parametros posicionales (`$1, $2, ...`). Sin concatenacion de strings SQL.
- **Input validation**: Zod valida toda entrada (body, query params, URL params) antes de llegar a cualquier servicio o repositorio.
- **No eval()**: No se utiliza `eval()`, `setTimeout(string)` o `Function()` en el backend.
- **MIME validation**: En ms-multimedia, los archivos subidos se validan por tipo MIME real (no solo extension).

**Estado**: Cubierto.

## A04: Insecure Design

**Riesgo**: Deficiencias en el diseno arquitectonico que permiten ataques.

**Mitigaciones**:
- Clean Architecture: separacion estricta de capas impide que logica de negocio acceda directamente a la red o DB.
- Offline-first con Outbox pattern: las operaciones offline se sincronizan con idempotency keys para evitar duplicados.
- Rate limiting en Gateway: 5 requests/min en auth, 100/min general.
- Limite de conexiones DB (pool max 20) para evitar agotamiento de recursos.

**Estado**: Cubierto (mejora continua en threat modeling).

## A05: Security Misconfiguration

**Riesgo**: Configuraciones por defecto inseguras, headers ausentes, errores informativos.

**Mitigaciones**:
- Helmet activo con CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
- CORS con whitelist de origenes explicitos.
- Sin versionado de API publico (`/v1/`) que pueda exponer endpoints legacy.
- Headers de error sin stack traces en produccion (error handler personalizado).
- Contenedores Docker sin `--privileged`, usuario no root.

**Estado**: Cubierto.

## A06: Vulnerable and Outdated Components

**Riesgo**: Dependencias con vulnerabilidades conocidas.

**Mitigaciones**:
- `npm audit` ejecutado en CI/CD. Build falla si hay vulnerabilidades criticas.
- `node:22-alpine` actualizado semanalmente con `docker scout`.
- Dependencias minimizadas: solo las necesarias, sin librerias no utilizadas.
- Renovacion periodica de dependencias via Dependabot (GitHub).

**Estado**: Cubierto (proceso continuo).

## A07: Identification and Authentication Failures

**Riesgo**: Fallos en la autenticacion que permiten suplantacion.

**Mitigaciones**:
- Firebase Auth gestiona la identidad: `verifyIdToken()` verifica firma RS256, expiracion y audiencia.
- Custom claims para roles, evitando que el cliente pueda modificar su rol.
- Rate limiting en login (5 intentos/min) previene brute force.
- SecureStore para JWT en cliente, no AsyncStorage.
- Token interno con TTL de 60s para limitar ventana de reuso.

**Estado**: Cubierto.

## A08: Software and Data Integrity Failures

**Riesgo**: Modificacion no autorizada de software o datos en transito.

**Mitigaciones**:
- CI/CD con GitHub Actions: los artefactos se construyen desde el repositorio, no desde binarios externos.
- Multi-stage builds: solo codigo compilado en la imagen final.
- Idempotency keys en operaciones de escritura: el servidor detecta y rechaza requests duplicados.
- Firma HMAC del token interno para evitar suplantacion entre servicios.

**Estado**: Cubierto.

## A09: Security Logging and Monitoring Failures

**Riesgo**: Incapacidad de detectar y responder a incidentes.

**Mitigaciones**:
- `traceId` (UUIDv4) en cada request, propagado a traves de todos los microservicios via headers HTTP.
- Logs estructurados (JSON) con nivel configurable (info, warn, error).
- Los logs de autenticacion (login, logout, token refresh) se registran con nivel INFO.
- Los errores de validacion y autorizacion se registran con nivel WARN.
- Health checks en todos los servicios para monitoreo de disponibilidad.

**Estado**: Cubierto (pendiente integracion con SIEM centralizado).

## A10: Server-Side Request Forgery (SSRF)

**Riesgo**: Un atacante fuerza al servidor a hacer requests a destinos internos no previstos.

**Mitigaciones**:
- El Gateway solo realiza proxy a servicios registrados en Eureka, no a URLs arbitrarias.
- Las URLs de servicios se resuelven via Eureka, no por parametros del cliente.
- No hay funcionalidad de "fetch a URL externa" en ningun microservicio.
- La red Docker interna esta aislada (bridge), no accesible desde el exterior.

**Estado**: Cubierto.

## Vulnerabilidades No Cubiertas (Pendientes)

| Vulnerabilidad | Estado | Plan |
|---|---|---|
| API Rate limiting por usuario | Parcial | Implementar rate-limit por uid en Redis |
| Webhook signature verification | No aplica | No hay webhooks externos |
| Supply chain attacks (dependencias) | Monitoreo | Dependabot + npm audit |
| Docker image scanning | CI | Integrar Trivy en CI/CD |
| Secrets rotation automatica | Manual | Implementar HashiCorp Vault |
