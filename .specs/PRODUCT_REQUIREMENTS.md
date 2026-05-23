// .specs/PRODUCT_REQUIREMENTS.md
# REQUERIMIENTOS DEL PRODUCTO - FocoCero

## 1. Misión

Proveer una herramienta de grado militar, offline-first, para el reporte, visualización y gestión de focos de incendio.

## 2. Sistema de Roles (RBAC)

### Roles Definidos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Ciudadano** | Usuario básico de la app | Crear reportes, ver alertas cercanas, subir multimedia, ver mapa |
| **Brigadista** | Personal de terreno | Todo lo del ciudadano + Cambiar estados de alertas/reportes, Gestionar focos, Crear despachos, Ver dashboard |
| **Admin** | Administrador del sistema | Control total (CRUD completo), Gestionar usuarios, Dashboard completo + Exportar |

### Permisos Detallados por Feature

| Feature | Ciudadano | Brigadista | Admin |
|---------|-----------|------------|-------|
| **Auth** | Login, Register, Guest | Login | Login |
| **Alertas** | Ver lista, Ver detalle | Ver, Crear, Cambiar estado | CRUD completo |
| **Reportes** | Crear, Ver propios | CRUD propio + cambiar estado | CRUD completo |
| **Mapa** | Ver focos, Ver alertas | Todo lo anterior + gestionar | CRUD completo |
| **Despachos** | ❌ | Crear, Seguir estados | CRUD completo |
| **Dashboard** | ❌ | Ver métricas | Ver + Exportar PDF/Excel |
| **Usuarios** | ❌ | ❌ | CRUD completo |
| **Configuración** | Propia | Propia | Global |

## 3. Épicas Core (Alineadas a Microservicios)

- **EP-01 (Auth & Sync):** Integración de Firebase y Gateway con interceptores de token.
- **EP-02 (Alertas & Focos):** Gestión de incendios en tiempo real. Evolución de Alerta a Emergencia.
- **EP-03 (Reportes):** Sistema ciudadano de recolección de datos (categorizado).
- **EP-04 (Geo-espacial):** Mapa interactivo (`react-native-maps`) renderizando clusters de focos.
- **EP-05 (Despachos):** Coordinación operativa externa (Conaf, Bomberos).
- **EP-06 (Analítica):** Consumo de modelos predictivos, heatmaps, dashboard, exportar PDF/Excel.
- **EP-07 (Multimedia):** Adjuntar evidencia (fotos/videos) a reportes y alertas.

## 4. Requisitos de UI/UX

### Navegación
- Tab Bar inferior con iconos para cada sección
- Navegación fluida con animaciones profesionales
- Restricciones de ruta según rol (protegido con middleware)
- Iconos bien definidos (MaterialCommunityIcons)

### Mapa
- Modo estándar (calles), satelital, 3D
- Capas de calor (heatmap)
- Marcadores personalizados por tipo
- Zoom y gestos táctiles
- Tracking de ubicación del usuario
- Búsqueda de ubicación
- Rutas de navegación

### Dashboard
- Gráficos de líneas (tendencias)
- Gráficos de barras (comparaciones)
- KPIs visuales
- Filtros de fecha interactivos
- Exportar a PDF y Excel

### Alertas Inteligentes
- Filtrar por región/ubicación del usuario
- Niveles: CRÍTICO (rojo), ALTO (naranja), MEDIO (amarillo), BAJO (verde)
- Notificaciones push según nivel de peligro

### Perfil de Usuario
- Avatar + Nombre + Rol
- Stats rápidos (reportes, alertas)
- Historial de actividad
- Editar datos personales
- Cerrar sesión

### Configuración
- Tema: Claro / Oscuro / Sistema
- Notificaciones
- Ubicación (GPS)
- Versión de app
- Términos y soporte

## 5. Requisitos Técnicos

### Offline-First
- Operaciones críticas encoladas en MMKV cuando no hay conexión
- Sincronización automática al recuperar red
- Indicadores visuales de modo offline

### Responsive Design
- Soporte para diferentes tamaños de pantalla
- Orientación vertical (principal)
- Dimensiones táctiles mínimas de 44px

### Accesibilidad
- Contraste de colores WCAG AA
- Texto legible en ambos temas
- Soporte para lectores de pantalla

## 6. Exportación de Datos

- **PDF:** Generación de reportes mediante `expo-print`
- **Excel:** Generación de hojas de cálculo mediante `react-native-xlsx`
- Incluir filtros activos en los reportes exportados