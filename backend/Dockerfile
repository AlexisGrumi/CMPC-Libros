FROM node:20

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos solo package.json y package-lock.json para aprovechar cache
COPY package*.json ./

# Instalamos dependencias dentro del contenedor
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos puerto NestJS
EXPOSE 3001

# Levantamos en modo desarrollo
CMD ["npm", "run", "start:dev"]
