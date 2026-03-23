# 🌐 Configuration MongoDB Atlas (gratuit) pour SantéClaire

## Étapes rapides :

### 1. Créer un compte MongoDB Atlas
- Allez sur : https://www.mongodb.com/atlas
- Créez un compte gratuit
- Sélectionnez le plan **M0 Sandbox** (gratuit)

### 2. Créer un cluster
- Choisissez **AWS** ou **Google Cloud**
- Région : **Europe (Ireland)** ou **Frankfurt**
- Nom du cluster : `santeclaire-cluster`

### 3. Configuration sécurité
- **Database Access** : Créez un utilisateur
  - Username : `santeclaire`
  - Password : `[généré automatiquement]`
- **Network Access** : Ajoutez votre IP
  - Cliquez "Add IP Address"
  - Sélectionnez "Add Current IP Address"

### 4. Obtenir la chaîne de connexion
- Cliquez "Connect" sur votre cluster
- Choisissez "Connect your application"
- Copiez la chaîne de connexion

### 5. Mettre à jour votre .env
```
MONGODB_URI=mongodb+srv://santeclaire:<password>@santeclaire-cluster.xxxxx.mongodb.net/santeclaire-chatbot
```

### 6. Tester la connexion
```bash
npm start
```

## Avantages MongoDB Atlas :
- ✅ Gratuit jusqu'à 512MB
- ✅ Pas d'installation locale
- ✅ Sauvegarde automatique
- ✅ Accessible partout
- ✅ Compatible MongoDB Compass
