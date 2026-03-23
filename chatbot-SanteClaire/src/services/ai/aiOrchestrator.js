const DecisionTreeService = require('./decisionTree');
const OpenAIService = require('./openaiService');
const WhisperService = require('./whisperService');
const OCRService = require('../ocrService');
const { IAUsage } = require('../../models');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class AIOrchestrator {
  constructor() {
    this.decisionTree = new DecisionTreeService();
    this.openai = new OpenAIService();
    this.whisper = new WhisperService();
    try {
      this.ocr = new OCRService();
      logger.info('✅ Service OCR initialisé');
    } catch (error) {
      logger.error('❌ Erreur initialisation OCR:', error.message);
      this.ocr = null;
    }
    // Seuils de configuration
    this.confidenceThreshold = 0.3;
    this.maxDailyCost = parseFloat(process.env.MAX_DAILY_COST) || 2.0;
    logger.info('🤖 AI Orchestrator initialisé');
  }

  /**
   * Traite un message de chatbot en utilisant la meilleure stratégie
   * @param {string} message - Message de l'utilisateur
   * @param {string} patientId - ID du patient
   * @param {Array} conversationHistory - Historique de la conversation
   * @returns {Object} - Réponse avec métadonnées
   */
  async processChatbotMessage(message, patientId, conversationHistory = []) {
    const startTime = Date.now();
    let treeResult = null;
    try {
      logger.info(`💬 Traitement message pour patient ${patientId}: "${message.substring(0, 50)}..."`);
      await this.checkDailyBudget();
      // 1. Essayer l'arbre de décision
      treeResult = this.decisionTree.analyzeMessage(message);
      if (treeResult && treeResult.confidence >= this.confidenceThreshold) {
        const responseTime = Date.now() - startTime;
        await this.logUsage({
          endpoint: 'chatbot',
          ai_service: 'decision_tree',
          model_used: 'decision_tree_v1',
          patient_id: patientId,
          input_length: message.length,
          output_length: treeResult.response.length,
          response_time_ms: responseTime,
          success: true,
          input_cost: 0,
          output_cost: 0
        });
        return {
          response: treeResult.response,
          source: 'decision_tree',
          category: treeResult.category,
          confidence: treeResult.confidence,
          metadata: {
            response_time_ms: responseTime,
            cost: 0,
            tokens_used: 0
          }
        };
      }
      // 2. Sinon, essayer OpenAI avec gestion d'erreur
      if (this.openai.isAvailable()) {
        try {
          logger.info('🧠 Redirection vers OpenAI');
          const openaiResult = await this.openai.generateChatbotResponse(message, conversationHistory);
          const responseTime = Date.now() - startTime;
          await this.logUsage({
            endpoint: 'chatbot',
            ai_service: 'openai',
            model_used: openaiResult.metadata.model,
            patient_id: patientId,
            input_length: message.length,
            output_length: openaiResult.content.length,
            tokens_used: openaiResult.metadata.total_tokens,
            response_time_ms: responseTime,
            success: true,
            input_cost: 0,
            output_cost: 0
          });
          return {
            response: openaiResult.content,
            source: 'openai',
            category: 'ai_generated',
            confidence: 1.0,
            metadata: {
              response_time_ms: responseTime,
              cost: 0,
              tokens_used: openaiResult.metadata.total_tokens,
              model: openaiResult.metadata.model
            }
          };
        } catch (openaiError) {
          logger.warn('⚠️ Erreur OpenAI, utilisation du fallback:', openaiError.message);
        }
      }
      
      // 3. Fallback: réponse par défaut si aucun service n'a fonctionné
      throw new Error('Service OpenAI indisponible et aucune réponse dans l\'arbre de décision');
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage({
        endpoint: 'chatbot',
        ai_service: treeResult ? 'openai' : 'decision_tree',
        model_used: 'error',
        patient_id: patientId,
        input_length: message.length,
        response_time_ms: responseTime,
        success: false,
        error_message: error.message,
        input_cost: 0,
        output_cost: 0
      });
      logger.error('❌ Erreur traitement message:', error.message);
      return {
        response: "Je suis désolé, je rencontre actuellement des difficultés techniques. Pour une assistance immédiate, veuillez contacter votre médecin ou le 15 en cas d'urgence.",
        source: 'fallback',
        category: 'error',
        metadata: {
          response_time_ms: responseTime,
          cost: 0,
          tokens_used: 0
        }
      };
    }
  }

  /**
   * Génère un résumé médical
   * @param {Array} documents - Documents médicaux
   * @param {string} patientId - ID du patient
   * @returns {Object} - Résumé avec métadonnées
   */
  async generateMedicalSummary(documents, patientId) {
    const startTime = Date.now();
    try {
      logger.info(`📄 Génération résumé pour patient ${patientId} (${documents.length} documents)`);
      await this.checkDailyBudget();
      if (!this.openai.isAvailable()) {
        throw new Error('Service OpenAI non disponible pour la génération de résumés');
      }
      const openaiResult = await this.openai.generateChatbotResponse(
        'Peux-tu générer un résumé médical à partir de ces documents ?\n' +
        documents.map(doc => doc.content).join('\n'),
        []
      );
      const responseTime = Date.now() - startTime;
      await this.logUsage({
        endpoint: 'resume',
        ai_service: 'openai',
        model_used: openaiResult.metadata.model,
        patient_id: patientId,
        input_length: documents.reduce((sum, doc) => sum + doc.content.length, 0),
        output_length: openaiResult.content.length,
        tokens_used: openaiResult.metadata.total_tokens,
        response_time_ms: responseTime,
        success: true,
        input_cost: 0,
        output_cost: 0
      });
      return {
        summary: openaiResult.content,
        metadata: {
          ...openaiResult.metadata,
          response_time_ms: responseTime
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage({
        endpoint: 'resume',
        ai_service: 'openai',
        model_used: 'error',
        patient_id: patientId,
        response_time_ms: responseTime,
        success: false,
        error_message: error.message,
        input_cost: 0,
        output_cost: 0
      });
      logger.error('❌ Erreur génération résumé:', error.message);
      throw error;
    }
  }

  /**
   * Transcrit un fichier audio
   * @param {Object} audioFile - Fichier audio
   * @param {string} patientId - ID du patient (optionnel)
   * @returns {Object} - Transcription avec métadonnées
   */
  async transcribeAudio(audioFile, patientId = null) {
    const startTime = Date.now();
    try {
      logger.info(`🎙️ Transcription audio${patientId ? ` pour patient ${patientId}` : ''}`);
      await this.checkDailyBudget();
      
      // Utiliser Whisper pour la transcription
      const transcriptionResult = await this.whisper.transcribeAudio(audioFile, { language: 'fr' });
      const responseTime = Date.now() - startTime;
      
      await this.logUsage({
        endpoint: 'transcription',
        ai_service: 'openai',
        model_used: 'whisper-1',
        patient_id: patientId,
        input_length: audioFile.size || 0,
        output_length: transcriptionResult.text.length,
        tokens_used: 0,
        response_time_ms: responseTime,
        success: true,
        input_cost: transcriptionResult.cost || 0,
        output_cost: 0
      });
      
      return {
        transcription: transcriptionResult.text,
        metadata: {
          ...transcriptionResult,
          response_time_ms: responseTime
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage({
        endpoint: 'transcription',
        ai_service: 'openai',
        model_used: 'whisper-1',
        patient_id: patientId,
        response_time_ms: responseTime,
        success: false,
        input_cost: 0,
        output_cost: 0
      });
      throw error;
    }
  }

  /**
   * Analyse un fichier médical et fournit des recommandations
   * @param {Object} medicalFile - Fichier médical à analyser
   * @returns {Object} - Analyse avec recommandations
   */
  async analyzeMedicalFile(medicalFile) {
    const startTime = Date.now();
    try {
      logger.info(`📋 Analyse fichier médical: ${medicalFile.originalName}`);
      
      // Extraire le texte du fichier selon son type
      let fileContent = '';
      let extractionMethod = '';
      
      if (medicalFile.mimetype === 'text/plain') {
        fileContent = medicalFile.buffer.toString('utf-8');
        extractionMethod = 'lecture directe';
      } else if (medicalFile.mimetype.startsWith('image/')) {
        // Utiliser OCR pour les images
        logger.info('🔍 Extraction de texte depuis l\'image avec OCR...');
        const ocrResult = await this.ocr.extractText(medicalFile.buffer);
        
        if (ocrResult.quality.isReadable) {
          fileContent = ocrResult.text;
          extractionMethod = `OCR (confiance: ${ocrResult.confidence}%)`;
          logger.info(`✅ Texte extrait: ${ocrResult.wordCount} mots, qualité: ${ocrResult.quality.level}`);
        } else {
          throw new Error(`OCR de mauvaise qualité: ${ocrResult.confidence}% de confiance. Image trop floue ou illisible.`);
        }
      } else if (medicalFile.mimetype === 'application/pdf') {
        // Pour les PDF, extraction simple (implémentation de base pour l'instant)
        fileContent = `[PDF médical: ${medicalFile.originalName}] - Extraction PDF requise`;
        extractionMethod = 'détection PDF';
      } else {
        throw new Error(`Format de fichier non supporté: ${medicalFile.mimetype}`);
      }

      // Utiliser OpenAI pour analyser le contenu
      const analysisPrompt = `En tant qu'assistant médical professionnel, analysez ce contenu médical et fournissez des recommandations:

Méthode d'extraction: ${extractionMethod}
Fichier: ${medicalFile.originalName}

Contenu extrait:
${fileContent}

Veuillez fournir:
1. Un résumé concis des informations médicales importantes
2. Des recommandations spécifiques basées sur le contenu
3. Une évaluation du niveau de risque (faible/modéré/élevé)
4. Des suggestions de suivi si nécessaire

Répondez de manière structurée et responsable. Si le contenu semble incomplet ou de mauvaise qualité, mentionnez-le.`;

      const analysisResult = await this.openai.generateChatbotResponse(analysisPrompt, []);
      const responseTime = Date.now() - startTime;

      // Analyser la réponse pour extraire les informations structurées
      const analysis = this.parseMedicalAnalysis(analysisResult.content);

      await this.logUsage({
        endpoint: 'medical_analysis',
        ai_service: 'openai',
        model_used: analysisResult.metadata.model,
        patient_id: 'anonymous',
        input_length: fileContent.length,
        output_length: analysisResult.content.length,
        tokens_used: analysisResult.metadata.total_tokens,
        response_time_ms: responseTime,
        success: true,
        input_cost: 0,
        output_cost: 0
      });

      return {
        ...analysis,
        response_time_ms: responseTime,
        original_filename: medicalFile.originalName,
        file_size_bytes: medicalFile.buffer.length,
        extraction_method: extractionMethod,
        extracted_text_length: fileContent.length
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur analyse fichier médical:', error.message);
      logger.error('❌ Stack trace:', error.stack);
      
      await this.logUsage({
        endpoint: 'medical_analysis',
        ai_service: 'openai',
        model_used: 'error',
        patient_id: 'anonymous',
        response_time_ms: responseTime,
        success: false,
        input_cost: 0,
        output_cost: 0
      });
      
      throw error;
    }
  }

  /**
   * Analyse la réponse d'OpenAI pour extraire les informations médicales structurées
   */
  parseMedicalAnalysis(analysisText) {
    const analysis = {
      summary: '',
      recommendations: '',
      riskLevel: 'non évalué'
    };

    // Extraire le résumé
    const summaryMatch = analysisText.match(/résumé[^:]*:\s*([^\n]+)/i);
    if (summaryMatch) {
      analysis.summary = summaryMatch[1].trim();
    }

    // Extraire les recommandations
    const recommendationsMatch = analysisText.match(/recommandations[^:]*:\s*([^\n]+)/i);
    if (recommendationsMatch) {
      analysis.recommendations = recommendationsMatch[1].trim();
    }

    // Extraire le niveau de risque
    const riskMatch = analysisText.match(/risque[^:]*:\s*([^\n]+)/i);
    if (riskMatch) {
      const risk = riskMatch[1].toLowerCase().trim();
      if (risk.includes('élevé') || risk.includes('high')) {
        analysis.riskLevel = 'élevé';
      } else if (risk.includes('modéré') || risk.includes('medium')) {
        analysis.riskLevel = 'modéré';
      } else if (risk.includes('faible') || risk.includes('low')) {
        analysis.riskLevel = 'faible';
      }
    }

    // Si aucun champ structuré trouvé, utiliser le texte complet comme recommandations
    if (!analysis.summary && !analysis.recommendations) {
      analysis.recommendations = analysisText.substring(0, 500) + '...';
      analysis.summary = 'Analyse médicale complète';
    }

    return analysis;
  }
  async checkDailyBudget() {
    try {
      const costAlert = await IAUsage.getCostAlert(this.maxDailyCost);
      
      if (costAlert.length > 0 && costAlert[0].should_alert) {
        const todayCost = costAlert[0].total_cost_today;
        logger.warn(`⚠️ Budget quotidien atteint: $${todayCost.toFixed(4)} / $${this.maxDailyCost}`);
        
        if (todayCost >= this.maxDailyCost * 1.1) { // 110% du budget
          throw new Error(`Budget quotidien dépassé: $${todayCost.toFixed(4)}`);
        }
      }
    } catch (error) {
      if (error.message.includes('Budget quotidien dépassé')) {
        throw error;
      }
      // Ignorer les autres erreurs de vérification de budget
      logger.warn('⚠️ Impossible de vérifier le budget quotidien:', error.message);
    }
  }

  /**
   * Log l'utilisation dans la base de données
   */
  async logUsage(data) {
    try {
      // Désactivation temporaire du logging pour éviter les erreurs
      // await IAUsage.logUsage(data);
      logger.info('📊 Usage logging désactivé temporairement');
    } catch (error) {
      logger.error('❌ Erreur logging usage:', error.message);
      // Ne pas faire échouer la requête principale pour un problème de logging
    }
  }

  /**
   * Obtient les statistiques globales
   */
  async getGlobalStats() {
    try {
      const [dailyStats, treeStats] = await Promise.all([
        IAUsage.getDailyStats(),
        Promise.resolve(this.decisionTree.getStatistics())
      ]);

      return {
        daily_usage: dailyStats,
        decision_tree: treeStats,
        services: {
          openai: this.openai ? { available: this.openai.isAvailable() } : false,
          decision_tree: treeStats
        },
        budget: {
          max_daily: this.maxDailyCost,
          confidence_threshold: this.confidenceThreshold
        }
      };
    } catch (error) {
      logger.error('❌ Erreur récupération statistiques:', error.message);
      throw error;
    }
  }
  // ...existing code...
  /**
   * Obtient les questions suggérées
   */
  getSuggestedQuestions() {
    return this.decisionTree.getSuggestedQuestions();
  }

  /**
   * Vérifie la disponibilité des services
   */
  getServicesStatus() {
    return {
      decision_tree: true,
      openai: this.openai ? this.openai.isAvailable() : false,
      orchestrator: true
    };
  }
}

module.exports = AIOrchestrator;
