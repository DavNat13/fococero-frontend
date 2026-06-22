# Stack Frontend - FocoCero

Sistema de monitoreo y gestion de incendios forestales. Frontend movil con React Native y Expo, construido bajo principios de Clean Architecture, seguridad JWT y privacidad por diseno.

## Nucleo y Framework

| Componente | Version | Proposito |
|-----------|---------|-----------|
| React Native | 0.81.5 | Runtime nativo para iOS/Android |
| Expo SDK | 54 | Entorno administrado con EAS Build |
| TypeScript | 5.9 (strict) | Tipado estricto, previene vulnerabilidades en tiempo de compilacion |
| Expo Router | 6 | Enrutamiento basado en archivos con guards RBAC |

La configuracion `strict` de TypeScript 5.9 fuerza la declaracion explicita de tipos, eliminando `any` implicitos que expondrian vulnerabilidades de tipo en tiempo de ejecucion.

## Estado y Datos

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Zustand | 5 | Estado global ligero. Cada store sigue el patron de slices con actions puras |
| TanStack React Query | 5 | Estado de servidor con cache, stale-while-revalidate. Soporta invalidacion por mutacion |
| Axios | 1.15 | Cliente HTTP con interceptors para JWT y patron Result |
| @react-native-async-storage/async-storage | - | Almacenamiento offline para cache |
| expo-secure-store | - | Almacenamiento seguro de tokens JWT con cifrado nativo (Keychain/Keystore) |

Axios implementa el patron `Result` para envolver respuestas HTTP en tipos `Ok<T>` o `Err<E>`, forzando al consumidor a manejar errores explícitamente y eliminando `try/catch` silenciosos que ocultan vulnerabilidades.

## UI y Estilos

| Componente | Version | Proposito |
|-----------|---------|-----------|
| NativeWind | 4 | Tailwind CSS para React Native. Compilacion estatica sin runtime CSS |
| react-native-reanimated | 4 | Animaciones en el hilo de UI, no en JS. Previene frame drops |
| react-native-gesture-handler | - | Gestos nativos. Manejo tactil preciso para mapas interactivos |

## Mapas y Geolocalizacion

| Componente | Version | Proposito |
|-----------|---------|-----------|
| react-native-maps | 1.20 | Mapas nativos con integracion PostGIS (datos espaciales desde backend) |
| expo-location | 19 | Geolocalizacion con permisos granulares. Privacidad: solo foreground |

La integracion con PostGIS permite consultar geometrias (incendios, puntos de interes) directamente desde la capa de presentacion, con validacion Zod en el gateway para prevenir inyeccion espacial.

## Autenticacion y Seguridad

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Firebase Web SDK | 12 | Autenticacion federada (Google, email). Emision de JWTs desde el cliente |
| expo-auth-session | - | Flujo OAuth 2.0 con PKCE. Privacidad: sin tokens en Storage de terceros |
| expo-secure-store | - | Almacenamiento de refresh token en SecureStore (cifrado AES-256-GCM) |
| Expo Router Guards | - | Middleware de ruta que verifica `idToken` antes de renderizar |

El flujo JWT sigue RFC 7519: Firebase emite `idToken` y `accessToken`. El frontend almacena solo `accessToken` en SecureStore. El backend verifica con `admin.auth().verifyIdToken()`. SecureStore garantiza que el token no persiste en memoria compartida ni en backups no cifrados.

## Formularios y Validacion

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Zod | 4 | Esquemas de validacion en runtime. Previene datos malformados en frontera |
| react-hook-form | - | Formularios performantes con resolvers Zod |
| @hookform/resolvers | - | Bridge entre react-hook-form y Zod. Validacion tipada |

Zod actua como primera barrera de seguridad: cualquier payload que ingresa por un formulario pasa por esquema Zod antes de llegar al estado global. Esto previene inyeccion XSS y datos malformados.

## Testing

| Componente | Version | Proposito |
|-----------|---------|-----------|
| Jest | - | Framework de testing con reporteria de covertura |
| @testing-library/react-native | - | Pruebas de componentes con acceso a estado y navegacion |

El pipeline de testing exige `coverageThreshold` de 60% en ramas, 70% en funciones. Cualquier PR que no alcance el umbral falla en CI.

## Arquitectura limpia en Frontend

La pirámide de capas sigue:

1. **Capa de presentacion** (Componentes Expo Router + NativeWind)
2. **Capa de estado** (Zustand + TanStack Query)
3. **Capa de dominio** (Servicios puros con validacion Zod)
4. **Capa de infraestructura** (Axios con interceptors JWT, Firebase SDK)

Las dependencias fluyen hacia adentro: la capa de dominio nunca conoce Axios ni Firebase. Solo la capa de infraestructura inyecta el cliente HTTP.

## Privacidad por diseno

- Geolocalizacion solo en foreground con permiso `requestForegroundPermissionsAsync`
- SecureStore no comparte tokens entre apps del mismo equipo
- Cache offline (AsyncStorage) se limpia al cerrar sesion
- `expo-secure-store` no permite lectura sin autenticacion biometrica en dispositivos compatibles