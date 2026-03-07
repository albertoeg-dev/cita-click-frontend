# ============================================
# DOCKERFILE - FRONTEND VUE.JS (NGINX)
# ============================================
# El build de Vite ya fue generado localmente (dist/).
# Esta imagen solo sirve los archivos estáticos con nginx.

FROM nginx:1.27-alpine

# Copiar los archivos compilados de Vite al directorio de nginx
COPY dist/ /usr/share/nginx/html/

# Copiar configuración de nginx (SPA routing + puerto 8080 para Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run usa el puerto 8080 por defecto
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
