// .specs/roadmap.md
# Hoja de Ruta y Hitos - FocoCero Frontend

## Fase 1: Fundamentos Críticos (Completado ✅)
- [x] **1.1:** Eliminar el prefijo `/v1/` de `auth.api.ts` y `usuario.api.ts`.
- [x] **1.2:** Implementar interceptor en `api.interceptors.ts` para inyectar el Token de Firebase en peticiones privadas.
- [x] **1.3:** Validar flujo Login/Registro end-to-end contra el Gateway.

## Fase 2: Core Operativo (Alertas) (En Progreso 🔄)
- [x] **2.1:** Crear `alertas.api.ts` y hooks (`useAlertas`).
- [x] **2.2:** Zustand store para Alertas (lista, actual, loading).
- [ ] **2.3:** CRUD de UI de alertas y cambio de estados.

## Fase 3: Reportes Ciudadanos (Completado ✅)
- [x] **3.1:** Crear `reportes.api.ts` y hooks (`useReportes`).
- [x] **3.2:** Zustand store para Reportes.
- [ ] **3.3:** UI de formularios de reporte vinculables a alertas.

## Fase 4: Geo-Espacial (Completado ✅)
- [x] **4.1:** Crear `geo.api.ts`.
- [ ] **4.2:** Integrar `<MapView>` de `react-native-maps`.
- [ ] **4.3:** Renderizar focos georreferenciados en el mapa.

## Fase 5: Despacho de Emergencias (Completado ✅)
- [x] **5.1:** Crear `emergencias.api.ts` (Solo Brigadistas).
- [ ] **5.2:** UI de tracking y coordinación de despachos.

## Fase 6: Analítica y Dashboard (⏳)
- [ ] **6.1:** Crear `analitica.api.ts`.
- [ ] **6.2:** UI de métricas, heatmaps y gráficas operativas.

## Fase 7: Multimedia (⏳)
- [ ] **7.1:** Subida de evidencia fotográfica adjunta a reportes/alertas.