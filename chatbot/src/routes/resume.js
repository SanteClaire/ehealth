const express = require('express');
const { AIOrchestrator } = require('../services/ai');
const { CacheResume } = require('../models');
const winston = require('winston');

const router = express.Router();

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Initialiser l'orchestrateur IA
const aiOrchestrator = new AIOrchestrator();

/**
 * POST /api/resume/generate
 * Génère un résumé médical à partir de documents
 */
router.post('/generate', async (req, res) => {
  try {
    const { patientId, documents, forceRegenerate = false } = req.body;

    // Validation des données
    if (!patientId || typeof patientId !== 'string') {
      return res.status(400).json({
        error: 'ID patient requis',
        code: 'MISSING_PATIENT_ID'
      });
    }

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        error: 'Documents requis (minimum 1)',
        code: 'MISSING_DOCUMENTS'
      });
    }

    // Valider la structure des documents
    for (const doc of documents) {
      if (!doc.content || typeof doc.content !== 'string') {
        return res.status(400).json({
          error: 'Chaque document doit avoir un contenu',
          code: 'INVALID_DOCUMENT_STRUCTURE'
        });
      }
    }

    logger.info(`📄 Génération résumé - Patient: ${patientId}, Documents: ${documents.length}`);

    // Créer une clé de cache basée sur le contenu des documents
    const documentsHash = require('crypto')
      .createHash('md5')
      .update(JSON.stringify(documents.map(d => ({ type: d.type, content: d.content, date: d.date }))))
      .digest('hex');

    // Vérifier le cache si pas de régénération forcée
    if (!forceRegenerate) {
      const cachedResume = await CacheResume.findValidCache(patientId, documentsHash);
      
      if (cachedResume) {
        logger.info(`✅ Résumé trouvé en cache - Patient: ${patientId}`);
        
        // Incrémenter le compteur d'accès
        await cachedResume.incrementAccess();
        
        return res.json({
          success: true,
          data: {
            summary: cachedResume.summary_content,
            fromCache: true,
            metadata: {
              generatedAt: cachedResume.created_at,
              documentsCount: cachedResume.documents_count,
              accessCount: cachedResume.access_count + 1,
              cost: 0 // Pas de coût pour le cache
            }
          }
        });
      }
    }

    // Générer le résumé avec l'orchestrateur IA
    const summaryResult = await aiOrchestrator.generateMedicalSummary(documents, patientId);

    // Sauvegarder en cache
    const cacheResume = new CacheResume({
      patient_id: patientId,
      documents_hash: documentsHash,
      documents_count: documents.length,
      summary_content: summaryResult.summary,
      generation_metadata: {
        model: summaryResult.metadata.model,
        tokens_used: summaryResult.metadata.total_tokens,
        response_time_ms: summaryResult.metadata.response_time_ms,
        cost: summaryResult.metadata.total_cost
      }
    });

    await cacheResume.save();

    logger.info(`✅ Résumé généré et mis en cache - Patient: ${patientId}`);

    res.json({
      success: true,
      data: {
        summary: summaryResult.summary,
        fromCache: false,
        metadata: {
          generatedAt: new Date(),
          documentsCount: documents.length,
          responseTime: summaryResult.metadata.response_time_ms,
          cost: summaryResult.metadata.total_cost,
          tokensUsed: summaryResult.metadata.total_tokens,
          model: summaryResult.metadata.model
        }
      }
    });

  } catch (error) {
    logger.error('❌ Erreur génération résumé:', error.message);
    
    res.status(500).json({
      error: 'Erreur génération résumé',
      code: 'GENERATION_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/resume/history/:patientId
 * Récupère l'historique des résumés d'un patient
 */
router.get('/history/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const resumes = await CacheResume.find({ patient_id: patientId })
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-summary_content'); // Exclure le contenu complet pour la liste

    const total = await CacheResume.countDocuments({ patient_id: patientId });

    const resumesWithPreview = resumes.map(resume => ({
      resumeId: resume._id,
      documentsCount: resume.documents_count,
      createdAt: resume.created_at,
      accessCount: resume.access_count,
      lastAccessed: resume.last_accessed,
      isExpired: resume.isExpired(),
      preview: resume.summary_content ? resume.summary_content.substring(0, 200) + '...' : null,
      metadata: {
        model: resume.generation_metadata?.model,
        tokensUsed: resume.generation_metadata?.tokens_used,
        cost: resume.generation_metadata?.cost
      }
    }));

    res.json({
      success: true,
      data: {
        resumes: resumesWithPreview,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('❌ Erreur historique résumés:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération historique',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/resume/:resumeId
 * Récupère un résumé complet par son ID
 */
router.get('/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({
        error: 'ID patient requis',
        code: 'MISSING_PATIENT_ID'
      });
    }

    const resume = await CacheResume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        error: 'Résumé non trouvé',
        code: 'RESUME_NOT_FOUND'
      });
    }

    if (resume.patient_id !== patientId) {
      return res.status(403).json({
        error: 'Accès non autorisé',
        code: 'UNAUTHORIZED_ACCESS'
      });
    }

    // Incrémenter le compteur d'accès
    await resume.incrementAccess();

    res.json({
      success: true,
      data: {
        resumeId: resume._id,
        patientId: resume.patient_id,
        summary: resume.summary_content,
        documentsCount: resume.documents_count,
        createdAt: resume.created_at,
        accessCount: resume.access_count + 1,
        lastAccessed: new Date(),
        isExpired: resume.isExpired(),
        metadata: resume.generation_metadata
      }
    });

  } catch (error) {
    logger.error('❌ Erreur récupération résumé:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération résumé',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * DELETE /api/resume/:resumeId
 * Supprime un résumé du cache
 */
router.delete('/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        error: 'ID patient requis',
        code: 'MISSING_PATIENT_ID'
      });
    }

    const resume = await CacheResume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        error: 'Résumé non trouvé',
        code: 'RESUME_NOT_FOUND'
      });
    }

    if (resume.patient_id !== patientId) {
      return res.status(403).json({
        error: 'Accès non autorisé',
        code: 'UNAUTHORIZED_ACCESS'
      });
    }

    await CacheResume.findByIdAndDelete(resumeId);

    logger.info(`🗑️ Résumé supprimé - ID: ${resumeId}, Patient: ${patientId}`);

    res.json({
      success: true,
      message: 'Résumé supprimé avec succès'
    });

  } catch (error) {
    logger.error('❌ Erreur suppression résumé:', error.message);
    
    res.status(500).json({
      error: 'Erreur suppression résumé',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/resume/cleanup
 * Nettoie les résumés expirés (endpoint admin)
 */
router.post('/cleanup', async (req, res) => {
  try {
    const result = await CacheResume.cleanupExpired();
    
    logger.info(`🧹 Nettoyage cache résumés - ${result.deletedCount} résumés supprimés`);

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} résumés expirés supprimés`
      }
    });

  } catch (error) {
    logger.error('❌ Erreur nettoyage cache:', error.message);
    
    res.status(500).json({
      error: 'Erreur nettoyage cache',
      code: 'CLEANUP_ERROR'
    });
  }
});

/**
 * GET /api/resume/stats/global
 * Statistiques globales des résumés
 */
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await CacheResume.getGlobalStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques résumés:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
