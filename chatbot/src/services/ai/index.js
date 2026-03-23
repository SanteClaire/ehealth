const DecisionTreeService = require('./decisionTree');
const LMStudioService = require('./lmStudioService');
const WhisperLocalService = require('./whisperLocalService');
const AIOrchestrator = require('./aiOrchestrator');

// Services legacy (gardés pour compatibilité si besoin)
const ClaudeService = require('./claudeService');
const WhisperService = require('./whisperService');

module.exports = {
  DecisionTreeService,
  LMStudioService,
  WhisperLocalService,
  AIOrchestrator,
  // Legacy services
  ClaudeService,
  WhisperService
};
