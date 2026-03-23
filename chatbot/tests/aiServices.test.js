const { AIOrchestrator, DecisionTreeService, ClaudeService, WhisperService } = require('../src/services/ai');

// Mock MongoDB pour les tests
jest.mock('../src/models', () => ({
  IAUsage: {
    logUsage: jest.fn().mockResolvedValue({}),
    getCostAlert: jest.fn().mockResolvedValue([]),
    getDailyStats: jest.fn().mockResolvedValue([])
  }
}));

describe('Services IA', () => {
  describe('DecisionTreeService', () => {
    let decisionTree;

    beforeEach(() => {
      decisionTree = new DecisionTreeService();
    });

    it('devrait être initialisé correctement', () => {
      expect(decisionTree).toBeDefined();
      expect(decisionTree.knowledgeBase).toBeDefined();
    });

    it('devrait analyser un message médical', () => {
      const result = decisionTree.analyzeMessage("J'ai de la fièvre");
      expect(result).not.toBeNull();
      expect(result.category).toBe('symptomes');
    });
  });

  describe('ClaudeService', () => {
    let claude;

    beforeEach(() => {
      claude = new ClaudeService();
    });

    it('devrait être initialisé', () => {
      expect(claude).toBeDefined();
      expect(claude.model).toBe('claude-3-sonnet-20240229');
    });

    it('devrait indiquer si le service est disponible', () => {
      const available = claude.isAvailable();
      expect(typeof available).toBe('boolean');
    });

    it('devrait retourner les statistiques d\'usage', () => {
      const stats = claude.getUsageStats();
      expect(stats).toHaveProperty('model');
      expect(stats).toHaveProperty('pricing');
      expect(stats).toHaveProperty('available');
    });
  });

  describe('WhisperService', () => {
    let whisper;

    beforeEach(() => {
      whisper = new WhisperService();
    });

    it('devrait être initialisé', () => {
      expect(whisper).toBeDefined();
      expect(whisper.model).toBe('whisper-1');
    });

    it('devrait valider les formats audio supportés', () => {
      expect(whisper.supportedFormats).toContain('mp3');
      expect(whisper.supportedFormats).toContain('wav');
      expect(whisper.supportedFormats).toContain('webm');
    });

    it('devrait estimer la durée audio', () => {
      const duration = whisper.estimateAudioDuration(1024 * 1024); // 1MB
      expect(duration).toBeGreaterThan(0);
      expect(typeof duration).toBe('number');
    });

    it('devrait retourner les statistiques du service', () => {
      const stats = whisper.getServiceStats();
      expect(stats).toHaveProperty('model');
      expect(stats).toHaveProperty('pricing');
      expect(stats).toHaveProperty('supported_formats');
      expect(stats).toHaveProperty('available');
    });
  });

  describe('AIOrchestrator', () => {
    let orchestrator;

    beforeEach(() => {
      orchestrator = new AIOrchestrator();
    });

    it('devrait être initialisé avec tous les services', () => {
      expect(orchestrator).toBeDefined();
      expect(orchestrator.decisionTree).toBeDefined();
      expect(orchestrator.claude).toBeDefined();
      expect(orchestrator.whisper).toBeDefined();
    });

    it('devrait traiter un message avec l\'arbre de décision', async () => {
      const result = await orchestrator.processChatbotMessage(
        "J'ai de la fièvre depuis hier",
        'patient_123'
      );

      expect(result).toBeDefined();
      expect(result.source).toBe('decision_tree');
      expect(result.response).toContain('Fièvre');
      expect(result.metadata.cost).toBe(0);
    });

    it('devrait retourner le statut des services', () => {
      const status = orchestrator.getServicesStatus();
      
      expect(status).toHaveProperty('decision_tree', true);
      expect(status).toHaveProperty('claude');
      expect(status).toHaveProperty('whisper');
      expect(status).toHaveProperty('orchestrator', true);
    });

    it('devrait retourner des questions suggérées', () => {
      const questions = orchestrator.getSuggestedQuestions();
      
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('devrait gérer les erreurs gracieusement', async () => {
      const result = await orchestrator.processChatbotMessage(
        "Question très complexe qui nécessite l'IA",
        'patient_123'
      );

      // Sans clés API, devrait retourner une réponse de fallback
      expect(result).toBeDefined();
      expect(result.source).toBe('fallback');
      expect(result.metadata.cost).toBe(0);
    });
  });

  describe('Intégration des services', () => {
    it('devrait prioriser l\'arbre de décision pour économiser les coûts', async () => {
      const orchestrator = new AIOrchestrator();
      
      // Message qui devrait être traité par l'arbre de décision
      const result = await orchestrator.processChatbotMessage(
        "Comment prendre rendez-vous ?",
        'patient_123'
      );

      expect(result.source).toBe('decision_tree');
      expect(result.metadata.cost).toBe(0);
    });

    it('devrait calculer les coûts correctement', () => {
      const claude = new ClaudeService();
      const whisper = new WhisperService();

      // Vérifier que les tarifs sont définis
      expect(claude.pricing.input).toBeGreaterThan(0);
      expect(claude.pricing.output).toBeGreaterThan(0);
      expect(whisper.pricing.per_minute).toBeGreaterThan(0);
    });
  });
});
