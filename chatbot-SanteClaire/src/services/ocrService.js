const Tesseract = require('tesseract.js');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class OCRService {
  constructor() {
    this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
  }

  /**
   * Extrait le texte d'une image avec OCR
   * @param {Buffer} imageBuffer - Buffer de l'image
   * @param {Object} options - Options de reconnaissance
   * @returns {Promise<Object>} - Texte extrait et métadonnées
   */
  async extractText(imageBuffer, options = {}) {
    const startTime = Date.now();
    
    try {
      logger.info('🔍 Début de l\'OCR sur l\'image...');
      
      // Configuration de Tesseract
      const config = {
        lang: options.language || 'fra', // Français par défaut
        tessedit_pageseg_mode: options.segmentationMode || '6', // Mode single text block
        preserve_interword_spaces: '1'
      };

      // Reconnaissance OCR
      const result = await Tesseract.recognize(
        imageBuffer,
        config.lang,
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              logger.info(`🔍 OCR en cours: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      logger.info('🔍 Structure OCR:', Object.keys(result));
      logger.info('🔍 Data structure:', Object.keys(result.data || {}));

      const { data: { text, confidence } } = result;
      
      // Extraire words et lines depuis blocks si disponibles
      const words = result.data.blocks?.flatMap(block => block.paragraphs?.flatMap(para => para.words || [])) || [];
      const lines = result.data.blocks?.flatMap(block => block.paragraphs?.flatMap(para => para.lines || [])) || [];

      const responseTime = Date.now() - startTime;
      
      // Nettoyage du texte extrait
      const cleanedText = this.cleanText(text);
      
      // Analyse de la qualité
      const quality = this.analyzeQuality(confidence, cleanedText);
      
      logger.info(`✅ OCR terminé (${responseTime}ms, confiance: ${confidence}%)`);
      
      return {
        text: cleanedText,
        confidence,
        wordCount: words.length,
        lineCount: lines.length,
        quality,
        response_time_ms: responseTime,
        metadata: {
          language: config.lang,
          original_length: text.length,
          cleaned_length: cleanedText.length
        }
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('❌ Erreur OCR:', error.message);
      
      throw {
        error: error.message,
        response_time_ms: responseTime,
        confidence: 0
      };
    }
  }

  /**
   * Nettoie le texte extrait par OCR
   * @param {string} text - Texte brut de l'OCR
   * @returns {string} - Texte nettoyé
   */
  cleanText(text) {
    return text
      // Supprimer les espaces multiples
      .replace(/\s+/g, ' ')
      // Supprimer les caractères non imprimables sauf les sauts de ligne
      .replace(/[^\x20-\x7E\n\r]/g, '')
      // Normaliser les sauts de ligne
      .replace(/\n\s*\n/g, '\n\n')
      // Supprimer les espaces en début/fin de ligne
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  /**
   * Analyse la qualité de la reconnaissance OCR
   * @param {number} confidence - Score de confiance
   * @param {string} text - Texte extrait
   * @returns {Object} - Analyse de qualité
   */
  analyzeQuality(confidence, text) {
    const hasMedicalKeywords = this.containsMedicalKeywords(text);
    const wordCount = text.split(/\s+/).length;
    
    let quality = 'faible';
    if (confidence > 80 && wordCount > 5) {
      quality = 'élevée';
    } else if (confidence > 60 && wordCount > 3) {
      quality = 'moyenne';
    }

    return {
      level: quality,
      confidence,
      wordCount,
      hasMedicalContent: hasMedicalKeywords,
      isReadable: confidence > 50 && wordCount > 2
    };
  }

  /**
   * Détecte si le texte contient des termes médicaux
   * @param {string} text - Texte à analyser
   * @returns {boolean} - Contient des termes médicaux
   */
  containsMedicalKeywords(text) {
    const medicalKeywords = [
      'ordonnance', 'prescription', 'médicament', 'traitement', 'dosage',
      'mg', 'ml', 'comprimé', 'gélule', 'sirop', 'injection', 'posologie',
      'médecin', 'docteur', 'patient', 'pharmacie', 'laboratoire',
      'paracétamol', 'ibuprofène', 'amoxicilline', 'aspirine', 'doliprane'
    ];

    const lowerText = text.toLowerCase();
    return medicalKeywords.some(keyword => lowerText.includes(keyword));
  }

  /**
   * Vérifie si le format est supporté
   * @param {string} mimeType - Type MIME du fichier
   * @returns {boolean} - Format supporté
   */
  isFormatSupported(mimeType) {
    return this.supportedFormats.includes(mimeType);
  }

  /**
   * Obtient la liste des formats supportés
   * @returns {string[]} - Formats supportés
   */
  getSupportedFormats() {
    return this.supportedFormats;
  }
}

module.exports = OCRService;
