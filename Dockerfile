# ============================================
# MULTI-STAGE DOCKERFILE - FRONTEND VUE.JS
# ============================================

# ============================================
# STAGE 1: BUILD (Node.js + Vite)
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias primero (aprovecha caché de Docker)
COPY package*.json ./
RUN npm ci

# Copiar código fuente y variables de entorno de producción
COPY . .

# Vite usa .env.production automáticamente en build
RUN npm run build

# ============================================
# STAGE 2: SERVE (nginx)
# ============================================
FROM nginx:1.27-alpine

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx (SPA routing + puerto 8080 para Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
