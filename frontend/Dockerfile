# Etapa de build con Vite
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia todo el frontend, incluido el .env.production
COPY . .

# ⚠️ Este paso es importante: renombra .env.production como .env
# para que Vite lo use automáticamente
RUN cp .env.production .env

# Construye en modo producción
RUN npm run build -- --mode production

# Etapa de producción: servir con Nginx
FROM nginx:alpine

# Copia los archivos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada de nginx si tienes
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
