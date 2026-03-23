// Démarrage du serveur sans MongoDB pour tester l'arbre de décision
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { DecisionTreeService } = require('./src/services/ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use(limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialiser l'arbre de décision
const decisionTree = new DecisionTreeService();

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'disabled',
    services: {
      decision_tree: true,
      lm_studio: false,
      whisper_local: false
    }
  });
});

// Route API simple pour tester l'arbre de décision
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API SantéClaire - Mode Test (sans base de données)',
    version: '1.0.0',
    services: {
      decision_tree: 'Actif - Réponses automatiques',
      database: 'Désactivé pour les tests',
      lm_studio: 'Non configuré',
      whisper_local: 'Non configuré'
    },
    endpoints: {
      test_message: 'POST /api/test/message',
      suggestions: 'GET /api/test/suggestions',
      status: 'GET /api/test/status'
    }
  });
});

// Route pour tester les messages avec l'arbre de décision uniquement
app.post('/api/test/message', (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message requis',
        code: 'MISSING_MESSAGE'
      });
    }

    console.log(`💬 Test message: "${message}"`);

    // Analyser avec l'arbre de décision
    const result = decisionTree.analyzeMessage(message);

    if (result && result.confidence >= 0.3) {
      res.json({
        success: true,
        data: {
          response: result.response,
          source: 'decision_tree',
          category: result.category,
          confidence: result.confidence,
          metadata: {
            cost: 0,
            tokens_used: 0,
            response_time_ms: 10
          }
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          response: "Je suis désolé, je ne peux pas répondre à cette question complexe en mode test. Veuillez configurer LM Studio pour des réponses plus avancées.",
          source: 'fallback',
          category: 'unknown',
          confidence: 0,
          metadata: {
            cost: 0,
            tokens_used: 0,
            response_time_ms: 5
          }
        }
      });
    }

  } catch (error) {
    console.error('❌ Erreur test message:', error.message);
    
    res.status(500).json({
      error: 'Erreur traitement message',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Route pour les suggestions
app.get('/api/test/suggestions', (req, res) => {
  try {
    const suggestions = decisionTree.getSuggestedQuestions();
    
    res.json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    console.error('❌ Erreur suggestions:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération suggestions',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Route de statut
app.get('/api/test/status', (req, res) => {
  try {
    const stats = decisionTree.getStatistics();
    
    res.json({
      success: true,
      data: {
        services: {
          decision_tree: true,
          lm_studio: false,
          whisper_local: false,
          database: false
        },
        decision_tree_stats: stats,
        mode: 'test_without_database'
      }
    });

  } catch (error) {
    console.error('❌ Erreur statut:', error.message);
    
    res.status(500).json({
      error: 'Erreur vérification statut',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log('🚀 Serveur SantéClaire démarré (mode test)');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 API: http://localhost:${PORT}/api`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('🎯 Mode test actif - Arbre de décision uniquement');
  console.log('💡 Pour tester: POST http://localhost:3001/api/test/message');
  console.log('📋 Suggestions: GET http://localhost:3001/api/test/suggestions');
  console.log('');
  console.log('⚠️ Base de données désactivée pour ce test');
  console.log('🔧 Pour le mode complet, démarrez MongoDB et utilisez: npm start');
});

module.exports = app;
