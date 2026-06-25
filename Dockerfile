# --- ETAPA 1: Construcción (Build) ---
# Usamos una imagen de Node.js para compilar la aplicación
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de configuración de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo el código fuente del proyecto
COPY . .

# Compilamos la aplicación para web
# Esto generará los archivos estáticos en la carpeta 'dist' (o 'web-build')
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