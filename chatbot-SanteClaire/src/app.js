
// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importe les dépendances principales
const express = require('express'); // Framework web principal
const cors = require('cors'); // Middleware pour autoriser les requêtes cross-origin
const helmet = require('helmet'); // Middleware de sécurité HTTP
const rateLimit = require('express-rate-limit'); // Limitation du nombre de requêtes
const mongoose = require('mongoose'); // ODM pour MongoDB
const winston = require('winston'); // Logger avancé


// Configuration du logger avec Winston
// Permet d'afficher les logs en couleur et d'inclure les erreurs et timestamps
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});


// Création de l'application Express
const app = express();
// Définition du port d'écoute (par défaut 3001)
const PORT = process.env.PORT || 3001;


// Ajout des middlewares de sécurité
app.use(helmet()); // Sécurise les headers HTTP
app.use(cors()); // Autorise les requêtes cross-origin


// Limitation du nombre de requêtes par IP (anti-abus)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite à 100 requêtes par IP
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);


// Middleware pour parser les requêtes JSON et les formulaires
app.use(express.json({ limit: '10mb' })); // Limite la taille des payloads JSON
app.use(express.urlencoded({ extended: true }));


// Fonction asynchrone pour connecter l'application à MongoDB
let dbConnected = false;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    dbConnected = true;
    logger.info(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    logger.warn('MongoDB non disponible - le chatbot fonctionnera sans persistance des conversations');
    dbConnected = false;
  }
};


// Importation et utilisation des routes API principales
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);


// Route de santé (pour vérifier que le serveur fonctionne)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});



// Middleware global de gestion des erreurs serveur
app.use((err, req, res, next) => {
  logger.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});


// Middleware pour gérer les routes non trouvées (404)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas`
  });
});


// Fonction principale pour démarrer le serveur Express
const startServer = async () => {
  try {
    await connectDB(); // Connexion à la base de données
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur SantéClaire démarré sur le port ${PORT}`);
      logger.info(`📋 Environnement: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 URL: http://localhost:${PORT}`);
      logger.info(`💊 Endpoint de santé: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};


// Démarre le serveur uniquement si ce fichier est exécuté directement (pas importé)
if (require.main === module) {
  startServer();
}


// Exporte l'application pour les tests ou l'utilisation externe
module.exports = app;
