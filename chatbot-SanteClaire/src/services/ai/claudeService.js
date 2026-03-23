const Anthropic = require('@anthropic-ai/sdk');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class ClaudeService {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.client = null;
    this.model = 'claude-3-sonnet-20240229';
    this.maxTokens = 1000;
    
    // Tarification Claude (approximative)
    this.pricing = {
      input: 0.003 / 1000,  // $0.003 per 1K tokens
      output: 0.015 / 1000  // $0.015 per 1K tokens
    };

    this.initializeClient();
  }

  initializeClient() {
    if (!this.apiKey) {
      logger.warn('⚠️ Clé API Anthropic manquante. Service Claude désactivé.');
      return;
    }

    try {
      this.client = new Anthropic({
        apiKey: this.apiKey
      });
      logger.info('✅ Service Claude initialisé');
    } catch (error) {
      logger.error('❌ Erreur initialisation Claude:', error.message);
    }
  }

  /**
   * Génère une réponse de chatbot médical
   * @param {string} userMessage - Message de l'utilisateur
   * @param {Array} conversationHistory - Historique de la conversation
   * @returns {Object} - Réponse avec métadonnées
   */
  async generateChatbotResponse(userMessage, conversationHistory = []) {
    if (!this.client) {
      throw new Error('Service Claude non disponible - Vérifiez votre clé API');
    }

    const startTime = Date.now();

    try {
      // Construction du prompt système
      const systemPrompt = this.buildSystemPrompt();
      
      // Construction de l'historique de conversation
      const messages = this.buildConversationMessages(userMessage, conversationHistory);

      logger.info(`🤖 Appel Claude pour: "${userMessage.substring(0, 50)}..."`);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: messages
      });

      const responseTime = Date.now() - startTime;
      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;

      const result = {
        content: response.content[0].text,
        metadata: {
          model: this.model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: inputTokens + outputTokens,
          response_time_ms: responseTime,
          input_cost: inputTokens * this.pricing.input,
          output_cost: outputTokens * this.pricing.output,
          total_cost: (inputTokens * this.pricing.input) + (outputTokens * this.pricing.output)
        }
      };

      logger.info(`✅ Réponse Claude générée (${responseTime}ms, ${result.metadata.total_tokens} tokens, $${result.metadata.total_cost.toFixed(4)})`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur Claude:', error.message);
      
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
    if (!this.client) {
      throw new Error('Service Claude non disponible - Vérifiez votre clé API');
    }

    const startTime = Date.now();

    try {
      const systemPrompt = this.buildSummarySystemPrompt();
      const documentsText = this.formatDocumentsForSummary(documents);

      logger.info(`📄 Génération résumé pour patient ${patientId} (${documents.length} documents)`);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1500, // Plus de tokens pour les résumés
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Voici les documents médicaux du patient à résumer :\n\n${documentsText}`
        }]
      });

      const responseTime = Date.now() - startTime;
      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;

      const result = {
        content: response.content[0].text,
        metadata: {
          model: this.model,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: inputTokens + outputTokens,
          response_time_ms: responseTime,
          input_cost: inputTokens * this.pricing.input,
          output_cost: outputTokens * this.pricing.output,
          total_cost: (inputTokens * this.pricing.input) + (outputTokens * this.pricing.output),
          documents_count: documents.length
        }
      };

      logger.info(`✅ Résumé généré (${responseTime}ms, ${result.metadata.total_tokens} tokens, $${result.metadata.total_cost.toFixed(4)})`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur génération résumé:', error.message);
      
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
   * Construit les messages de conversation pour Claude
   */
  buildConversationMessages(userMessage, conversationHistory) {
    const messages = [];

    // Ajouter l'historique (limité aux 10 derniers messages)
    const recentHistory = conversationHistory.slice(-10);
    
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
   * Vérifie si le service est disponible
   */
  isAvailable() {
    return this.client !== null;
  }

  /**
   * Obtient les statistiques d'utilisation
   */
  getUsageStats() {
    return {
      model: this.model,
      max_tokens: this.maxTokens,
      pricing: this.pricing,
      available: this.isAvailable()
    };
  }
}

module.exports = ClaudeService;
