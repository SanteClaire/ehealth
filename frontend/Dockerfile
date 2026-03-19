FROM node:20-slim

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# La commande par défaut
CMD ["npm", "run", "dev", "--", "--host"]
