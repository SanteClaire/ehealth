
// Importe mongoose pour la gestion des schémas et modèles MongoDB
const mongoose = require('mongoose');


// Schéma pour le cache des résumés générés par l'IA
const cacheResumeSchema = new mongoose.Schema({
  patient_id: {
    type: String, // Identifiant du patient
    required: true,
    unique: true,
    index: true
  },
  resume_content: {
    type: String, // Contenu du résumé généré
    required: true,
    maxlength: 5000
  },
  documents_hash: {
    type: String, // Hash MD5 de la liste des documents utilisés
    required: true,
    // Permet de détecter les changements dans les documents
  },
  documents_count: {
    type: Number, // Nombre de documents utilisés
    required: true,
    min: 0
  },
  generated_at: {
    type: Date, // Date de génération du résumé
    default: Date.now
  },
  expires_at: {
    type: Date, // Date d'expiration du cache
    default: function() {
      // Expire après 7 jours par défaut (modifiable via .env)
      const expiryDays = parseInt(process.env.CACHE_EXPIRY_DAYS) || 7;
      return new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    }
  },
  metadata: {
    tokens_used: {
      type: Number, // Nombre de tokens utilisés pour générer le résumé
      required: true,
      min: 0
    },
    cost: {
      type: Number, // Coût de génération
      required: true,
      min: 0
    },
    generation_time_ms: {
      type: Number, // Temps de génération en ms
      required: true,
      min: 0
    },
    model_used: {
      type: String, // Modèle IA utilisé
      default: 'claude-3-sonnet'
    }
  },
  access_count: {
    type: Number, // Nombre d'accès au cache
    default: 0
  },
  last_accessed: {
    type: Date, // Date du dernier accès
    default: Date.now
  }
});


// Index TTL pour suppression automatique à expiration
cacheResumeSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
// Index pour accélérer les recherches fréquentes
cacheResumeSchema.index({ patient_id: 1, expires_at: 1 });

// Middleware pour mettre à jour l'accès lors d'une recherche
cacheResumeSchema.pre('findOne', function() {
  this.update({}, { 
    $inc: { access_count: 1 },
    $set: { last_accessed: new Date() }
  });
});


// Méthodes d'instance pour manipuler un cache
cacheResumeSchema.methods.isExpired = function() {
  // Vérifie si le cache est expiré
  return new Date() > this.expires_at;
};

cacheResumeSchema.methods.extendExpiry = function(days = 7) {
  // Prolonge la durée de vie du cache
  this.expires_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.save();
};

cacheResumeSchema.methods.updateAccess = function() {
  // Met à jour le compteur d'accès et la date
  this.access_count += 1;
  this.last_accessed = new Date();
  return this.save();
};


// Méthodes statiques pour manipuler le cache globalement
cacheResumeSchema.statics.findValidCache = function(patientId, documentsHash) {
  // Cherche un cache valide pour un patient et un hash de documents
  return this.findOne({
    patient_id: patientId,
    documents_hash: documentsHash,
    expires_at: { $gt: new Date() }
  });
};

cacheResumeSchema.statics.createOrUpdateCache = function(patientId, resumeContent, documentsHash, documentsCount, metadata) {
  // Crée ou met à jour un cache pour un patient
  return this.findOneAndUpdate(
    { patient_id: patientId },
    {
      patient_id: patientId,
      resume_content: resumeContent,
      documents_hash: documentsHash,
      documents_count: documentsCount,
      generated_at: new Date(),
      expires_at: new Date(Date.now() + (parseInt(process.env.CACHE_EXPIRY_DAYS) || 7) * 24 * 60 * 60 * 1000),
      metadata: metadata,
      access_count: 0,
      last_accessed: new Date()
    },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true
    }
  );
};


// Statistiques globales sur le cache
cacheResumeSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total_resumes: { $sum: 1 },
        total_cost: { $sum: '$metadata.cost' },
        total_tokens: { $sum: '$metadata.tokens_used' },
        avg_generation_time: { $avg: '$metadata.generation_time_ms' },
        total_access_count: { $sum: '$access_count' }
      }
    }
  ]);
};

// Nettoie les caches expirés
cacheResumeSchema.statics.cleanExpiredCache = function() {
  return this.deleteMany({
    expires_at: { $lt: new Date() }
  });
};


// Création du modèle CacheResume à partir du schéma
const CacheResume = mongoose.model('CacheResume', cacheResumeSchema);

// Exporte le modèle pour utilisation ailleurs dans l'app
module.exports = CacheResume;
