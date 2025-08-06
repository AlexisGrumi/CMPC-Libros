FROM node:20

WORKDIR /usr/src/app

# Copiamos solo package.json y package-lock.json para cachear dependencias
COPY package*.json ./

# Instalamos dependencias dentro del contenedor
RUN npm install

# Copiamos el resto del código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
