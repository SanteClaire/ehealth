
// Importe mongoose pour la gestion des schémas et modèles MongoDB
const mongoose = require('mongoose');


// Schéma pour le suivi de l'utilisation des services IA
const iaUsageSchema = new mongoose.Schema({
  endpoint: {
    type: String, // Type d'endpoint utilisé (chatbot, résumé, transcription)
    required: true,
    enum: ['chatbot', 'resume', 'transcription']
  },
  ai_service: {
    type: String, // Service IA utilisé
    required: true,
    enum: ['claude', 'whisper', 'decision_tree', 'openai']
  },
  model_used: {
    type: String, // Modèle IA utilisé
    required: true
  },
  patient_id: {
    type: String, // Identifiant du patient
    index: true
  },
  request_data: {
    input_length: {
      type: Number, // Longueur de l'entrée utilisateur
      required: true,
      min: 0
    },
    output_length: {
      type: Number, // Longueur de la sortie générée
      default: 0,
      min: 0
    },
    tokens_used: {
      type: Number, // Nombre de tokens utilisés
      default: 0,
      min: 0
    }
  },
  performance: {
    response_time_ms: {
      type: Number, // Temps de réponse en ms
      required: true,
      min: 0
    },
    success: {
      type: Boolean, // Succès ou échec de la requête
      required: true,
      default: true
    },
    error_message: {
      type: String, // Message d'erreur éventuel
      default: null
    }
  },
  cost: {
    input_cost: {
      type: Number, // Coût de l'entrée
      default: 0,
      min: 0
    },
    output_cost: {
      type: Number, // Coût de la sortie
      default: 0,
      min: 0
    },
    total_cost: {
      type: Number, // Coût total (calculé automatiquement)
      required: true,
      min: 0
    }
  },
  timestamp: {
    type: Date, // Date de l'appel
    default: Date.now,
    index: true
  },
  session_id: {
    type: String, // Identifiant de session
    index: true
  }
});


// Index pour accélérer les requêtes d'analyse
iaUsageSchema.index({ endpoint: 1, timestamp: -1 });
iaUsageSchema.index({ ai_service: 1, timestamp: -1 });
iaUsageSchema.index({ patient_id: 1, timestamp: -1 });
iaUsageSchema.index({ 'performance.success': 1, timestamp: -1 });

// Index TTL : suppression automatique après 90 jours
iaUsageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Middleware pour calculer le coût total avant sauvegarde
iaUsageSchema.pre('save', function(next) {
  this.cost.total_cost = this.cost.input_cost + this.cost.output_cost;
  next();
});


// Méthodes statiques pour les statistiques d'utilisation IA
iaUsageSchema.statics.getDailyStats = function(date = new Date()) {
  // Statistiques pour une journée donnée
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: {
          endpoint: '$endpoint',
          ai_service: '$ai_service'
        },
        total_requests: { $sum: 1 },
        successful_requests: {
          $sum: { $cond: ['$performance.success', 1, 0] }
        },
        total_cost: { $sum: '$cost.total_cost' },
        total_tokens: { $sum: '$request_data.tokens_used' },
        avg_response_time: { $avg: '$performance.response_time_ms' },
        max_response_time: { $max: '$performance.response_time_ms' },
        min_response_time: { $min: '$performance.response_time_ms' }
      }
    },
    {
      $sort: { total_cost: -1 }
    }
  ]);
};


// Statistiques hebdomadaires
iaUsageSchema.statics.getWeeklyStats = function(startDate = new Date()) {
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: weekStart }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        daily_cost: { $sum: '$cost.total_cost' },
        daily_requests: { $sum: 1 },
        daily_tokens: { $sum: '$request_data.tokens_used' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);
};


// Statistique d'alerte de coût journalier
iaUsageSchema.statics.getCostAlert = function(dailyLimit = 2.0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: today }
      }
    },
    {
      $group: {
        _id: null,
        total_cost_today: { $sum: '$cost.total_cost' },
        total_requests_today: { $sum: 1 }
      }
    },
    {
      $project: {
        total_cost_today: 1,
        total_requests_today: 1,
        alert_threshold: dailyLimit,
        should_alert: { $gte: ['$total_cost_today', dailyLimit] },
        remaining_budget: { $subtract: [dailyLimit, '$total_cost_today'] }
      }
    }
  ]);
};


// Statistiques sur les erreurs récentes
iaUsageSchema.statics.getErrorStats = function(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: since },
        'performance.success': false
      }
    },
    {
      $group: {
        _id: {
          endpoint: '$endpoint',
          ai_service: '$ai_service',
          error: '$performance.error_message'
        },
        error_count: { $sum: 1 },
        latest_error: { $max: '$timestamp' }
      }
    },
    {
      $sort: { error_count: -1 }
    }
  ]);
};


// Méthode utilitaire pour enregistrer une utilisation IA
iaUsageSchema.statics.logUsage = function(data) {
  const inputCost = data.input_cost || 0;
  const outputCost = data.output_cost || 0;
  return this.create({
    endpoint: data.endpoint,
    ai_service: data.ai_service,
    model_used: data.model_used,
    patient_id: data.patient_id,
    request_data: {
      input_length: data.input_length,
      output_length: data.output_length || 0,
      tokens_used: data.tokens_used || 0
    },
    performance: {
      response_time_ms: data.response_time_ms,
      success: data.success !== false,
      error_message: data.error_message || null
    },
    cost: {
      input_cost: inputCost,
      output_cost: outputCost,
      total_cost: inputCost + outputCost
    },
    session_id: data.session_id
  });
};


// Création du modèle IAUsage à partir du schéma
const IAUsage = mongoose.model('IAUsage', iaUsageSchema);

// Exporte le modèle pour utilisation ailleurs dans l'app
module.exports = IAUsage;
