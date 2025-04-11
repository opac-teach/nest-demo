FROM node:20-slim

# Dépendances système pour bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires pour installer les deps
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code de l'application
COPY . .

# Commande de démarrage (à adapter si besoin)
CMD ["npm", "run", "dev"]
