# Etapa 1: Compilar la app Angular
FROM node:20-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app Angular (ajusta el nombre del proyecto si es distinto)
RUN npm run build -- --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Copiar archivos compilados desde la etapa anterior
COPY --from=builder /app/dist/tools/browser /usr/share/nginx/html

# (Opcional) Copiar configuración personalizada de Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Nginx inicia por defecto
