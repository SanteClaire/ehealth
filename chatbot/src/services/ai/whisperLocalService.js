const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class WhisperLocalService {
  constructor() {
    // Configuration Whisper local
    // Correction : chemin explicite vers whisper.exe si non défini
    // Chemin absolu vers whisper (sans extension sous Windows)
    const defaultWhisperPath = process.platform === 'win32'
      ? 'C:/Users/Utilisateur/AppData/Local/Programs/Python/Python312/Scripts/whisper'
      : 'whisper';
    this.whisperPath = process.env.WHISPER_PATH || defaultWhisperPath;
    this.model = process.env.WHISPER_MODEL || 'base'; // tiny, base, small, medium, large
    this.language = process.env.WHISPER_LANGUAGE || 'fr';

    // Pas de coût avec Whisper local !
    this.pricing = {
      per_minute: 0,
      total: 0
    };

    // Configuration des limites
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024; // 25MB
    this.supportedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'flac'];
    this.tempDir = path.join(__dirname, '../../../temp-audio');
    this.outputDir = path.join(__dirname, '../../../temp-transcriptions');

    this.isAvailable = false;

    // Initialisation asynchrone, mais log seulement après la vérification
    this.initPromise = this.initializeService();
  }

  async initializeService() {
    try {
      await this.checkWhisperInstallation();
      this.ensureDirectories();
      logger.info('✅ Service Whisper Local initialisé');
    } catch (error) {
      // Log l'erreur une seule fois, et seulement si la vérification échoue réellement
      if (!this.isAvailable) {
        logger.warn('⚠️ Whisper local non disponible: ' + error.message);
        logger.info('💡 Installez Whisper avec: pip install openai-whisper');
      }
    }
  }

  /**
   * Vérifie si Whisper est installé
   */
  async checkWhisperInstallation() {
    logger.info(`[WhisperLocalService] Chemin testé pour Whisper : ${this.whisperPath}`);
    return new Promise((resolve, reject) => {
      let errorAlready = false;
      let stderr = '';
      let timeoutId = null;
      // Forcer UTF-8 pour éviter les erreurs d'encodage Unicode sous Windows
      const whisper = spawn(this.whisperPath, ['--help'], {
        stdio: 'pipe',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      whisper.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      whisper.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code === 0) {
          this.isAvailable = true;
          resolve(true);
        } else {
          if (!errorAlready) {
            logger.error(`[WhisperLocalService] Code retour Whisper: ${code}`);
            if (stderr) {
              logger.error(`[WhisperLocalService] Erreur Whisper (stderr): ${stderr}`);
            }
            errorAlready = true;
          }
          reject(new Error('Whisper non installé ou non accessible'));
        }
      });

      whisper.on('error', (error) => {
        clearTimeout(timeoutId);
        if (!errorAlready) {
          logger.error(`[WhisperLocalService] Erreur lors du spawn: ${error.message}`);
          errorAlready = true;
        }
        reject(new Error(`Erreur Whisper: ${error.message}`));
      });

      // Timeout après 5 secondes
      timeoutId = setTimeout(() => {
        whisper.kill();
        if (!errorAlready) {
          logger.error('[WhisperLocalService] Timeout lors de la vérification de Whisper');
          if (stderr) {
            logger.error(`[WhisperLocalService] Erreur Whisper (stderr): ${stderr}`);
          }
          errorAlready = true;
        }
        reject(new Error('Timeout vérification Whisper'));
      }, 5000);
    });
  }

  /**
   * Crée les dossiers nécessaires
   */
  ensureDirectories() {
    [this.tempDir, this.outputDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`📁 Dossier créé: ${dir}`);
      }
    });
  }

  /**
   * Transcrit un fichier audio avec Whisper local
   * @param {Buffer|string} audioFile - Buffer du fichier ou chemin vers le fichier
   * @param {Object} options - Options de transcription
   * @returns {Object} - Transcription avec métadonnées
   */
  async transcribeAudio(audioFile, options = {}) {
    if (!this.isAvailable) {
      throw new Error('Service Whisper local non disponible');
    }

    const startTime = Date.now();
    let tempFilePath = null;
    let outputPath = null;

    try {
      // Validation du fichier
      const fileInfo = await this.validateAudioFile(audioFile);
      
      // Créer un fichier temporaire si nécessaire
      if (Buffer.isBuffer(audioFile)) {
        tempFilePath = await this.createTempFile(audioFile, fileInfo.extension);
        audioFile = tempFilePath;
      }

      logger.info(`🎙️ Transcription Whisper local: ${fileInfo.size} bytes, format: ${fileInfo.extension}`);

      // Le nom de base du fichier (sans extension) - Whisper génère la sortie basée sur ce nom
      const inputBaseName = path.basename(audioFile, path.extname(audioFile));
      outputPath = path.join(this.outputDir, inputBaseName);

      // Commande Whisper
      const whisperArgs = [
        audioFile,
        '--model', options.model || this.model,
        '--language', options.language || this.language,
        '--output_format', 'json',
        '--output_dir', this.outputDir,
        '--verbose', 'False'
      ];

      // Ajouter des options supplémentaires si spécifiées
      if (options.temperature !== undefined) {
        whisperArgs.push('--temperature', options.temperature.toString());
      }

      const transcriptionResult = await this.runWhisperCommand(whisperArgs);
      const responseTime = Date.now() - startTime;

      // Lire le fichier de transcription JSON
      const jsonFile = `${outputPath}.json`;
      let transcriptionText = '';
      
      logger.info(`📄 Recherche fichier de sortie: ${jsonFile}`);
      
      if (fs.existsSync(jsonFile)) {
        const jsonContent = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        transcriptionText = jsonContent.text || '';
        logger.info(`✅ Transcription trouvée: "${transcriptionText.substring(0, 100)}..."`);
        
        // Nettoyer le fichier JSON temporaire
        fs.unlinkSync(jsonFile);
      } else {
        // Fallback: chercher un fichier .txt
        const txtFile = `${outputPath}.txt`;
        logger.info(`📄 Fichier JSON non trouvé, recherche: ${txtFile}`);
        if (fs.existsSync(txtFile)) {
          transcriptionText = fs.readFileSync(txtFile, 'utf8').trim();
          logger.info(`✅ Transcription (txt) trouvée: "${transcriptionText.substring(0, 100)}..."`);
          fs.unlinkSync(txtFile);
        } else {
          logger.warn(`⚠️ Aucun fichier de sortie trouvé dans: ${this.outputDir}`);
          // Lister les fichiers présents pour debug
          const files = fs.readdirSync(this.outputDir);
          logger.info(`📁 Fichiers présents: ${files.join(', ') || 'aucun'}`);
        }
      }

      const estimatedDuration = this.estimateAudioDuration(fileInfo.size);

      const result = {
        text: transcriptionText,
        metadata: {
          model: options.model || this.model,
          language: options.language || this.language,
          file_size_bytes: fileInfo.size,
          estimated_duration_seconds: estimatedDuration,
          response_time_ms: responseTime,
          estimated_cost: 0, // Gratuit !
          format: fileInfo.extension,
          source: 'whisper_local'
        }
      };

      logger.info(`✅ Transcription locale terminée (${responseTime}ms, ~${estimatedDuration}s audio, GRATUIT)`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur transcription locale:', error.message);
      
      throw {
        error: error.message,
        response_time_ms: responseTime,
        cost: 0
      };
    } finally {
      // Nettoyer les fichiers temporaires
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      // Nettoyer les fichiers de sortie restants
      if (outputPath) {
        ['.json', '.txt', '.srt', '.vtt'].forEach(ext => {
          const file = `${outputPath}${ext}`;
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
      }
    }
  }

  /**
   * Exécute la commande Whisper
   * @param {Array} args - Arguments pour Whisper
   * @returns {Promise} - Résultat de la commande
   */
  runWhisperCommand(args) {
    return new Promise((resolve, reject) => {
      logger.info(`🔄 Commande Whisper: ${this.whisperPath} ${args.join(' ')}`);
      
      // Forcer UTF-8 pour éviter les erreurs d'encodage Unicode sous Windows
      const whisper = spawn(this.whisperPath, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      let stdout = '';
      let stderr = '';

      whisper.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      whisper.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      whisper.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Whisper failed with code ${code}: ${stderr}`));
        }
      });

      whisper.on('error', (error) => {
        reject(new Error(`Erreur exécution Whisper: ${error.message}`));
      });

      // Timeout après 5 minutes
      setTimeout(() => {
        whisper.kill();
        reject(new Error('Timeout transcription Whisper (5 minutes)'));
      }, 5 * 60 * 1000);
    });
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
      extension = 'wav'; // Format par défaut pour les buffers
    } else if (typeof audioFile === 'string' && fs.existsSync(audioFile)) {
      const stats = fs.statSync(audioFile);
      fileSize = stats.size;
      extension = path.extname(audioFile).toLowerCase().substring(1);
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
   * Traite un fichier audio avec validation complète
   * @param {Object} fileData - Données du fichier (buffer, originalName, etc.)
   * @returns {Object} - Résultat de la transcription
   */
  async processAudioFile(fileData) {
    const { buffer, originalName, mimetype } = fileData;

    // Validation du type MIME (accepter aussi application/octet-stream)
    const allowedMimeTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 
      'audio/m4a', 'audio/webm', 'video/mp4', 'video/webm',
      'audio/flac', 'audio/ogg', 'audio/x-m4a', 'audio/aac',
      'audio/x-wav', 'audio/wave', 'audio/vnd.wave',
      'application/octet-stream' // Fichiers sans mimetype détecté
    ];

    // Vérifier aussi l'extension du fichier
    const ext = originalName ? originalName.toLowerCase().split('.').pop() : '';
    const audioExtensions = ['mp3', 'wav', 'mp4', 'm4a', 'webm', 'flac', 'ogg', 'aac', 'mpeg'];

    if (mimetype && !allowedMimeTypes.includes(mimetype) && !audioExtensions.includes(ext)) {
      throw new Error(`Type MIME non supporté: ${mimetype}`);
    }

    logger.info(`📁 Traitement fichier local: ${originalName} (${buffer.length} bytes, mimetype: ${mimetype})`);

    // Transcription
    const result = await this.transcribeAudio(buffer, {
      language: 'fr',
      temperature: 0.0 // Très conservateur pour le médical
    });

    // Ajouter des informations sur le fichier original
    result.metadata.original_filename = originalName;
    result.metadata.mime_type = mimetype;

    return result;
  }

  /**
   * Nettoie les anciens fichiers temporaires
   * @param {number} maxAgeMinutes - Âge maximum en minutes
   */
  cleanupTempFiles(maxAgeMinutes = 60) {
    [this.tempDir, this.outputDir].forEach(dir => {
      try {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir);
        const now = Date.now();
        let cleanedCount = 0;

        for (const file of files) {
          const filepath = path.join(dir, file);
          const stats = fs.statSync(filepath);
          const ageMinutes = (now - stats.mtime.getTime()) / (1000 * 60);

          if (ageMinutes > maxAgeMinutes) {
            fs.unlinkSync(filepath);
            cleanedCount++;
          }
        }

        if (cleanedCount > 0) {
          logger.info(`🧹 ${cleanedCount} fichiers temporaires supprimés dans ${dir}`);
        }
      } catch (error) {
        logger.error(`❌ Erreur nettoyage ${dir}:`, error.message);
      }
    });
  }

  /**
   * Obtient les modèles Whisper disponibles
   */
  getAvailableModels() {
    return ['tiny', 'base', 'small', 'medium', 'large', 'large-v2', 'large-v3'];
  }

  /**
   * Change le modèle utilisé
   */
  setModel(modelName) {
    if (this.getAvailableModels().includes(modelName)) {
      this.model = modelName;
      logger.info(`🔄 Modèle Whisper changé pour: ${modelName}`);
    } else {
      throw new Error(`Modèle non supporté: ${modelName}`);
    }
  }

  /**
   * Obtient les statistiques du service
   */
  getServiceStats() {
    return {
      model: this.model,
      language: this.language,
      pricing: this.pricing,
      max_file_size: this.maxFileSize,
      supported_formats: this.supportedFormats,
      temp_directory: this.tempDir,
      output_directory: this.outputDir,
      available: this.isAvailable,
      whisper_path: this.whisperPath,
      available_models: this.getAvailableModels(),
      cost_advantage: 'GRATUIT - Traitement local !'
    };
  }

  /**
   * Démarre le nettoyage automatique des fichiers temporaires
   */
  startAutoCleanup(intervalMinutes = 30) {
    setInterval(() => {
      this.cleanupTempFiles();
    }, intervalMinutes * 60 * 1000);
    
    logger.info(`🔄 Nettoyage automatique Whisper activé (toutes les ${intervalMinutes} minutes)`);
  }
}

module.exports = WhisperLocalService;
