# Étape 1 : Utiliser l'image Node 22 officielle
FROM node:22

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Installer npm 10 et serve
RUN npm install -g npm@10 serve

# Étape 4 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 5 : Installer les dépendances
RUN npm install

# Étape 6 : Copier tout le code source
COPY . . 

# Étape 7 : Récupérer les variables passées en argument du build
ARG VITE_API_BASE_URL

# Étape 8 : Définir ces variables dans l'environnement pour Vite
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Étape 9 : Construire l'application React
RUN npm run build

# Étape 10 : Exposer le port 5173
EXPOSE 5173

# Étape 11 : Lancer un serveur statique
CMD ["serve", "-s", "dist", "-l", "5173"]
