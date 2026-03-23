const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class WhisperService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.client = null;
    this.model = 'whisper-1';
    
    // Tarification Whisper : $0.006 per minute
    this.pricing = {
      per_minute: 0.006
    };

    // Configuration des limites
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024; // 25MB par défaut
    this.supportedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];
    this.tempDir = path.join(__dirname, '../../../temp-audio');

    this.initializeClient();
    this.ensureTempDirectory();
  }

  initializeClient() {
    if (!this.apiKey) {
      logger.warn('⚠️ Clé API OpenAI manquante. Service Whisper désactivé.');
      return;
    }

    try {
      this.client = new OpenAI({
        apiKey: this.apiKey
      });
      logger.info('✅ Service Whisper initialisé');
    } catch (error) {
      logger.error('❌ Erreur initialisation Whisper:', error.message);
    }
  }

  ensureTempDirectory() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
      logger.info(`📁 Dossier temporaire créé: ${this.tempDir}`);
    }
  }

  /**
   * Transcrit un fichier audio
   * @param {Buffer|string} audioFile - Buffer du fichier ou chemin vers le fichier
   * @param {Object} options - Options de transcription
   * @returns {Object} - Transcription avec métadonnées
   */
  async transcribeAudio(audioFile, options = {}) {
    if (!this.client) {
      throw new Error('Service Whisper non disponible - Vérifiez votre clé API');
    }

    const startTime = Date.now();
    let tempFilePath = null;

    try {
      // Validation du fichier
      const fileInfo = await this.validateAudioFile(audioFile);
      
      // Créer un fichier temporaire si nécessaire
      if (Buffer.isBuffer(audioFile) || (audioFile && audioFile.buffer && Buffer.isBuffer(audioFile.buffer))) {
        const buffer = Buffer.isBuffer(audioFile) ? audioFile : audioFile.buffer;
        tempFilePath = await this.createTempFile(buffer, fileInfo.extension);
        audioFile = tempFilePath;
      }

      logger.info(`🎙️ Transcription audio: ${fileInfo.size} bytes, format: ${fileInfo.extension}`);

      // Appel à l'API Whisper
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioFile),
        model: this.model,
        language: options.language || 'fr', // Français par défaut
        response_format: options.format || 'json',
        temperature: options.temperature || 0.2 // Plus conservateur pour le médical
      });

      const responseTime = Date.now() - startTime;
      
      // Estimation de la durée et du coût
      const estimatedDuration = this.estimateAudioDuration(fileInfo.size);
      const estimatedCost = (estimatedDuration / 60) * this.pricing.per_minute;

      const result = {
        text: transcription.text,
        metadata: {
          model: this.model,
          language: options.language || 'fr',
          file_size_bytes: fileInfo.size,
          estimated_duration_seconds: estimatedDuration,
          response_time_ms: responseTime,
          estimated_cost: estimatedCost,
          format: fileInfo.extension
        }
      };

      logger.info(`✅ Transcription terminée (${responseTime}ms, ~${estimatedDuration}s audio, ~$${estimatedCost.toFixed(4)})`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur transcription:', error.message);
      
      throw {
        error: error.message,
        response_time_ms: responseTime,
        cost: 0
      };
    } finally {
      // Nettoyer le fichier temporaire
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        logger.info('🧹 Fichier temporaire supprimé');
      }
    }
  }

  /**
   * Valide un fichier audio
   * @param {Buffer|string} audioFile - Fichier à valider
   * @returns {Object} - Informations sur le fichier
   */
  async validateAudioFile(audioFile) {
    let fileSize;
    let extension;

    if (Buffer.isBuffer(audioFile)) {
      fileSize = audioFile.length;
      // Pour un buffer, on assume mp3 par défaut (peut être amélioré)
      extension = 'mp3';
    } else if (typeof audioFile === 'string' && fs.existsSync(audioFile)) {
      const stats = fs.statSync(audioFile);
      fileSize = stats.size;
      extension = path.extname(audioFile).toLowerCase().substring(1);
    } else if (audioFile && audioFile.buffer && Buffer.isBuffer(audioFile.buffer)) {
      // Gérer le format { buffer, originalName, mimetype }
      fileSize = audioFile.buffer.length;
      if (audioFile.originalName) {
        extension = path.extname(audioFile.originalName).toLowerCase().substring(1);
      } else if (audioFile.mimetype) {
        // Extraire l'extension du mimetype
        const mimeToExt = {
          'audio/webm': 'webm',
          'audio/mp3': 'mp3',
          'audio/wav': 'wav',
          'audio/mpeg': 'mp3',
          'audio/ogg': 'ogg'
        };
        extension = mimeToExt[audioFile.mimetype] || 'webm';
      } else {
        extension = 'webm'; // Par défaut
      }
    } else {
      throw new Error('Fichier audio invalide');
    }

    // Vérifier la taille
    if (fileSize > this.maxFileSize) {
      throw new Error(`Fichier trop volumineux: ${fileSize} bytes (max: ${this.maxFileSize} bytes)`);
    }

    // Vérifier le format
    if (!this.supportedFormats.includes(extension)) {
      throw new Error(`Format non supporté: ${extension}. Formats acceptés: ${this.supportedFormats.join(', ')}`);
    }

    return { size: fileSize, extension };
  }

  /**
   * Crée un fichier temporaire à partir d'un buffer
   * @param {Buffer} buffer - Données audio
   * @param {string} extension - Extension du fichier
   * @returns {string} - Chemin vers le fichier temporaire
   */
  async createTempFile(buffer, extension) {
    const filename = `audio_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    const filepath = path.join(this.tempDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    return filepath;
  }

  /**
   * Estime la durée audio basée sur la taille du fichier
   * @param {number} fileSizeBytes - Taille du fichier en bytes
   * @returns {number} - Durée estimée en secondes
   */
  estimateAudioDuration(fileSizeBytes) {
    // Estimation approximative : 1MB ≈ 60 secondes pour un MP3 de qualité moyenne
    const mbSize = fileSizeBytes / (1024 * 1024);
    return Math.round(mbSize * 60);
  }

  /**
   * Nettoie les anciens fichiers temporaires
   * @param {number} maxAgeMinutes - Âge maximum en minutes
   */
  cleanupTempFiles(maxAgeMinutes = 60) {
    try {
      const files = fs.readdirSync(this.tempDir);
      const now = Date.now();
      let cleanedCount = 0;

      for (const file of files) {
        const filepath = path.join(this.tempDir, file);
        const stats = fs.statSync(filepath);
        const ageMinutes = (now - stats.mtime.getTime()) / (1000 * 60);

        if (ageMinutes > maxAgeMinutes) {
          fs.unlinkSync(filepath);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        logger.info(`🧹 ${cleanedCount} fichiers temporaires supprimés`);
      }
    } catch (error) {
      logger.error('❌ Erreur nettoyage fichiers temporaires:', error.message);
    }
  }

  /**
   * Traite un fichier audio avec validation complète
   * @param {Object} fileData - Données du fichier (buffer, originalName, etc.)
   * @returns {Object} - Résultat de la transcription
   */
  async processAudioFile(fileData) {
    const { buffer, originalName, mimetype } = fileData;

    // Validation du type MIME
    const allowedMimeTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 
      'audio/m4a', 'audio/webm', 'video/mp4', 'video/webm'
    ];

    if (mimetype && !allowedMimeTypes.includes(mimetype)) {
      throw new Error(`Type MIME non supporté: ${mimetype}`);
    }

    logger.info(`📁 Traitement fichier: ${originalName} (${buffer.length} bytes)`);

    // Transcription
    const result = await this.transcribeAudio(buffer, {
      language: 'fr',
      temperature: 0.1 // Très conservateur pour le médical
    });

    // Ajouter des informations sur le fichier original
    result.metadata.original_filename = originalName;
    result.metadata.mime_type = mimetype;

    return result;
  }

  /**
   * Vérifie si le service est disponible
   */
  isAvailable() {
    return this.client !== null;
  }

  /**
   * Obtient les statistiques du service
   */
  getServiceStats() {
    return {
      model: this.model,
      pricing: this.pricing,
      max_file_size: this.maxFileSize,
      supported_formats: this.supportedFormats,
      temp_directory: this.tempDir,
      available: this.isAvailable()
    };
  }

  /**
   * Démarre le nettoyage automatique des fichiers temporaires
   */
  startAutoCleanup(intervalMinutes = 30) {
    setInterval(() => {
      this.cleanupTempFiles();
    }, intervalMinutes * 60 * 1000);
    
    logger.info(`🔄 Nettoyage automatique activé (toutes les ${intervalMinutes} minutes)`);
  }
}

module.exports = WhisperService;
