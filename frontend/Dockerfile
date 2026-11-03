FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

EXPOSE 5173

# Iniciar servidor de desarrollo de Vite accesible desde el host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
