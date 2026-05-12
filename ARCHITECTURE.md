// ARCHITECTURE.md
# ARCHITECTURE - FocoCero

## 1. Patrones de Diseño Frontend (Mandatorios)
Para cumplir con la escalabilidad y los requisitos académicos, el frontend implementa los siguientes patrones:
- **Singleton:** Utilizado en el cliente HTTP (Axios) y el motor de almacenamiento offline (MMKV/Storage Adapter) para garantizar una única instancia global.
- **Observer (Pub/Sub):** Implementado a través de Zustand para la gestión de estado global y reactividad de componentes sin *prop-drilling*.
- **Container/Presenter:** Separación estricta en la capa `widgets/`. El *Container* (Custom Hooks) maneja la lógica de negocio y asincronía, y el *Presenter* (UI Component) solo renderiza props.

## 2. Arquitectura Frontend: Feature-Sliced Design (FSD)
Construcción estricta de **Abajo hacia Arriba**:
1. `core/`: Infraestructura, interceptores Axios, motor offline.
2. `shared/`: UI "tonta", sistema de diseño, utilidades genéricas.
3. `entities/`: Modelos de negocio, esquemas Zod, interfaces.
4. `features/`: Casos de uso (ej. `reportar-incendio`), hooks de asincronía, stores.
5. `widgets/`: Orquestadores complejos que unen features y entities.
6. `app/`: Capa exclusiva de enrutamiento (Expo Router). Cero lógica de negocio.

## 3. Arquitectura Backend y Flujo de Datos
- **API Gateway (BFF):** Único puerto expuesto. Verifica JWT, aplica Rate Limiting, propaga `Trace-IDs` y enruta internamente.
- **Microservicios (Zero-Trust):** No expuestos al exterior. Utilizan Arquitectura Hexagonal (Routes -> Controllers -> Services -> Repositories -> Models).
- **Comunicación:** Síncrona vía HTTP/REST y asíncrona vía RabbitMQ para analítica de datos pesados.