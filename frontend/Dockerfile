# Etapa de build con Vite
FROM node:20 AS build

WORKDIR /app

# Copia package.json y lock para instalar dependencias
COPY package*.json ./
RUN npm install

# Copia todo el proyecto, incluido el .env.production
COPY . .

# ⚠️ Renombrar .env.production para que Vite lo lea automáticamente
RUN cp .env.production .env

# ✅ Verificar que .env se haya copiado correctamente
RUN echo "🧪 Contenido de .env:" && cat .env

# Construye en modo producción (usará el .env automáticamente)
RUN npm run build -- --mode production

# Etapa de producción: servir con Nginx
FROM nginx:alpine

# Copia los archivos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada si tienes
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
