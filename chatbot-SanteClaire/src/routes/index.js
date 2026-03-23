const express = require('express');
const chatbotRoutes = require('./chatbot');
const resumeRoutes = require('./resume');
const statsRoutes = require('./stats');

const router = express.Router();

// Routes principales de l'API
router.use('/chatbot', chatbotRoutes);
router.use('/resume', resumeRoutes);
router.use('/stats', statsRoutes);

// Route de base pour vérifier l'API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API SantéClaire - Chatbot Médical',
    version: '1.0.0',
    endpoints: {
      chatbot: {
        message: 'POST /api/chatbot/message',
        transcribe: 'POST /api/chatbot/transcribe',
        conversation: 'GET /api/chatbot/conversation/:id',
        conversations: 'GET /api/chatbot/conversations',
        suggestions: 'GET /api/chatbot/suggestions',
        status: 'GET /api/chatbot/status'
      },
      resume: {
        generate: 'POST /api/resume/generate',
        history: 'GET /api/resume/history/:patientId',
        get: 'GET /api/resume/:resumeId',
        delete: 'DELETE /api/resume/:resumeId',
        cleanup: 'POST /api/resume/cleanup',
        stats: 'GET /api/resume/stats/global'
      },
      stats: {
        daily: 'GET /api/stats/daily',
        weekly: 'GET /api/stats/weekly',
        costs: 'GET /api/stats/costs',
        performance: 'GET /api/stats/performance',
        services: 'GET /api/stats/services',
        usage: 'GET /api/stats/usage/:patientId',
        errors: 'GET /api/stats/errors',
        dashboard: 'GET /api/stats/dashboard',
        export: 'POST /api/stats/export'
      }
    },
    services: {
      lm_studio: 'Local AI via LM Studio',
      whisper_local: 'Local speech-to-text',
      decision_tree: 'Rule-based responses'
    }
  });
});

module.exports = router;
