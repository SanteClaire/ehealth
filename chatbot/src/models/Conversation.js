
// Importe mongoose pour la gestion des schémas et modèles MongoDB
const mongoose = require('mongoose');


// Schéma d'un message dans une conversation
const messageSchema = new mongoose.Schema({
  role: {
    type: String, // Rôle de l'émetteur (utilisateur ou assistant)
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String, // Contenu du message
    required: true,
    maxlength: 2000
  },
  timestamp: {
    type: Date, // Date d'envoi
    default: Date.now
  },
  metadata: {
    source: {
      type: String, // Source de la réponse IA
      enum: ['decision_tree', 'lm_studio', 'claude_ai', 'fallback', 'openai'],
      default: 'decision_tree'
    },
    tokens_used: {
      type: Number, // Nombre de tokens utilisés
      default: 0
    },
    cost: {
      type: Number, // Coût associé à la génération du message
      default: 0
    }
  }
});


// Schéma d'une conversation complète
const conversationSchema = new mongoose.Schema({
  patient_id: {
    type: String, // Identifiant du patient
    required: true,
    index: true
  },
  messages: [messageSchema], // Liste des messages de la conversation
  status: {
    type: String, // Statut de la conversation
    enum: ['active', 'closed', 'archived'],
    default: 'active'
  },
  created_at: {
    type: Date, // Date de création
    default: Date.now
  },
  updated_at: {
    type: Date, // Date de dernière modification
    default: Date.now
  },
  last_activity: {
    type: Date, // Date de dernière activité
    default: Date.now
  },
  total_messages: {
    type: Number, // Nombre total de messages
    default: 0
  },
  total_tokens: {
    type: Number, // Nombre total de tokens utilisés
    default: 0
  },
  total_cost: {
    type: Number, // Coût total de la conversation
    default: 0
  }
});


// Index pour optimiser les requêtes fréquentes
conversationSchema.index({ patient_id: 1, status: 1 });
conversationSchema.index({ last_activity: -1 });


// Middleware pour mettre à jour les champs calculés avant chaque sauvegarde
conversationSchema.pre('save', function(next) {
  this.updated_at = new Date();
  this.total_messages = this.messages.length;
  // Calcule le total des tokens et du coût
  this.total_tokens = this.messages.reduce((sum, msg) => sum + (msg.metadata.tokens_used || 0), 0);
  this.total_cost = this.messages.reduce((sum, msg) => sum + (msg.metadata.cost || 0), 0);
  next();
});


// Méthodes d'instance pour manipuler une conversation
conversationSchema.methods.addMessage = function(role, content, metadata = {}) {
  // Ajoute un message à la conversation
  const message = {
    role,
    content,
    metadata: {
      source: metadata.source || 'decision_tree',
      tokens_used: metadata.tokens_used || 0,
      cost: metadata.cost || 0
    }
  };
  this.messages.push(message);
  this.last_activity = new Date();
  return this.save();
};

conversationSchema.methods.getRecentMessages = function(limit = 10) {
  // Retourne les derniers messages (par défaut 10)
  return this.messages.slice(-limit);
};

conversationSchema.methods.closeConversation = function() {
  // Change le statut de la conversation à "closed"
  this.status = 'closed';
  return this.save();
};


// Méthodes statiques pour rechercher/créer des conversations
conversationSchema.statics.findByPatientId = function(patientId) {
  // Trouve la conversation active d'un patient
  return this.findOne({ patient_id: patientId, status: 'active' });
};

conversationSchema.statics.createNewConversation = function(patientId) {
  // Crée une nouvelle conversation active pour un patient
  return this.create({
    patient_id: patientId,
    status: 'active'
  });
};


// Index TTL : suppression automatique des conversations inactives après 30 jours
conversationSchema.index({ last_activity: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });


// Création du modèle Conversation à partir du schéma
const Conversation = mongoose.model('Conversation', conversationSchema);

// Exporte le modèle pour utilisation ailleurs dans l'app
module.exports = Conversation;
