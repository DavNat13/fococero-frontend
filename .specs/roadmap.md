// .specs/roadmap.md
# Hoja de Ruta y Hitos - FocoCero Frontend

---

# PARTE 1: INTEGRACIÓN DE APIS (Completado ✅)

## Fase 1: Fundamentos Críticos
- [x] **1.1:** Eliminar el prefijo `/v1/` de `auth.api.ts` y `usuario.api.ts`.
- [x] **1.2:** Implementar interceptor en `api.interceptors.ts` para inyectar el Token de Firebase.
- [x] **1.3:** Validar flujo Login/Registro end-to-end contra el Gateway.

## Fase 2: Alertas (API)
- [x] **2.1:** Crear `alertas.api.ts` y hooks (`useAlertas`).
- [x] **2.2:** Zustand store para Alertas.

## Fase 3: Reportes (API)
- [x] **3.1:** Crear `reportes.api.ts` y hooks (`useReportes`).
- [x] **3.2:** Zustand store para Reportes.

## Fase 4: Geo-Espacial (API)
- [x] **4.1:** Crear `geo.api.ts`.

## Fase 5: Emergencias (API)
- [x] **5.1:** Crear `emergencias.api.ts`.

## Fase 6: Analítica (API)
- [x] **6.1:** Crear `analitica.api.ts`.

## Fase 7: Multimedia (API)
- [x] **7.1:** Crear `multimedia.api.ts`.

---

# PARTE 2: INTERFAZ DE USUARIO (UI/UX) - EN PROGRESO 🔄

## Prioridades por Microservicio y Rol

| Prioridad | MS | Componente UI | Roles Permitidos |
|-----------|-----|---------------|-------------------|
| 🔴 **1** | Auth + Usuario | Login, Register, Perfil, Config | Público / Todos |
| 🔴 **2** | Alertas | Lista, Crear, Detalle, Cambiar estado | Todos / Brigadista / Admin |
| 🔴 **3** | Reportes | Formulario, Lista, Historial | Todos / Brigadista / Admin |
| 🟠 **4** | Geo (Mapa) | Mapa interactivo, Capas, Focos | Todos / Brigadista / Admin |
| 🟡 **5** | Emergencias | Tracking despachos, Coordinación | Brigadista / Admin |
| 🟢 **6** | Analítica | Dashboard, Gráficos, Exportar | Brigadista / Admin |
| 🟢 **7** | Multimedia | Upload evidencias, Galería | Todos |

## Sistema de Roles (RBAC)

| Feature | Ciudadano | Brigadista | Admin |
|---------|-----------|------------|-------|
| **Auth** | ✅ Login/Register | ✅ Login | ✅ Login |
| **Alertas** | 👁️ Ver | ✅ Cambiar estado | ✅ CRUD completo |
| **Reportes** | ✅ Crear | ✅ Cambiar estado | ✅ CRUD completo |
| **Mapa** | 👁️ Ver | ✅ Gestionar focos | ✅ CRUD completo |
| **Despachos** | ❌ | ✅ Crear/Seguir | ✅ CRUD completo |
| **Dashboard** | ❌ | 👁️ Ver | ✅ CRUD + Exportar |
| **Usuarios** | ❌ | ❌ | ✅ CRUD completo |
| **Configuración** | 👁️ Propia | 👁️ Propia | ✅ Global |

---

## FASE UI-1: CORE VISUAL (Semana 1) 🎨

### Objetivo
Establecer la base visual profesional de la aplicación.

### Tareas
- [ ] **UI-1.1:** Mejorar paleta de colores profesional (tema claro/oscuro)
- [ ] **UI-1.2:** Optimizar tipografía (Inter + Roboto)
- [ ] **UI-1.3:** Crear componentes base mejorados (Button, Input, Card, Badge)
- [ ] **UI-1.4:** Implementar sistema de navegación (Tab Bar) por rol
- [ ] **UI-1.5:** Crear scaffold de pantallas por rol (Ciudadano, Brigadista, Admin)
- [ ] **UI-1.6:** Animaciones profesionales para navegación

### Dimensiones Estándar
- **Buttons:** Min height 48px, padding 16px horizontal
- **Inputs:** Min height 48px, border-radius 12px
- **Cards:** Border-radius 16px, padding 16px
- **Spacing:** Múltiplos de 4px (4, 8, 12, 16, 24, 32, 48)

---

## FASE UI-2: AUTH + PERFIL + CONFIG (Semana 2) 👤

### Objetivo
Pantallas de autenticación, perfil de usuario y configuración.

### Tareas
- [ ] **UI-2.1:** Mejorar pantalla Login (diseño profesional)
- [ ] **UI-2.2:** Mejorar pantalla Register (diseño profesional)
- [ ] **UI-2.3:** Crear pantalla de Perfil de usuario estructurada
- [ ] **UI-2.4:** Crear editor de perfil
- [ ] **UI-2.5:** Crear pantalla de Configuración completa
- [ ] **UI-2.6:** Implementar cambio de tema (Claro/Oscuro/Sistema)

### Estructura Perfil
```
├── Avatar + Nombre + Rol
├── Stats rápidos (reportes, alertas)
├── Historial de actividad
├── Editar datos
└── Cerrar sesión
```

### Estructura Configuración
```
├── Cuenta
│   ├── Perfil
│   └── Cambiar contraseña
├── Preferencias
│   ├── Tema (Claro/Oscuro)
│   ├── Notificaciones
│   └── Ubicación
├── Acerca de
│   ├── Versión
│   └── Soporte
```

---

## FASE UI-3: ALERTAS + REPORTES (Semana 3) 📋

### Objetivo
Interfaces completas para gestión de alertas y reportes.

### Tareas - Alertas
- [ ] **UI-3.1:** Lista de alertas con filtros (estado, fecha, ubicación)
- [ ] **UI-3.2:** Formulario crear alerta con ubicación en mapa
- [ ] **UI-3.3:** Detalle de alerta con timeline de estados
- [ ] **UI-3.4:** Cambio de estado (Brigadista/Admin)
- [ ] **UI-3.5:** Alertas inteligentes por región

### Tareas - Reportes
- [ ] **UI-3.6:** Formulario crear reporte con categorías
- [ ] **UI-3.7:** Lista de reportes con filtros
- [ ] **UI-3.8:** Detalle de reporte
- [ ] **UI-3.9:** Historial de cambios de estado
- [ ] **UI-3.10:** Vincular reporte a alerta

### Componentes de Formulario
- TextInput (texto libre, RUT, nombres)
- PhoneInput (código país +56)
- LocationPicker (selector en mapa)
- ImagePicker (cámara/galería)
- DatePicker (fechas)
- Select/Cards (categorías)

---

## FASE UI-4: MAPA INTERACTIVO (Semana 4) 🗺️

### Objetivo
Mapa completo con todas las funcionalidades geoespaciales.

### Tareas
- [ ] **UI-4.1:** Integrar `react-native-maps` + `expo-location`
- [ ] **UI-4.2:** Modo estándar (calles)
- [ ] **UI-4.3:** Modo satelital
- [ ] **UI-4.4:** Modo 3D (tierra)
- [ ] **UI-4.5:** Capas de calor (heatmap)
- [ ] **UI-4.6:** Marcadores personalizados por tipo (fuego, alerta, despacho)
- [ ] **UI-4.7:** Zoom táctil y gestos
- [ ] **UI-4.8:** Tracking de ubicación del usuario
- [ ] **UI-4.9:** Búsqueda de ubicación
- [ ] **UI-4.10:** Rutas de navegación

---

## FASE UI-5: DESPACHOS (Semana 5) 🚨

### Objetivo
Sistema de seguimiento y coordinación de emergencias.

### Tareas
- [ ] **UI-5.1:** Formulario crear despacho
- [ ] **UI-5.2:** Tracking en tiempo real del despacho
- [ ] **UI-5.3:** Lista de despachos activos
- [ ] **UI-5.4:** Notificaciones de cambio de estado
- [ ] **UI-5.5:** Integración con organismos externos (CONAF, Bomberos)

---

## FASE UI-6: ANALÍTICA + EXPORTAR (Semana 6) 📊

### Objetivo
Dashboard interactivo con métricas y exportación de datos.

### Tareas
- [ ] **UI-6.1:** Dashboard con KPIs visuales
- [ ] **UI-6.2:** Gráficos de líneas (tendencias temporales)
- [ ] **UI-6.3:** Gráficos de barras (comparaciones)
- [ ] **UI-6.4:** Filtros de fecha interactivos
- [ ] **UI-6.5:** Exportar a PDF (`expo-print`)
- [ ] **UI-6.6:** Exportar a Excel (`react-native-xlsx`)
- [ ] **UI-6.7:** Heatmap geoespacial

---

## FASE UI-7: MULTIMEDIA + EXTRAS (Semana 7) 📸

### Objetivo
Funcionalidades multimedia y polish final.

### Tareas
- [ ] **UI-7.1:** Upload de fotos/videos
- [ ] **UI-7.2:** Galería de evidencias
- [ ] **UI-7.3:** Sistema de alertas push por región
- [ ] **UI-7.4:** Animaciones profesionales (transiciones, micro-interacciones)
- [ ] **UI-7.5:** Pull-to-refresh con indicador
- [ ] **UI-7.6:** Skeleton loaders para carga de datos

---

# RESUMEN

| Fase | Objetivo | Semanas | Estado |
|------|----------|---------|--------|
| **Fase UI-1** | Core Visual + Navegación | 1 | ⏳ Pendiente |
| **Fase UI-2** | Auth + Perfil + Config | 2 | ⏳ Pendiente |
| **Fase UI-3** | Alertas + Reportes | 3 | ⏳ Pendiente |
| **Fase UI-4** | Mapa Interactivo | 4 | ⏳ Pendiente |
| **Fase UI-5** | Despachos | 5 | ⏳ Pendiente |
| **Fase UI-6** | Analítica + Exportar | 6 | ⏳ Pendiente |
| **Fase UI-7** | Multimedia + Extras | 7 | ⏳ Pendiente |

**Total estimado: 7 semanas**

---

# LIBRERÍAS REQUERIDAS

| Categoría | Librería | Estado |
|-----------|----------|--------|
| **Mapas** | `react-native-maps` + `expo-location` | ⏳ Por instalar |
| **Gráficos** | `react-native-gifted-charts` | ⏳ Por instalar |
| **PDF** | `expo-print` + `expo-sharing` | ⏳ Por instalar |
| **Excel** | `react-native-xlsx` | ⏳ Por instalar |
| **Notificaciones** | `expo-notifications` | ⏳ Por instalar |
| **Animaciones** | `react-native-reanimated` | ✅ Ya instalado |

---

# ESTRUCTURA DE NAVEGACIÓN

```
(ciudadano)/           → Tab Bar: Inicio | Reportar | Alertas | Perfil
(brigadista)/          → Tab Bar: Dashboard | Mapa | Reportes | Emerg. | Perfil
(admin)/               → Tab Bar: Dashboard | Mapa | Usuarios | Config | Perfil
```

---

*Última actualización: Mayo 2026*