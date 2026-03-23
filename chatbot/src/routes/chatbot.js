
// Importe les dépendances nécessaires
const express = require('express'); // Framework web
const multer = require('multer'); // Pour gérer l'upload de fichiers
const { AIOrchestrator } = require('../services/ai'); // Orchestrateur IA maison
const { Conversation } = require('../models'); // Modèle de conversation MongoDB
const winston = require('winston'); // Logger


// Initialise le routeur Express
const router = express.Router();


// Configuration du logger pour afficher les logs dans la console
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Configuration de multer pour gérer l'upload de fichiers audio en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // Liste des types MIME autorisés
    const allowedMimeTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 
      'audio/m4a', 'audio/webm', 'video/mp4', 'video/webm',
      'audio/flac', 'audio/ogg', 'audio/x-m4a', 'audio/aac',
      'audio/x-wav', 'audio/wave', 'audio/vnd.wave',
      'application/octet-stream' // Pour les fichiers sans mimetype détecté
    ];
    // Liste des extensions audio acceptées
    const ext = file.originalname.toLowerCase().split('.').pop();
    const audioExtensions = ['mp3', 'wav', 'mp4', 'm4a', 'webm', 'flac', 'ogg', 'aac', 'mpeg'];
    // Autorise le fichier si le mimetype ou l'extension est reconnue
    if (allowedMimeTypes.includes(file.mimetype) || audioExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Format non supporté: ${file.mimetype} (${ext}). Formats acceptés: ${audioExtensions.join(', ')}`), false);
    }
  }
});

// Middleware pour l'upload de fichiers médicaux
const uploadMedical = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB pour les fichiers médicaux
  fileFilter: (req, file, cb) => {
    // Types MIME pour fichiers médicaux
    const medicalMimeTypes = [
      'text/plain', 'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/octet-stream'
    ];
    // Extensions pour fichiers médicaux
    const ext = file.originalname.toLowerCase().split('.').pop();
    const medicalExtensions = ['txt', 'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'];
    
    if (medicalMimeTypes.includes(file.mimetype) || medicalExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Format non supporté: ${file.mimetype} (${ext}). Formats acceptés: ${medicalExtensions.join(', ')}`), false);
    }
  }
});

// Initialise l'orchestrateur IA (gestionnaire principal des appels IA)
const aiOrchestrator = new AIOrchestrator();

/**
 * Route POST /api/chatbot/message
 * Permet d'envoyer un message texte au chatbot et d'obtenir une réponse IA
 */
router.post('/message', async (req, res) => {
  try {
    const { message, patientId, conversationId } = req.body;


    // Vérifie que le message et l'ID patient sont bien fournis
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message requis',
        code: 'MISSING_MESSAGE'
      });
    }
    if (!patientId || typeof patientId !== 'string') {
      return res.status(400).json({
        error: 'ID patient requis',
        code: 'MISSING_PATIENT_ID'
      });
    }

    logger.info(`💬 Nouveau message chatbot - Patient: ${patientId}`);


    // Si un conversationId est fourni, récupère l'historique de la conversation (10 derniers messages)
    let conversationHistory = [];
    let conversation = null;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation && conversation.patient_id === patientId) {
        conversationHistory = conversation.messages.slice(-10); // Derniers 10 messages
      }
    }


    // Envoie le message à l'orchestrateur IA pour obtenir une réponse
    const aiResponse = await aiOrchestrator.processChatbotMessage(
      message,
      patientId,
      conversationHistory
    );


    // Crée une nouvelle conversation si besoin
    if (!conversation) {
      conversation = new Conversation({
        patient_id: patientId,
        messages: [],
        status: 'active'
      });
    }


    // Ajoute le message utilisateur et la réponse IA à la conversation
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse.response,
      timestamp: new Date(),
      metadata: {
        source: aiResponse.source,
        category: aiResponse.category,
        confidence: aiResponse.confidence,
        cost: aiResponse.metadata.cost,
        tokens_used: aiResponse.metadata.tokens_used || 0
      }
    });


    // Sauvegarde la conversation en base
    await conversation.save();


    // Retourne la réponse IA et les infos de conversation
    res.json({
      success: true,
      data: {
        response: aiResponse.response,
        conversationId: conversation._id,
        metadata: {
          source: aiResponse.source,
          category: aiResponse.category,
          confidence: aiResponse.confidence,
          responseTime: aiResponse.metadata.response_time_ms,
          cost: aiResponse.metadata.cost,
          tokensUsed: aiResponse.metadata.tokens_used || 0
        }
      }
    });


  } catch (error) {
    logger.error('❌ Erreur traitement message:', error.message);
    // Gestion des erreurs serveur
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Route POST /api/chatbot/transcribe
 * Permet d'envoyer un fichier audio et d'obtenir la transcription IA
 */
router.post('/transcribe', (req, res, next) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      logger.error('❌ Erreur upload fichier:', err.message);
      return res.status(400).json({
        error: 'Erreur upload fichier audio',
        code: 'UPLOAD_ERROR',
        message: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { patientId } = req.body;


    // Vérifie qu'un fichier audio a bien été envoyé
    if (!req.file) {
      return res.status(400).json({
        error: 'Fichier audio requis',
        code: 'MISSING_AUDIO_FILE'
      });
    }

    logger.info(`🎙️ Transcription audio - Patient: ${patientId || 'anonyme'}`);


    // Prépare les données du fichier pour l'IA
    const audioFile = {
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype
    };
    // Transcrit l'audio avec l'orchestrateur IA
    const transcriptionResult = await aiOrchestrator.transcribeAudio(audioFile, patientId);


    // Retourne la transcription et les métadonnées
    res.json({
      success: true,
      data: {
        transcription: transcriptionResult.transcription,
        metadata: {
          originalFilename: transcriptionResult.metadata.original_filename,
          fileSize: transcriptionResult.metadata.file_size_bytes,
          estimatedDuration: transcriptionResult.metadata.estimated_duration_seconds,
          responseTime: transcriptionResult.metadata.response_time_ms,
          cost: transcriptionResult.metadata.estimated_cost,
          model: transcriptionResult.metadata.model
        }
      }
    });


  } catch (error) {
    logger.error('❌ Erreur transcription:', error.message);
    // Gestion des erreurs serveur
    res.status(500).json({
      error: 'Erreur transcription audio',
      code: 'TRANSCRIPTION_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Route GET /api/chatbot/conversation/:conversationId
 * Permet de récupérer une conversation précise par son ID
 */
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { patientId } = req.query;


    // Vérifie que l'ID patient est fourni
    if (!patientId) {
      return res.status(400).json({
        error: 'ID patient requis',
        code: 'MISSING_PATIENT_ID'
      });
    }

    const conversation = await Conversation.findById(conversationId);


    // Vérifie que la conversation existe et appartient bien au patient
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation non trouvée',
        code: 'CONVERSATION_NOT_FOUND'
      });
    }
    if (conversation.patient_id !== patientId) {
      return res.status(403).json({
        error: 'Accès non autorisé',
        code: 'UNAUTHORIZED_ACCESS'
      });
    }


    // Retourne la conversation complète
    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        patientId: conversation.patient_id,
        messages: conversation.messages,
        status: conversation.status,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at
      }
    });


  } catch (error) {
    logger.error('❌ Erreur récupération conversation:', error.message);
    // Gestion des erreurs serveur
    res.status(500).json({
      error: 'Erreur récupération conversation',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * Route GET /api/chatbot/conversations
 * Permet de lister toutes les conversations d'un patient (avec pagination)
 */
router.get('/conversations', async (req, res) => {
  try {
    const { patientId, limit = 10, page = 1 } = req.query;

    if (!patientId) {
      return res.status(400).json({
        error: 'ID patient requis',
        code: 'MISSING_PATIENT_ID'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);


    // Récupère les conversations du patient, triées par date de mise à jour
    const conversations = await Conversation.find({ patient_id: patientId })
      .sort({ updated_at: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('_id status created_at updated_at messages');

    // Ajoute un aperçu du dernier message pour chaque conversation
    const conversationsWithPreview = conversations.map(conv => ({
      conversationId: conv._id,
      status: conv.status,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
      messageCount: conv.messages.length,
      lastMessage: conv.messages.length > 0 ? {
        content: conv.messages[conv.messages.length - 1].content.substring(0, 100),
        timestamp: conv.messages[conv.messages.length - 1].timestamp,
        role: conv.messages[conv.messages.length - 1].role
      } : null
    }));


    // Retourne la liste paginée des conversations
    res.json({
      success: true,
      data: {
        conversations: conversationsWithPreview,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Conversation.countDocuments({ patient_id: patientId })
        }
      }
    });


  } catch (error) {
    logger.error('❌ Erreur liste conversations:', error.message);
    // Gestion des erreurs serveur
    res.status(500).json({
      error: 'Erreur récupération conversations',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * Route GET /api/chatbot/suggestions
 * Retourne une liste de questions suggérées par l'IA
 */
router.get('/suggestions', (req, res) => {
  try {

    // Récupère les suggestions IA
    const suggestions = aiOrchestrator.getSuggestedQuestions();
    res.json({
      success: true,
      data: {
        suggestions
      }
    });


  } catch (error) {
    logger.error('❌ Erreur suggestions:', error.message);
    // Gestion des erreurs serveur
    res.status(500).json({
      error: 'Erreur récupération suggestions',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * Route GET /api/chatbot/status
 * Permet de vérifier le statut des services IA et d'obtenir des statistiques globales
 */
router.get('/status', async (req, res) => {
  try {

    // Récupère le statut des services IA et les stats globales
    const servicesStatus = aiOrchestrator.getServicesStatus();
    const globalStats = await aiOrchestrator.getGlobalStats();
    res.json({
      success: true,
      data: {
        services: servicesStatus,
        statistics: globalStats,
        timestamp: new Date().toISOString()
      }
    });


  } catch (error) {
    logger.error('❌ Erreur statut services:', error.message);
    // Gestion des erreurs serveur
    res.status(500).json({
      error: 'Erreur vérification statut',
      code: 'INTERNAL_ERROR'
    });
  }
});


// Exporte le routeur pour l'utiliser dans l'application principale
/**
 * Route POST /api/chatbot/analyze-medical-file
 * Permet d'analyser un fichier médical et d'obtenir des recommandations
 */
router.post('/analyze-medical-file', (req, res, next) => {
  uploadMedical.single('medicalFile')(req, res, async (err) => {
    if (err) {
      logger.error('❌ Erreur upload fichier médical:', err);
      return res.status(400).json({
        error: 'Erreur lors du téléchargement du fichier',
        code: 'UPLOAD_ERROR',
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier fourni',
        code: 'MISSING_FILE'
      });
    }

    try {
      logger.info(`📋 Analyse fichier médical: ${req.file.originalname}, taille: ${req.file.size} bytes`);

      // Préparer les données du fichier pour l'IA
      const medicalFile = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype
      };

      // Analyser le fichier avec l'orchestrateur IA
      const analysisResult = await aiOrchestrator.analyzeMedicalFile(medicalFile);

      // Retourner l'analyse et les recommandations
      res.json({
        success: true,
        data: {
          recommendations: analysisResult.recommendations,
          summary: analysisResult.summary,
          riskLevel: analysisResult.riskLevel,
          metadata: {
            filename: req.file.originalname,
            fileSize: req.file.size,
            analysisTime: analysisResult.response_time_ms
          }
        }
      });

    } catch (error) {
      logger.error('❌ Erreur analyse fichier médical:', error.message);
      res.status(500).json({
        error: 'Erreur lors de l\'analyse du fichier médical',
        code: 'ANALYSIS_ERROR',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

module.exports = router;
