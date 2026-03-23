const axios = require('axios');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class LMStudioService {
  constructor() {
    // Configuration LM Studio (API locale compatible OpenAI)
    this.baseURL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
    this.model = process.env.LM_STUDIO_MODEL || 'local-model';
    this.maxTokens = parseInt(process.env.LM_STUDIO_MAX_TOKENS) || 1000;
    this.temperature = parseFloat(process.env.LM_STUDIO_TEMPERATURE) || 0.3;
    
    // Pas de coût avec LM Studio local !
    this.pricing = {
      input: 0,
      output: 0,
      total: 0
    };

    this.timeout = 30000; // 30 secondes timeout
    this.isConnected = false;

    this.initializeConnection();
  }

  async initializeConnection() {
    try {
      await this.checkConnection();
      logger.info('✅ Service LM Studio initialisé et connecté');
    } catch (error) {
      logger.warn('⚠️ LM Studio non disponible:', error.message);
      logger.info('💡 Assurez-vous que LM Studio est démarré sur http://localhost:1234');
    }
  }

  /**
   * Vérifie la connexion avec LM Studio
   */
  async checkConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        timeout: 5000
      });
      
      this.isConnected = true;
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        this.model = response.data.data[0].id;
        logger.info(`🤖 Modèle détecté: ${this.model}`);
      }
      
      return true;
    } catch (error) {
      this.isConnected = false;
      throw new Error(`Connexion LM Studio échouée: ${error.message}`);
    }
  }

  /**
   * Génère une réponse de chatbot médical
   * @param {string} userMessage - Message de l'utilisateur
   * @param {Array} conversationHistory - Historique de la conversation
   * @returns {Object} - Réponse avec métadonnées
   */
  async generateChatbotResponse(userMessage, conversationHistory = []) {
    if (!this.isConnected) {
      await this.checkConnection();
    }

    const startTime = Date.now();

    try {
      // Construction du prompt système
      const systemPrompt = this.buildSystemPrompt();
      
      // Construction des messages
      const messages = this.buildConversationMessages(userMessage, conversationHistory, systemPrompt);

      logger.info(`🤖 Appel LM Studio pour: "${userMessage.substring(0, 50)}..."`);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      const responseText = response.data.choices[0].message.content;

      // Estimation des tokens (approximative)
      const inputTokens = this.estimateTokens(JSON.stringify(messages));
      const outputTokens = this.estimateTokens(responseText);

      const result = {
        content: responseText,
        metadata: {
          model: this.model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: inputTokens + outputTokens,
          response_time_ms: responseTime,
          input_cost: 0, // Gratuit avec LM Studio !
          output_cost: 0,
          total_cost: 0,
          source: 'lm_studio'
        }
      };

      logger.info(`✅ Réponse LM Studio générée (${responseTime}ms, ~${result.metadata.total_tokens} tokens, GRATUIT)`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur LM Studio:', error.message);
      
      // Marquer comme déconnecté si erreur de connexion
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        this.isConnected = false;
      }
      
      throw {
        error: error.message,
        response_time_ms: responseTime,
        cost: 0
      };
    }
  }

  /**
   * Génère un résumé médical à partir de documents
   * @param {Array} documents - Liste des documents médicaux
   * @param {string} patientId - ID du patient
   * @returns {Object} - Résumé avec métadonnées
   */
  async generateMedicalSummary(documents, patientId) {
    if (!this.isConnected) {
      await this.checkConnection();
    }

    const startTime = Date.now();

    try {
      const systemPrompt = this.buildSummarySystemPrompt();
      const documentsText = this.formatDocumentsForSummary(documents);

      logger.info(`📄 Génération résumé LM Studio pour patient ${patientId} (${documents.length} documents)`);

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Voici les documents médicaux du patient à résumer :\n\n${documentsText}`
        }
      ];

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: messages,
        max_tokens: 1500, // Plus de tokens pour les résumés
        temperature: 0.2, // Plus conservateur pour les résumés médicaux
        stream: false
      }, {
        timeout: this.timeout * 2, // Plus de temps pour les résumés
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      const responseText = response.data.choices[0].message.content;

      const inputTokens = this.estimateTokens(JSON.stringify(messages));
      const outputTokens = this.estimateTokens(responseText);

      const result = {
        content: responseText,
        metadata: {
          model: this.model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: inputTokens + outputTokens,
          response_time_ms: responseTime,
          input_cost: 0,
          output_cost: 0,
          total_cost: 0,
          documents_count: documents.length,
          source: 'lm_studio'
        }
      };

      logger.info(`✅ Résumé LM Studio généré (${responseTime}ms, ~${result.metadata.total_tokens} tokens, GRATUIT)`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur génération résumé LM Studio:', error.message);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        this.isConnected = false;
      }
      
      throw {
        error: error.message,
        response_time_ms: responseTime,
        cost: 0
      };
    }
  }

  /**
   * Construit le prompt système pour le chatbot
   */
  buildSystemPrompt() {
    return `Tu es un assistant médical intelligent pour SantéClaire, une plateforme de santé française.

RÔLE ET RESPONSABILITÉS :
- Tu aides les patients à comprendre leurs symptômes et questions de santé
- Tu fournis des informations médicales générales et des conseils de première ligne
- Tu es empathique, professionnel et rassurant

CE QUE TU PEUX FAIRE :
✅ Expliquer des symptômes courants et leurs causes possibles
✅ Donner des conseils de premiers secours et de prévention
✅ Orienter vers les bons professionnels de santé
✅ Expliquer des procédures médicales simples
✅ Rassurer et soutenir émotionnellement

CE QUE TU NE PEUX PAS FAIRE :
❌ Diagnostiquer des maladies
❌ Prescrire des médicaments ou des dosages
❌ Remplacer une consultation médicale
❌ Interpréter des résultats d'examens médicaux
❌ Donner des conseils sur l'arrêt de traitements

URGENCES :
- Pour toute urgence vitale, dirige IMMÉDIATEMENT vers le 15 (SAMU)
- Signes d'urgence : douleur thoracique, difficultés respiratoires, perte de conscience, saignements importants

STYLE DE COMMUNICATION :
- Utilise un ton professionnel mais chaleureux
- Sois concis mais complet (maximum 200 mots)
- Utilise des emojis médicaux appropriés (🩺 💊 🏥 ⚠️)
- Structure tes réponses avec des puces quand nécessaire
- Termine toujours par une recommandation d'action claire

IMPORTANT : Rappelle toujours que tes conseils ne remplacent pas une consultation médicale professionnelle.`;
  }

  /**
   * Construit le prompt système pour les résumés médicaux
   */
  buildSummarySystemPrompt() {
    return `Tu es un assistant médical spécialisé dans la synthèse de dossiers médicaux pour les professionnels de santé.

OBJECTIF :
Créer un résumé médical structuré et professionnel à partir des documents fournis.

FORMAT REQUIS :
## 🏥 RÉSUMÉ MÉDICAL

### 📋 INFORMATIONS GÉNÉRALES
- Âge et sexe (si disponible)
- Date du résumé

### 🩺 PROBLÈMES DE SANTÉ ACTUELS
- Pathologies principales
- Symptômes récents

### 💊 TRAITEMENTS EN COURS
- Médicaments actuels avec posologie
- Traitements non médicamenteux

### ⚠️ ALLERGIES ET CONTRE-INDICATIONS
- Allergies connues
- Intolérances médicamenteuses

### 📈 ANTÉCÉDENTS MÉDICAUX
- Maladies passées significatives
- Interventions chirurgicales
- Hospitalisations

### 🔍 EXAMENS RÉCENTS
- Résultats d'analyses importantes
- Imageries médicales

### 💡 POINTS D'ATTENTION
- Éléments nécessitant un suivi
- Recommandations

CONSIGNES :
- Sois factuel et précis
- Utilise un vocabulaire médical approprié
- Maximum 300 mots
- Mets en évidence les informations critiques
- Si des informations manquent, indique-le clairement`;
  }

  /**
   * Construit les messages de conversation
   */
  buildConversationMessages(userMessage, conversationHistory, systemPrompt) {
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Ajouter l'historique (limité aux 8 derniers messages pour LM Studio)
    const recentHistory = conversationHistory.slice(-8);
    
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }

    // Ajouter le message actuel
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  /**
   * Formate les documents pour le résumé
   */
  formatDocumentsForSummary(documents) {
    return documents.map((doc, index) => {
      return `--- DOCUMENT ${index + 1} ---
Type: ${doc.type || 'Non spécifié'}
Date: ${doc.date || 'Non spécifiée'}
Contenu:
${doc.content}

`;
    }).join('\n');
  }

  /**
   * Estime le nombre de tokens (approximatif)
   * @param {string} text - Texte à analyser
   * @returns {number} - Nombre de tokens estimé
   */
  estimateTokens(text) {
    // Estimation approximative : 1 token ≈ 4 caractères pour le français
    return Math.ceil(text.length / 4);
  }

  /**
   * Vérifie si le service est disponible
   */
  isAvailable() {
    return this.isConnected;
  }

  /**
   * Obtient les statistiques d'utilisation
   */
  getUsageStats() {
    return {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      base_url: this.baseURL,
      pricing: this.pricing,
      available: this.isConnected,
      cost_advantage: 'GRATUIT - Aucun coût API !'
    };
  }

  /**
   * Obtient les modèles disponibles
   */
  async getAvailableModels() {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        timeout: 5000
      });
      
      return response.data.data || [];
    } catch (error) {
      logger.error('❌ Erreur récupération modèles:', error.message);
      return [];
    }
  }

  /**
   * Change le modèle utilisé
   */
  setModel(modelName) {
    this.model = modelName;
    logger.info(`🔄 Modèle changé pour: ${modelName}`);
  }
}

module.exports = LMStudioService;
