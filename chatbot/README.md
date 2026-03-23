# 🏥 SantéClaire - Chatbot Médical Intelligent

## 📋 Description
Module d'Intelligence Artificielle pour l'application médicale SantéClaire. Ce projet universitaire implémente trois fonctionnalités principales :

- 🤖 **Chatbot médical** pour assister les patients
- 📄 **Résumé automatique** des antécédents médicaux
- 🎙️ **Transcription vocale** des consultations

## 🚀 Technologies
- **Backend**: Node.js + Express
- **Base de données**: MongoDB
- **IA**: Claude (Anthropic) + Whisper (OpenAI)
- **Tests**: Jest + Supertest

## 📦 Installation

### Prérequis
- Node.js (v18 ou plus récent)
- MongoDB (local ou Atlas)
- Clés API Anthropic et OpenAI

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd chatbot-SanteClaire
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Puis éditer le fichier `.env` avec vos configurations.

4. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 🔧 Configuration

### Variables d'environnement requises
- `MONGODB_URI`: URL de connexion MongoDB
- `ANTHROPIC_API_KEY`: Clé API Claude
- `OPENAI_API_KEY`: Clé API OpenAI
- `PORT`: Port du serveur (défaut: 3001)

### MongoDB
Deux options disponibles :
- **MongoDB Atlas** (recommandé) : Service cloud gratuit
- **MongoDB local** : Installation locale avec Docker

## 📚 Structure du projet

```
src/
├── config/           # Configuration de l'application
├── controllers/      # Contrôleurs pour les routes
├── models/          # Modèles MongoDB
├── routes/          # Définition des routes API
├── services/        # Logique métier
│   ├── ai/          # Services d'IA (Claude, Whisper)
│   ├── cache/       # Gestion du cache
│   └── storage/     # Gestion du stockage
├── utils/           # Utilitaires
└── app.js           # Point d'entrée
```

## 🔗 API Endpoints

### Santé du serveur
- `GET /health` - Vérification du statut du serveur

### Chatbot (à implémenter)
- `POST /api/chatbot/message` - Envoyer un message
- `GET /api/chatbot/history/:patientId` - Récupérer l'historique

### Résumé (à implémenter)
- `POST /api/resume/generate` - Générer un résumé

### Transcription (à implémenter)
- `POST /api/transcription/audio` - Transcrire un fichier audio

## 🧪 Tests
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

## 📊 Monitoring
- Logs avec Winston
- Limitation du taux de requêtes
- Monitoring des coûts API

## 👥 Équipe
- **Sogona Yasmine** - Développeuse IA
- **Andrea & Samy** - Backend Symfony
- **Hanifa & Elohim** - Frontend

## 📝 Licence
ISC - Projet universitaire

## 🚧 Statut du développement
- ✅ Configuration initiale
- 🔄 Chatbot en développement
- ⏳ Résumé à implémenter
- ⏳ Transcription à implémenter
