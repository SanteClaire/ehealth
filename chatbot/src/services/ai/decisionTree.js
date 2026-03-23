const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Base de connaissances médicales - Questions fréquentes
const medicalKnowledgeBase = {
  // Catégorie : Médicaments et posologie
  medicaments: {
    keywords: [
      'médicament', 'medicament', 'posologie', 'dose', 'comprimé', 'comprime', 
      'pilule', 'gélule', 'gelule', 'sirop', 'pommade', 'crème', 'creme',
      'paracétamol', 'paracetamol', 'ibuprofène', 'ibuprofen', 'aspirine',
      'doliprane', 'advil', 'nurofen', 'effervescent'
    ],
    responses: [
      {
        triggers: ['posologie', 'dose', 'combien', 'quantité', 'quantite'],
        response: "⚠️ **Important** : Je ne peux pas vous donner de conseils sur la posologie des médicaments. Seul votre médecin ou pharmacien peut déterminer la dose appropriée selon votre situation.\n\n📞 **Contactez** :\n• Votre médecin traitant\n• Votre pharmacien\n• Le 15 en cas d'urgence"
      },
      {
        triggers: ['oublié', 'oublie', 'manqué', 'manque', 'raté', 'rate'],
        response: "💊 **Oubli de médicament** :\n\n1. **Ne doublez jamais** la dose suivante\n2. **Prenez-le dès que possible** si l'oubli est récent\n3. **Sautez la dose** si c'est presque l'heure de la suivante\n\n⚠️ **En cas de doute**, contactez votre pharmacien ou médecin."
      },
      {
        triggers: ['effet', 'secondaire', 'réaction', 'reaction', 'allergie'],
        response: "🚨 **Effets secondaires** :\n\n**Arrêtez immédiatement** le médicament et :\n• **Effets graves** (difficultés respiratoires, gonflement) → **Appelez le 15**\n• **Effets modérés** → Contactez votre médecin rapidement\n• **Effets légers** → Consultez la notice, contactez votre pharmacien"
      }
    ]
  },

  // Catégorie : Rendez-vous et consultations
  rendezvous: {
    keywords: [
      'rendez-vous', 'rendez vous', 'rdv', 'consultation', 'consulter',
      'médecin', 'medecin', 'docteur', 'spécialiste', 'specialiste',
      'annuler', 'reporter', 'changer'
    ],
    responses: [
      {
        triggers: ['prendre', 'avoir', 'obtenir', 'demander'],
        response: "📅 **Prendre rendez-vous** :\n\n• **En ligne** : Utilisez notre plateforme de réservation\n• **Par téléphone** : Appelez le secrétariat médical\n• **Urgences non vitales** : Consultez un médecin de garde\n\n⏰ **Délais moyens** :\n• Médecin généraliste : 2-7 jours\n• Spécialiste : 2-8 semaines"
      },
      {
        triggers: ['annuler', 'reporter', 'changer', 'modifier', 'déplacer', 'deplacer'],
        response: "📞 **Modifier un rendez-vous** :\n\n1. **Contactez rapidement** le secrétariat\n2. **Prévenez au moins 24h à l'avance** si possible\n3. **Proposez des créneaux** alternatifs\n\n💡 **Astuce** : Certains créneaux se libèrent en dernière minute."
      },
      {
        triggers: ['urgence', 'urgent', 'grave', 'emergency'],
        response: "🚨 **En cas d'urgence** :\n\n• **Urgence vitale** → **15 (SAMU)**\n• **Urgence non vitale** → **SOS Médecins** ou **Médecin de garde**\n• **Empoisonnement** → **Centre antipoison**\n• **Problème psychologique** → **3114 (numéro national)**"
      }
    ]
  },

  // Catégorie : Symptômes courants
  symptomes: {
    keywords: [
      'mal', 'douleur', 'fièvre', 'fievre', 'température', 'temperature',
      'tête', 'tete', 'gorge', 'ventre', 'estomac', 'nausée', 'nausee',
      'vomissement', 'diarrhée', 'diarrhee', 'constipation', 'toux',
      'rhume', 'grippe', 'fatigue', 'vertiges', 'étourdissement'
    ],
    responses: [
      {
        triggers: ['fièvre', 'fievre', 'température', 'temperature', 'chaud'],
        response: "🌡️ **Fièvre** :\n\n**Mesures générales** :\n• Buvez beaucoup d'eau\n• Reposez-vous\n• Habillez-vous légèrement\n• Prenez votre température régulièrement\n\n⚠️ **Consultez si** :\n• Fièvre > 39°C\n• Persistance > 3 jours\n• Difficultés respiratoires\n• Convulsions"
      },
      {
        triggers: ['tête', 'tete', 'céphalée', 'cephalee', 'migraine', 'crâne', 'crane'],
        response: "🤕 **Mal de tête** :\n\n**Conseils** :\n• Reposez-vous dans un endroit calme et sombre\n• Appliquez du froid sur le front\n• Hydratez-vous\n• Évitez les écrans\n\n⚠️ **Consultez rapidement si** :\n• Maux de tête soudains et intenses\n• Accompagnés de fièvre, vomissements\n• Troubles de la vision"
      },
      {
        triggers: ['gorge', 'avaler', 'déglutition', 'deglutition'],
        response: "😷 **Mal de gorge** :\n\n**Soulagement** :\n• Gargarismes avec eau salée tiède\n• Miel et citron dans une boisson chaude\n• Pastilles pour la gorge\n• Évitez les aliments irritants\n\n⚠️ **Consultez si** :\n• Difficultés à avaler\n• Fièvre élevée\n• Ganglions très gonflés"
      }
    ]
  },

  // Catégorie : Prévention et hygiène
  prevention: {
    keywords: [
      'prévention', 'prevention', 'hygiène', 'hygiene', 'vaccin', 'vaccination',
      'lavage', 'mains', 'désinfection', 'desinfection', 'masque',
      'alimentation', 'sport', 'exercice', 'sommeil', 'stress'
    ],
    responses: [
      {
        triggers: ['mains', 'lavage', 'laver', 'désinfecter', 'desinfecter'],
        response: "🧼 **Hygiène des mains** :\n\n**Lavage efficace** :\n1. Eau et savon pendant 30 secondes minimum\n2. Frottez paumes, dos, entre les doigts, ongles\n3. Rincez et séchez avec une serviette propre\n\n**Gel hydroalcoolique** : Alternative si pas d'eau disponible\n\n⏰ **Quand** : Avant les repas, après les toilettes, en rentrant"
      },
      {
        triggers: ['vaccin', 'vaccination', 'immunisation'],
        response: "💉 **Vaccination** :\n\n**Importance** :\n• Protection individuelle et collective\n• Prévention de maladies graves\n• Respect du calendrier vaccinal\n\n📋 **Vérifiez** votre carnet de vaccination avec votre médecin\n🔄 **Rappels** : Certains vaccins nécessitent des rappels réguliers"
      },
      {
        triggers: ['alimentation', 'manger', 'nutrition', 'régime', 'regime'],
        response: "🥗 **Alimentation équilibrée** :\n\n**Principes** :\n• 5 fruits et légumes par jour\n• Hydratation suffisante (1,5L d'eau/jour)\n• Limitez sucre, sel, graisses saturées\n• Repas réguliers\n\n💡 **Conseil** : Consultez un nutritionniste pour un suivi personnalisé"
      }
    ]
  },

  // Catégorie : Urgences médicales
  urgences: {
    keywords: [
      'urgence', 'urgent', 'grave', 'emergency', 'samu', 'pompier',
      'accident', 'blessure', 'saignement', 'inconscient', 'malaise',
      'crise', 'convulsion', 'allergie', 'choc', 'arrêt', 'arret'
    ],
    responses: [
      {
        triggers: ['urgence', 'urgent', 'grave', 'emergency', 'aide'],
        response: "🚨 **URGENCES MÉDICALES** :\n\n**APPELEZ IMMÉDIATEMENT** :\n• **15** - SAMU (urgences médicales)\n• **18** - Pompiers (accidents, incendies)\n• **112** - Numéro d'urgence européen\n\n**Signes d'urgence vitale** :\n• Perte de conscience\n• Difficultés respiratoires graves\n• Douleur thoracique intense\n• Saignement important\n• Convulsions"
      },
      {
        triggers: ['saignement', 'sang', 'hémorragie', 'hemorragie', 'blessure'],
        response: "🩸 **Saignement** :\n\n**Actions immédiates** :\n1. **Compression directe** sur la plaie avec un linge propre\n2. **Surélevez** le membre si possible\n3. **Maintenez la pression** jusqu'aux secours\n\n🚨 **Appelez le 15** si :\n• Saignement abondant\n• Ne s'arrête pas après 10 minutes\n• Plaie profonde"
      }
    ]
  }
};

class DecisionTreeService {
  constructor() {
    this.knowledgeBase = medicalKnowledgeBase;
  }

  /**
   * Analyse un message et tente de trouver une réponse appropriée
   * @param {string} message - Message de l'utilisateur
   * @returns {Object|null} - Réponse trouvée ou null
   */
  analyzeMessage(message) {
    if (!message || typeof message !== 'string') {
      return null;
    }

    const normalizedMessage = this.normalizeText(message);
    logger.info(`Analyse du message: "${message}"`);

    // Parcourir chaque catégorie
    for (const [categoryName, category] of Object.entries(this.knowledgeBase)) {
      // Vérifier si le message contient des mots-clés de cette catégorie
      const hasKeyword = category.keywords.some(keyword => 
        normalizedMessage.includes(this.normalizeText(keyword))
      );

      if (hasKeyword) {
        logger.info(`Catégorie détectée: ${categoryName}`);
        
        // Chercher une réponse spécifique dans cette catégorie
        const response = this.findSpecificResponse(normalizedMessage, category.responses);
        if (response) {
          return {
            category: categoryName,
            response: response.response,
            confidence: this.calculateConfidence(normalizedMessage, response.triggers),
            source: 'decision_tree'
          };
        }
      }
    }

    logger.info('Aucune réponse trouvée dans l\'arbre de décision - réponse par défaut');
    return {
      response: "Je suis un assistant médical. Pour des questions spécifiques, veuillez consulter un professionnel de santé. Comment puis-je vous aider avec des informations générales sur la santé ?",
      category: 'default',
      confidence: 0.1,
      metadata: {
        response_time_ms: 0,
        cost: 0,
        tokens_used: 0
      }
    };
  }

  /**
   * Trouve une réponse spécifique basée sur les déclencheurs
   * @param {string} normalizedMessage - Message normalisé
   * @param {Array} responses - Liste des réponses possibles
   * @returns {Object|null} - Réponse trouvée ou null
   */
  findSpecificResponse(normalizedMessage, responses) {
    let bestMatch = null;
    let bestScore = 0;

    for (const responseObj of responses) {
      const score = this.calculateMatchScore(normalizedMessage, responseObj.triggers);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = responseObj;
      }
    }

    // Retourner la meilleure correspondance si le score est suffisant
    return bestScore > 0 ? bestMatch : null;
  }

  /**
   * Calcule un score de correspondance entre le message et les déclencheurs
   * @param {string} message - Message normalisé
   * @param {Array} triggers - Liste des déclencheurs
   * @returns {number} - Score de correspondance
   */
  calculateMatchScore(message, triggers) {
    let score = 0;
    for (const trigger of triggers) {
      if (message.includes(this.normalizeText(trigger))) {
        score += 1;
      }
    }
    return score;
  }

  /**
   * Calcule la confiance de la réponse
   * @param {string} message - Message normalisé
   * @param {Array} triggers - Déclencheurs utilisés
   * @returns {number} - Score de confiance (0-1)
   */
  calculateConfidence(message, triggers) {
    const matchCount = triggers.filter(trigger => 
      message.includes(this.normalizeText(trigger))
    ).length;
    
    return Math.min(matchCount / triggers.length, 1);
  }

  /**
   * Normalise le texte pour la comparaison
   * @param {string} text - Texte à normaliser
   * @returns {string} - Texte normalisé
   */
  normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^\w\s]/g, ' ') // Remplace la ponctuation par des espaces
      .replace(/\s+/g, ' ') // Normalise les espaces
      .trim();
  }

  /**
   * Obtient des suggestions de questions fréquentes
   * @returns {Array} - Liste des questions suggérées
   */
  getSuggestedQuestions() {
    return [
      "Comment prendre mes médicaments ?",
      "J'ai de la fièvre, que faire ?",
      "Comment prendre rendez-vous ?",
      "J'ai mal à la tête",
      "Comment bien se laver les mains ?",
      "Que faire en cas d'urgence ?"
    ];
  }

  /**
   * Obtient les statistiques d'utilisation de l'arbre de décision
   * @returns {Object} - Statistiques
   */
  getStatistics() {
    const totalCategories = Object.keys(this.knowledgeBase).length;
    const totalResponses = Object.values(this.knowledgeBase)
      .reduce((sum, category) => sum + category.responses.length, 0);
    const totalKeywords = Object.values(this.knowledgeBase)
      .reduce((sum, category) => sum + category.keywords.length, 0);

    return {
      categories: totalCategories,
      responses: totalResponses,
      keywords: totalKeywords,
      categories_list: Object.keys(this.knowledgeBase)
    };
  }
}

module.exports = DecisionTreeService;
