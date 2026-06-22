# Sistema de Diseno UI/UX — FocoCero

> Sistema de diseno tactico para la gestion de incendios forestales. Aplicacion mobile-first construida con React Native + Expo, orientada a roles ciudadano, brigadista y administrador.

## Proposito

Este directorio documenta el sistema de diseno visual, de interaccion y de experiencia de usuario del proyecto FocoCero. Cada archivo describe un aspecto atomico del sistema: color, tipografia, iconografia, layout, componentes, navegacion, animaciones, estados, formularios, offline-first, pantallas, notificaciones, tarjetas, accesibilidad y version historica.

## Principios rectores

| Principio | Descripcion |
|-----------|-------------|
| Offline-first | Toda interaccion debe funcionar sin conectividad. Outbox pattern, almacenamiento L1/L2, sincronizacion asincrona |
| Tactical grade | Interfaz disenada para estres cognitivo bajo en situaciones de emergencia. Alto contraste, gestos minimos, informacion priorizada |
| Mobile-first | Optimizado para dispositivos moviles con una mano. Touch targets > 44px, navegacion con pulgar, teclado evadido |
| Role-based | Cada rol (ciudadano, brigadista, admin) ve solo lo que necesita. Expo Router groups con guards RBAC |
| Accesible | WCAG AA como minimo. Contraste 4.5:1, soporte para lectores de pantalla, reduccion de movimiento |

## Stack tecnico

- React Native 0.76+ / Expo SDK 52+
- TypeScript estricto
- react-native-reanimated 4 para animaciones
- lucide-react-native para iconografia
- expo-router para navegacion basada en archivos
- react-hook-form + Zod 4 para formularios
- expo-secure-store para JWT y datos sensibles
- expo-notifications para push notifications

## Arquitectura de seguridad

- JWT almacenado exclusivamente en SecureStore (no AsyncStorage)
- Tokens de acceso con expiracion corta (15 min) + refresh token (7 dias)
- Toda comunicacion HTTPS con certificate pinning via expo-network
- Principios de Clean Architecture: UI desacoplada del dominio, casos de uso inyectados, repositorios abstractos
- Las claves de API y secrets se gestionan via `app.config.ts` con variables de entorno, nunca en el bundle

## Privacidad y compliance

- Geolocalizacion solo cuando la app esta en primer plano (permiso `whenInUse`)
- Datos de usuario minimos: solo los requeridos para la operacion (nombre, email, rol)
- Los reportes de incendio no incluyen datos personales del reportante en el payload publico
- Los tokens JWT no contienen informacion de identificacion personal (PII) en el payload

## Prioridad de implementacion

1. **UI-1**: Tema oscuro, paleta, tipografia, botones, inputs, Avatar, Badge, Card (completado)
2. **UI-2**: Pantallas de autenticacion y perfil, formularios controlados, validacion Zod (completado)
3. **UI-3**: Navegacion por roles, guards, tab bars, deep linking
4. **UI-4**: Moleculas (BottomSheet, Toast, AlertBanner, SearchBar, EmptyState, StepIndicator)
5. **UI-5**: Offline-first UI, sincronizacion, cola de pendientes, indicador de conectividad
6. **UI-6**: Notificaciones push, canales por region, manejo de estados de dispatch
7. **UI-7**: Animaciones, micro-interacciones, skeleton loading, pull-to-refresh

## DevOps y mantenibilidad

- Los tokens de diseno se centralizan en `global.css` como variables CSS
- Pruebas visuales con Storybook para React Native en una rama separada
- Los cambios al sistema de diseno se documentan en `historial-versiones.md`
- Vulnerabilidades en dependencias se auditan con `npx expo-cli doctor` y `npm audit` en CI

## Referencias

- [Filosofia de diseno](filosofia-diseno.md)
- [Paleta de colores](paleta-colores.md)
- [Tipografia](tipografia.md)
- [Iconografia](iconografia.md)
- [Layout y grid](layout-grid.md)
- [Componentes](componentes.md)
- [Navegacion](navegacion.md)
- [Animaciones](animaciones.md)
- [Tarjetas](tarjetas.md)
- [Notificaciones](notificaciones.md)
- [Estados](estados.md)
- [Formularios](formularios.md)
- [Offline-first UI](offline-first-ui.md)
- [Pantallas](pantallas.md)
- [Historial de versiones](historial-versiones.md)
- [Accesibilidad](accesibilidad.md)
