# Filosofia de Diseno

## Vision

FocoCero es una herramienta tactica para la gestion de incendios forestales. Su interfaz debe ser util incluso cuando el usuario esta bajo estres, con conectividad limitada y en condiciones ambientales adversas. Cada decision de diseno prioriza la claridad, la velocidad de comprension y la confiabilidad de la informacion.

## Principios fundamentales

### 1. Offline-first por diseno

La conectividad en zonas de incendio es intermitente o inexistente. Toda la aplicacion se disena para operar sin red.

- Las mutaciones (reportes, cambios de estado) se persisten localmente en una outbox
- Los datos se leen de cache local (L1: memoria, L2: AsyncStorage) antes de consultar el servidor
- El estado de sincronizacion es visible en la UI: pendiente, enviando, confirmado, fallido
- El JWT se renueva en background usando refresh token almacenado en SecureStore
- La cola de salida (outbox) se protege con checksum para detectar corruption de datos en almacenamiento local

Seguridad: Los datos offline se cifran en reposo usando expo-secure-store para tokens y AES-GCM para datos de la outbox. Cualquier fallo de integridad en la outbox invalida la operacion y notifica al usuario.

### 2. Tactical grade

La interfaz esta disenada para ser operada en condiciones de alta presion.

- Alto contraste en todos los modos (oscuro y claro)
- Informacion presentada en orden jerarquico: lo critico primero
- Gestos minimos y predecibles: tap como accion principal, long-press para acciones secundarias
- Feedback inmediato ante cada accion (visual, tactil, y cuando corresponde, sonoro)
- Los errores se muestran con lenguaje claro y accionable, no codigos tecnicos

### 3. Mobile-first con una mano

Optimizado para operacion con una mano en dispositivos moviles.

- Zona de interaccion primaria en el tercio inferior de la pantalla
- Touch targets de al menos 44x44px (excediendo el minimo WCAG de 44px)
- Tab bar accesible sin estirar el pulgar
- Keyboard avoidance nativa en formularios para evitar que el teclado oculte campos activos

### 4. Role-based experience (RBAC)

Cada rol ve una aplicacion diferente sin compartir codigo de pantalla entre roles.

- `(auth)`: Grupo publico para login, registro, recuperacion de contrasena
- `(ciudadano)`: Reportar incendios, ver alertas, perfil personal
- `(brigadista)`: Dashboard tactico, mapa de incidentes, reportes detallados, emergencias activas
- `(admin)`: Dashboard de metricas, mapa general, gestion de usuarios, configuracion del sistema

Los guards de navegacion verifican el JWT decodificado en cada transicion de ruta. Si el rol no corresponde, se redirige a `(auth)/login` y se revoca la sesion local.

### 5. Clean Architecture en la capa UI

La UI se organiza siguiendo principios de Clean Architecture para mantener el desacoplamiento.

- **Presentacion**: Componentes puros, sin logica de negocio. Reciben props y emiten eventos.
- **Estado**: Hooks personalizados que gestionan estado local y remoto (React Query + Zustand).
- **Casos de uso**: Funciones puras inyectadas desde la capa de dominio, nunca importadas directamente desde la UI.
- **Repositorios**: Implementaciones abstractas intercambiables (API REST, cache local, mock para tests).
- **Inyeccion de dependencias**: Servicios inyectados via contexto de React, facilitando testing y sustitucion.

### 6. DevOps y calidad

- Los componentes se documentan con Storybook para React Native
- Cada componente tiene tests unitarios (Jest + React Native Testing Library)
- Los cambios al sistema de diseno requieren aprobacion del equipo de diseno antes de mergear
- Las vulnerabilidades en dependencias se escanean en cada PR mediante `npm audit` y `expo-cli doctor`
- El bundle final se analiza con `expo-analyzer` para detectar fugas de tokens o secrets

### 7. Privacidad por omision

- Geolocalizacion solo con permiso explicito y cuando la app esta en foreground
- Datos de telemetria anonimizados, sin correlacion con identidad del usuario
- Los reportes publicos de incendio no exponen la identidad del reportante
- Los tokens JWT expiran en 15 minutos; refresh token en 7 dias con rotacion
- El payload del JWT contiene solo `sub`, `rol`, `iat`, `exp` — sin PII
