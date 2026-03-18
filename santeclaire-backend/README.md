# SantéClaire Backend

API REST pour la plateforme de gestion de documents médicaux SantéClaire.

## 🚀 Stack Technique

- **Framework**: Symfony 7.x
- **Base de données**: PostgreSQL 15
- **Cache**: Redis
- **Authentification**: JWT (Lexik Bundle)
- **Serveur web**: Nginx
- **Conteneurisation**: Docker & Docker Compose

## 📋 Prérequis

- Docker & Docker Compose
- PHP 8.2+ (pour développement local sans Docker)
- Composer

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone [url-du-repo]
cd santeclaire-backend
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
```

### 3. Démarrer les conteneurs Docker

```bash
docker-compose up -d
```

### 4. Installer les dépendances

```bash
docker-compose exec php composer install
```

### 5. Créer la base de données

```bash
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:migrations:migrate
```

### 6. Générer les clés JWT

```bash
docker-compose exec php bin/console lexik:jwt:generate-keypair
```

### 7. Vérifier l'installation

```bash
curl http://localhost:8000/api/health
```

Réponse attendue:
```json
{
  "status": "ok",
  "timestamp": "2026-02-09T...",
  "app": "SantéClaire API",
  "version": "1.0.0"
}
```

## 📁 Structure du Projet

```
santeclaire-backend/
├── config/
│   ├── packages/           # Configuration des bundles
│   │   ├── doctrine.yaml
│   │   ├── framework.yaml
│   │   ├── lexik_jwt_authentication.yaml
│   │   ├── nelmio_cors.yaml
│   │   └── security.yaml
│   ├── routes.yaml
│   └── services.yaml
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── Dockerfile
├── public/
│   └── index.php
├── src/
│   ├── Controller/
│   │   └── Api/
│   │       ├── DocumentController.php
│   │       ├── HealthController.php
│   │       └── ProfileController.php
│   ├── Entity/
│   │   ├── DocumentMedical.php
│   │   ├── Medecin.php
│   │   ├── Patient.php
│   │   └── User.php
│   ├── Repository/
│   │   ├── DocumentMedicalRepository.php
│   │   ├── MedecinRepository.php
│   │   ├── PatientRepository.php
│   │   └── UserRepository.php
│   ├── Service/
│   │   ├── ChiffrementService.php
│   │   ├── ClassificationService.php
│   │   └── OcrService.php
│   └── Kernel.php
├── tests/
├── .env
├── .env.example
├── .gitignore
├── composer.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Santé / Test

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Vérification état de l'API |
| GET | `/api/ping` | Test simple |

### Authentification (Sprint 1 - Samy)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register` | Inscription patient/médecin |
| POST | `/api/login` | Connexion (retourne JWT) |
| POST | `/api/logout` | Déconnexion |
| POST | `/api/token/refresh` | Rafraîchir le token |

### Profil

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/profile` | Récupérer son profil |
| PUT | `/api/profile` | Mettre à jour son profil |

### Documents (Sprint 2)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/documents` | Liste des documents |
| GET | `/api/documents/{id}` | Détail d'un document |
| POST | `/api/documents` | Upload document |
| DELETE | `/api/documents/{id}` | Supprimer document |
| GET | `/api/documents/stats` | Statistiques |

## 🔐 Authentification JWT

### Obtenir un token

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Utiliser le token

```bash
curl http://localhost:8000/api/profile \
  -H "Authorization: Bearer <votre-token>"
```

## 🧪 Tests

```bash
# Lancer tous les tests
docker-compose exec php bin/phpunit

# Tests avec couverture
docker-compose exec php bin/phpunit --coverage-html coverage/
```

## 📝 Commandes Utiles

```bash
# Démarrer Docker
docker-compose up -d

# Arrêter Docker
docker-compose down

# Voir les logs
docker-compose logs -f

# Accéder au conteneur PHP
docker-compose exec php bash

# Créer une migration
docker-compose exec php bin/console make:migration

# Exécuter les migrations
docker-compose exec php bin/console doctrine:migrations:migrate

# Vider le cache
docker-compose exec php bin/console cache:clear

# Générer les clés JWT
docker-compose exec php bin/console lexik:jwt:generate-keypair
```

## 👥 Équipe

- **Andrea** - Backend Developer (Symfony, PostgreSQL, API REST)
- **Samy** - Backend Developer (Symfony, PostgreSQL, IA/ML)
- **Mickael** - Frontend Developer (React, Vite, TailwindCSS)
- **Hanifa** - Frontend Developer (React, Vite, TailwindCSS)
- **Yasmine** - Chatbot IA Developer (IA, NLU, Chatbot médical)

## 📅 Sprints

- **Sprint 1**: Setup + Authentification (Andrea: US-1.1)
- **Sprint 2**: Profils & Documents
- **Sprint 3**: Espace Médecin & IA
- **Sprint 4**: Reconnaissance Vocale
- **Sprint 5**: Chatbot & Sécurité
- **Sprint 6**: Polish & Déploiement

---

Document généré le 09 Février 2026
SantéClaire - Gestion de Documents Médicaux
