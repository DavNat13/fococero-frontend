// TECH_STACK.md
# TECH STACK - FocoCero

## Frontend (Mobile)
- **Core:** React Native (0.74+), Expo (SDK 51+), TypeScript (5.4+).
- **Gestión de Estado:** Zustand (4.5+).
- **Data Fetching & HTTP:** Axios (1.6+) con Interceptores.
- **Validación y Tipado:** Zod (3.23+).
- **Estilos:** NativeWind (v4) / Tailwind CSS.
- **Enrutamiento:** Expo Router (v3).

## Backend (Microservicios)
- **Core:** Node.js (v20 LTS), TypeScript (5.4+), Express (4.19+).
- **Service Discovery:** Netflix Eureka (`eureka-js-client`).
- **Bases de Datos:** PostgreSQL (15+) con PostGIS, Redis (7+).
- **Mensajería:** RabbitMQ (3.13+).

## Infraestructura y Calidad
- **Contenedores:** Docker (24+) y Docker Compose.
- **Testing Frontend:** Jest, React Native Testing Library.
- **Testing Backend:** Jest, Supertest (Coverage Target: >80%).
- **Linter & Formatter:** ESLint (Flat Config), Prettier.