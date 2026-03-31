# SanteClaire - Plateforme e-sante

Plateforme de gestion de sante avec portails dedies pour les patients et les medecins, integrant un chatbot medical intelligent.

---

## Sommaire

1. [Architecture du projet](#architecture-du-projet)
2. [Pre-requis](#pre-requis)
3. [Lancement avec Docker (recommande)](#lancement-avec-docker-recommande)
4. [Lancement sans Docker (developpement local)](#lancement-sans-docker-developpement-local)
5. [Commandes utiles](#commandes-utiles)
6. [Identifiants de test](#identifiants-de-test)
7. [URLs des services](#urls-des-services)
8. [Technologies utilisees](#technologies-utilisees)
9. [Structure du projet](#structure-du-projet)
10. [Auteurs](#auteurs)

---

## Architecture du projet

Le projet est compose de 3 services principaux :

```
frontend/               -->  React 19 + Vite          (port 5173)
backend/                -->  PHP 8.3 + Symfony 7      (port 8000)
chatbot-SanteClaire/    -->  Node.js 20 + Express     (port 3001)
```

Bases de donnees :
- PostgreSQL 16 (donnees medicales) sur le port 5432
- MongoDB Atlas (conversations chatbot)

Interface d'admin BDD :
- pgAdmin 4 sur le port 8080

---

## Pre-requis

### Avec Docker (recommande)

- Docker et Docker Compose installes
- Les ports 5173, 8000, 3001, 5432 et 8080 disponibles

### Sans Docker

- PHP 8.2+ avec extensions : intl, pdo_pgsql, zip, opcache
- Composer
- Node.js 20+
- npm
- PostgreSQL 16
- Symfony CLI (optionnel)

---

## Lancement avec Docker (recommande)

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd ehealth
```

### 2. Configurer les variables d'environnement

Copier et adapter les fichiers d'environnement si necessaire :

```bash
# Chatbot - copier le template
cp chatbot-SanteClaire/.env.example chatbot-SanteClaire/.env
```

Editer `chatbot-SanteClaire/.env` et renseigner :
- `MONGODB_URI` : URI de connexion MongoDB
- `OPENAI_API_KEY` : cle API OpenAI
- `ANTHROPIC_API_KEY` : cle API Anthropic (optionnel)

### 3. Demarrer tous les services

```bash
docker compose up -d
```

### 4. Initialiser la base de donnees

```bash
# Executer les migrations
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

# Charger les donnees de test
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

### 5. Verifier que tout fonctionne

```bash
docker compose ps
```

Tous les services doivent etre en status "running".

---

## Lancement sans Docker (developpement local)

### Backend

```bash
cd backend

# Installer les dependances PHP
composer install

# Configurer la base de donnees dans .env.local
# DATABASE_URL="postgresql://app:root@127.0.0.1:5432/santeclaire?serverVersion=16&charset=utf8"

# Creer la base de donnees
php bin/console doctrine:database:create

# Executer les migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Charger les fixtures
php bin/console doctrine:fixtures:load --no-interaction

# Lancer le serveur
symfony serve -d
# ou bien :
php -S localhost:8000 -t public
```

### Frontend

```bash
cd frontend

# Installer les dependances
npm install

# Lancer le serveur de developpement
npm run dev
```

### Chatbot

```bash
cd chatbot-SanteClaire

# Installer les dependances
npm install

# Configurer le .env (voir .env.example)
cp .env.example .env

# Lancer en mode developpement (hot-reload avec nodemon)
npm run dev
```

---

## Commandes utiles

### Docker

```bash
# Demarrer les services
docker compose up -d

# Arreter les services
docker compose down

# Voir les logs
docker compose logs -f

# Logs d'un service specifique
docker compose logs -f backend
docker compose logs -f chatbot
docker compose logs -f frontend

# Reconstruire les images
docker compose up -d --build
```

### Backend (Symfony)

```bash
# Vider le cache
docker compose exec backend php bin/console cache:clear

# Creer une migration apres modification d'entite
docker compose exec backend php bin/console make:migration

# Executer les migrations
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

# Recharger les fixtures (ecrase les donnees existantes)
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

# Verifier le statut des migrations
docker compose exec backend php bin/console doctrine:migrations:status
```

### Frontend

```bash
# Build de production
cd frontend && npm run build

# Linter le code
cd frontend && npm run lint

# Preview du build de production
cd frontend && npm run preview
```

### Chatbot

```bash
# Lancer les tests
cd chatbot-SanteClaire && npm test

# Tests en mode watch
cd chatbot-SanteClaire && npm run test:watch

# Couverture de tests
cd chatbot-SanteClaire && npm run test:coverage
```

---

## Identifiants de test

Apres chargement des fixtures :

### Administrateurs

| Email                        | Mot de passe |
|------------------------------|--------------|
| admin@santeclaire.fr         | admin123     |
| moderateur@santeclaire.fr    | admin123     |

### Medecins

| Email                        | Mot de passe | Specialite       |
|------------------------------|--------------|------------------|
| dr.dupont@santeclaire.fr     | medecin123   | Generaliste      |
| dr.martin@santeclaire.fr     | medecin123   | Cardiologie      |
| dr.bernard@santeclaire.fr    | medecin123   | Dermatologie     |

### Patients

| Email                        | Mot de passe |
|------------------------------|--------------|
| marie.durand@email.fr        | patient123   |
| jean.petit@email.fr          | patient123   |

---

## URLs des services

| Service             | URL                              |
|---------------------|----------------------------------|
| Frontend            | http://localhost:5173             |
| API Backend         | http://localhost:8000/api         |
| Documentation API   | http://localhost:8000/api/doc     |
| Panel Admin         | http://localhost:8000/admin       |
| Chatbot API         | http://localhost:3001/api         |
| Chatbot Health      | http://localhost:3001/health      |
| pgAdmin             | http://localhost:8080             |

Identifiants pgAdmin : admin@santeclaire.fr / admin

---

## Technologies utilisees

### Backend

| Technologie         | Usage                                          |
|---------------------|-------------------------------------------------|
| PHP 8.3             | Langage serveur                                 |
| Symfony 7.0         | Framework web, API REST                         |
| Doctrine ORM 3.6    | Mapping objet-relationnel                       |
| PostgreSQL 16       | Base de donnees relationnelle                   |
| Lexik JWT 3.2       | Authentification par tokens JWT                 |
| EasyAdmin           | Panel d'administration                          |
| Dompdf 3.1          | Generation de PDF (ordonnances)                 |
| Nelmio API Doc      | Documentation Swagger / OpenAPI                 |

### Frontend

| Technologie         | Usage                                          |
|---------------------|-------------------------------------------------|
| React 19            | Framework UI                                    |
| Vite 7.3            | Build tool et serveur de developpement          |
| CSS Modules         | Styles scopes par composant                     |
| Lucide React        | Bibliotheque d'icones                           |
| ESLint              | Qualite de code                                 |

### Chatbot

| Technologie         | Usage                                          |
|---------------------|-------------------------------------------------|
| Node.js 20          | Runtime JavaScript                              |
| Express 4.18        | Framework serveur                               |
| MongoDB / Mongoose  | Stockage conversations et usage IA              |
| OpenAI GPT-3.5      | LLM principal pour reponses medicales           |
| Anthropic Claude 3  | LLM alternatif et generation de resumes         |
| Tesseract.js        | OCR sur documents medicaux                      |
| Whisper (OpenAI)    | Transcription vocale                            |
| Jest                | Tests unitaires                                 |
| Winston             | Logging structure                               |

### Infrastructure

| Technologie         | Usage                                          |
|---------------------|-------------------------------------------------|
| Docker Compose      | Orchestration des services                      |
| Apache              | Serveur HTTP (backend)                          |
| pgAdmin 4           | Interface d'administration PostgreSQL            |

---

## Structure du projet

```
ehealth/
├── compose.yaml
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── composer.json
│   ├── config/                  # Configuration Symfony
│   │   ├── jwt/                 # Cles RSA pour JWT
│   │   └── packages/            # Bundles config
│   ├── migrations/              # Migrations Doctrine
│   ├── public/                  # Point d'entree web
│   └── src/
│       ├── Controller/
│       │   ├── Admin/           # Controllers EasyAdmin (8)
│       │   └── Api/             # Controllers API REST (6)
│       ├── Entity/              # Entites Doctrine (10)
│       ├── Repository/          # Repositories
│       ├── Enum/                # Enumerations
│       ├── DataFixtures/        # Donnees de test
│       └── EventSubscriber/     # Gestion des evenements
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx              # Composant racine
│       ├── main.jsx             # Point d'entree
│       ├── components/          # Composants React (40+)
│       │   ├── Doctor*          # Portail medecin (20+)
│       │   └── Patient*         # Portail patient (18+)
│       ├── services/            # Client API (api.js)
│       ├── hooks/               # Hooks personnalises
│       ├── utils/               # Utilitaires
│       └── assets/              # Images et logos
│
└── chatbot-SanteClaire/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app.js               # Serveur Express
        ├── config/              # Configuration MongoDB
        ├── routes/              # Routes API (4 fichiers)
        ├── controllers/         # Controleurs
        ├── models/              # Schemas Mongoose (3)
        ├── services/
        │   ├── ai/              # Services IA
        │   │   ├── aiOrchestrator.js
        │   │   ├── openaiService.js
        │   │   ├── claudeService.js
        │   │   ├── decisionTree.js
        │   │   ├── whisperService.js
        │   │   └── lmStudioService.js
        │   └── ocrService.js    # OCR Tesseract
        └── utils/               # Utilitaires
```

---

## Auteurs

- **Equipe SanteClaire**

---

*SanteClaire -- La sante, en toute simplicite.*
