# Imagen base Node
FROM node:18

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar dependencias
COPY package*.json ./

RUN npm install 

# Copiar el resto del código
COPY . .

# Exponer el puerto del backend (ejemplo 4000)
EXPOSE 4000

# Definir variables de entorno por defecto (se pueden sobrescribir en docker-compose o al correr el contenedor)
ENV PORT=4000
ENV HOST=0.0.0.0

# Copiar y establecer entrypoint
COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

CMD ["/usr/src/app/docker-entrypoint.sh"]
