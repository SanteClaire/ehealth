const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB connecté: ${conn.connection.host}`);
    
    // Configuration des événements de connexion
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connecté à MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Erreur de connexion Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose déconnecté');
    });

    // Fermeture propre de la connexion
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Connexion MongoDB fermée.');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
