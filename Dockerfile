# --- ETAPA 1: Construcción (Build) ---
FROM node:20-alpine AS builder

# Build args para inyectar variables de entorno en tiempo de build
ARG EXPO_PUBLIC_API_GATEWAY_URL
ARG EXPO_PUBLIC_ENVIRONMENT=production
ARG EXPO_PUBLIC_FIREBASE_API_KEY
ARG EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG EXPO_PUBLIC_FIREBASE_PROJECT_ID
ARG EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG EXPO_PUBLIC_FIREBASE_APP_ID
ARG EXPO_PUBLIC_FIREBASE_CLIENT_ID
ARG EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID
ARG EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS

ENV EXPO_PUBLIC_API_GATEWAY_URL=$EXPO_PUBLIC_API_GATEWAY_URL \
    EXPO_PUBLIC_ENVIRONMENT=$EXPO_PUBLIC_ENVIRONMENT \
    EXPO_PUBLIC_FIREBASE_API_KEY=$EXPO_PUBLIC_FIREBASE_API_KEY \
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=$EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN \
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=$EXPO_PUBLIC_FIREBASE_PROJECT_ID \
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=$EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET \
    EXPO_PUBLIC_FIREBASE_APP_ID=$EXPO_PUBLIC_FIREBASE_APP_ID \
    EXPO_PUBLIC_FIREBASE_CLIENT_ID=$EXPO_PUBLIC_FIREBASE_CLIENT_ID \
    EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=$EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID \
    EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=$EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS

WORKDIR /app

COPY package*.json ./
COPY scripts/ ./scripts/

RUN npm ci

COPY . .

RUN npx expo export -p web

# --- ETAPA 2: Servidor (Runtime) ---
# Usamos una imagen de Nginx, que es un servidor web muy eficiente y ligero
FROM nginx:alpine

# Copiamos solo los archivos estáticos compilados desde la etapa anterior al directorio de Nginx
# Asegúrate de verificar si tu carpeta de salida es 'dist' o 'web-build' (Expo a veces varía)
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (puerto estándar de tráfico web)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]