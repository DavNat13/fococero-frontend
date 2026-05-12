// PRODUCT_REQUIREMENTS.md
# PRODUCT REQUIREMENTS - FocoCero

## 1. Visión del Producto
FocoCero es un ecosistema crítico para la gestión y respuesta de emergencias forestales. La premisa central es la alta disponibilidad, la resiliencia en zonas sin cobertura (offline-first) y la precisión geoespacial.

## 2. Roles del Sistema
- **Brigadista (Mobile):** Usuario en terreno. Declara focos, toma coordenadas, opera en modo offline/online.
- **Centro de Operaciones (Web/BFF):** Monitorea alertas, despacha recursos y visualiza mapas de calor (Analítica).

## 3. Objetivos de la Evaluación (Hito Actual: Ev2 FullStack)
- **Backend:** Consolidar 1 Backend For Frontend (API Gateway) y 2 Microservicios (Analítica y Emergencias) con alta disponibilidad y pruebas unitarias exhaustivas (>80% coverage).
- **Frontend:** Desarrollar módulos UI atómicos e independientes.
- **Calidad y Patrones:** Implementación demostrable de al menos 3 patrones de diseño en el frontend y estrategias de colaboración GitFlow.

## 4. Casos de Uso Críticos (In Scope)
- Autenticación segura y persistencia de sesión local.
- Sincronización de cola de red (Offline-Queue) al recuperar conexión a internet.
- Descubrimiento dinámico de servicios (Service Registry) en el API Gateway.

## 5. Fuera de Alcance (Out of Scope)
- Integración con pasarelas de pago.
- Chat en tiempo real entre brigadistas (solo reportes estructurados).
- Modelos predictivos de IA complejos en esta iteración.