// .specs/context/PRODUCT_REQUIREMENTS.md
# REQUERIMIENTOS DEL PRODUCTO - FocoCero

## 1. Misión
Proveer una herramienta de grado militar, offline-first, para el reporte, visualización y gestión de focos de incendio.

## 2. Sistema de Roles (RBAC)
- **Ciudadano:** Puede crear reportes, ver alertas cercanas y subir multimedia.
- **Brigadista:** Todo lo del ciudadano + Cambio de estados, Despacho de emergencias y visualización del Dashboard Analítico.
- **Admin:** Control total del sistema y analítica predictiva.

## 3. Épicas Core (Alineadas a Microservicios)
- **EP-01 (Auth & Sync):** Integración de Firebase y Gateway con interceptores de token.
- **EP-02 (Alertas & Focos):** Gestión de incendios en tiempo real. Evolución de Alerta a Emergencia.
- **EP-03 (Reportes):** Sistema ciudadano de recolección de datos (categorizado).
- **EP-04 (Geo-espacial):** Mapa interactivo (`react-native-maps`) renderizando clusters de focos.
- **EP-05 (Despachos):** Coordinación operativa externa (Conaf, Bomberos).
- **EP-06 (Analítica):** Consumo de modelos predictivos y heatmaps.
- **EP-07 (Multimedia):** Adjuntar evidencia (fotos/videos) a reportes y alertas.