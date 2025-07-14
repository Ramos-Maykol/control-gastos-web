# Etapa de build con Vite
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción: servir con Nginx
FROM nginx:alpine

# Copia los archivos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada para rutas de SPA
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
