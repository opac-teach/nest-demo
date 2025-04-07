FROM node:20-alpine

# 🔧 Ajout des dépendances système nécessaires à npm install
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
