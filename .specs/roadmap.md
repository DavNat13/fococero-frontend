# Hoja de Ruta y Hitos - FocoCero Frontend

---

## ✅ COMPLETADO - Integración de APIs (Parte 1)

- [x] **Fase 1: Fundamentos Críticos** — Rutas auth sin `/v1/`, interceptor Firebase Token, flujo E2E con Gateway
- [x] **Fase 2: Alertas (API)** — `alertas.api.ts`, hooks, Zustand store
- [x] **Fase 3: Reportes (API)** — `reportes.api.ts`, hooks, Zustand store
- [x] **Fase 4: Geo-Espacial (API)** — `geo.api.ts`, hooks, Zustand store
- [x] **Fase 5: Emergencias (API)** — `emergencias.api.ts`, hooks, Zustand store
- [x] **Fase 6: Analítica (API)** — `analitica.api.ts`, hooks, Zustand store
- [x] **Fase 7: Multimedia (API)** — `multimedia.api.ts`, hooks, Zustand store

---

## ✅ COMPLETADO - FASE UI-1: CORE VISUAL 🎨

- [x] **UI-1.1:** Paleta de colores profesional (tema oscuro táctico)
- [x] **UI-1.2:** Tipografía (Inter + Roboto)
- [x] **UI-1.3:** Componentes base (Button, Input, Card, Badge, Switch, etc.)
- [x] **UI-1.4:** Sistema de navegación (Tab Bar) por rol
- [x] **UI-1.5:** Scaffold de pantallas por rol (Ciudadano, Brigadista, Admin)
- [x] **UI-1.6:** Animaciones profesionales para navegación

### Pantallas creadas

| Rol | Pantallas |
|-----|-----------|
| **Ciudadano** | Inicio, Reportar, Alertas, Perfil |
| **Brigadista** | Dashboard, Mapa, Reportes, Emergencias, Perfil |
| **Admin** | Dashboard, Mapa, Usuarios, Config, Perfil |

---

## ✅ COMPLETADO - FASE UI-2: AUTH + PERFIL + CONFIG 👤

- [x] **UI-2.1:** Pantalla Login (diseño profesional)
- [x] **UI-2.2:** Pantalla Register (diseño profesional)
- [x] **UI-2.3:** Pantalla de Perfil de usuario (estructurada por rol)
- [x] **UI-2.4:** Editor de perfil (perfil.tsx con datos editables)
- [x] **UI-2.5:** Pantalla de Configuración (Admin)

---

## ⏳ PENDIENTE - FASE UI-3: ALERTAS + REPORTES 📋

- [ ] **UI-3.1:** Lista de alertas con filtros (estado, fecha, ubicación)
- [ ] **UI-3.2:** Formulario crear alerta con ubicación en mapa
- [ ] **UI-3.3:** Detalle de alerta con timeline de estados
- [ ] **UI-3.4:** Cambio de estado (Brigadista/Admin)
- [ ] **UI-3.5:** Alertas inteligentes por región
- [ ] **UI-3.6:** Formulario crear reporte con categorías
- [ ] **UI-3.7:** Lista de reportes con filtros
- [ ] **UI-3.8:** Detalle de reporte
- [ ] **UI-3.9:** Historial de cambios de estado
- [ ] **UI-3.10:** Vincular reporte a alerta

---

## ⏳ PENDIENTE - FASE UI-4: MAPA INTERACTIVO 🗺️

- [ ] **UI-4.1:** Integrar `react-native-maps` + `expo-location`
- [ ] **UI-4.2:** Modo estándar (calles)
- [ ] **UI-4.3:** Modo satelital
- [ ] **UI-4.4:** Modo 3D (tierra)
- [ ] **UI-4.5:** Capas de calor (heatmap)
- [ ] **UI-4.6:** Marcadores personalizados por tipo
- [ ] **UI-4.7:** Zoom táctil y gestos
- [ ] **UI-4.8:** Tracking de ubicación del usuario
- [ ] **UI-4.9:** Búsqueda de ubicación
- [ ] **UI-4.10:** Rutas de navegación

---

## ⏳ PENDIENTE - FASE UI-5: DESPACHOS 🚨

- [ ] **UI-5.1:** Formulario crear despacho
- [ ] **UI-5.2:** Tracking en tiempo real del despacho
- [ ] **UI-5.3:** Lista de despachos activos
- [ ] **UI-5.4:** Notificaciones de cambio de estado
- [ ] **UI-5.5:** Integración con organismos externos (CONAF, Bomberos)

---

## ⏳ PENDIENTE - FASE UI-6: ANALÍTICA + EXPORTAR 📊

- [ ] **UI-6.1:** Dashboard con KPIs visuales
- [ ] **UI-6.2:** Gráficos de líneas (tendencias temporales)
- [ ] **UI-6.3:** Gráficos de barras (comparaciones)
- [ ] **UI-6.4:** Filtros de fecha interactivos
- [ ] **UI-6.5:** Exportar a PDF (`expo-print`)
- [ ] **UI-6.6:** Exportar a Excel (`react-native-xlsx`)
- [ ] **UI-6.7:** Heatmap geoespacial

---

## ⏳ PENDIENTE - FASE UI-7: MULTIMEDIA + EXTRAS 📸

- [ ] **UI-7.1:** Upload de fotos/videos
- [ ] **UI-7.2:** Galería de evidencias
- [ ] **UI-7.3:** Sistema de alertas push por región
- [ ] **UI-7.4:** Animaciones profesionales (transiciones, micro-interacciones)
- [ ] **UI-7.5:** Pull-to-refresh con indicador
- [ ] **UI-7.6:** Skeleton loaders para carga de datos

---

# RESUMEN

| Fase | Objetivo | Estado |
|------|----------|--------|
| **Fase UI-1** | Core Visual + Navegación | ✅ Completado |
| **Fase UI-2** | Auth + Perfil + Config | ✅ Completado |
| **Fase UI-3** | Alertas + Reportes | ⏳ Pendiente |
| **Fase UI-4** | Mapa Interactivo | ⏳ Pendiente |
| **Fase UI-5** | Despachos | ⏳ Pendiente |
| **Fase UI-6** | Analítica + Exportar | ⏳ Pendiente |
| **Fase UI-7** | Multimedia + Extras | ⏳ Pendiente |

---

# ESTRUCTURA DE NAVEGACIÓN

```
(ciudadano)/           → Tab Bar: Inicio | Reportar | Alertas | Perfil
(brigadista)/          → Tab Bar: Dashboard | Mapa | Reportes | Emerg. | Perfil
(admin)/               → Tab Bar: Dashboard | Mapa | Usuarios | Config | Perfil
```

---

*Última actualización: Mayo 2026*
