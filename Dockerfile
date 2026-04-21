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

# Copiar código fuente y archivos de variables de entorno
COPY . .

# BUILD_SCRIPT permite elegir el modo de build:
#   production (default): npm run build       → usa .env.production
#   qa:                   npm run build:qa    → usa .env.qa
ARG BUILD_SCRIPT=build
RUN npm run ${BUILD_SCRIPT}

# ============================================
# STAGE 2: SERVE (nginx)
# ============================================
FROM nginx:1.27-alpine

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Eliminar config por defecto y copiar la nuestra
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
