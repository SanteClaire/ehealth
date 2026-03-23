const express = require('express');
const { IAUsage } = require('../models');
const { AIOrchestrator } = require('../services/ai');
const winston = require('winston');

const router = express.Router();

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Initialiser l'orchestrateur IA
const aiOrchestrator = new AIOrchestrator();

/**
 * GET /api/stats/daily
 * Statistiques d'utilisation quotidiennes
 */
router.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;
    
    let targetDate = new Date();
    if (date) {
      targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({
          error: 'Format de date invalide (utilisez YYYY-MM-DD)',
          code: 'INVALID_DATE_FORMAT'
        });
      }
    }

    const dailyStats = await IAUsage.getDailyStats(targetDate);
    
    res.json({
      success: true,
      data: {
        date: targetDate.toISOString().split('T')[0],
        statistics: dailyStats
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques quotidiennes:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques quotidiennes',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/weekly
 * Statistiques d'utilisation hebdomadaires
 */
router.get('/weekly', async (req, res) => {
  try {
    const { weeks = 4 } = req.query;
    
    const weeklyStats = await IAUsage.getWeeklyStats(parseInt(weeks));
    
    res.json({
      success: true,
      data: {
        weeks: parseInt(weeks),
        statistics: weeklyStats
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques hebdomadaires:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques hebdomadaires',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/costs
 * Analyse des coûts et alertes budgétaires
 */
router.get('/costs', async (req, res) => {
  try {
    const { threshold } = req.query;
    const maxDailyCost = parseFloat(threshold) || parseFloat(process.env.MAX_DAILY_COST) || 2.0;
    
    const [costAlert, monthlyStats] = await Promise.all([
      IAUsage.getCostAlert(maxDailyCost),
      IAUsage.getMonthlyCosts()
    ]);

    res.json({
      success: true,
      data: {
        dailyBudget: maxDailyCost,
        todayAlert: costAlert.length > 0 ? costAlert[0] : null,
        monthlyBreakdown: monthlyStats
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques coûts:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques coûts',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/performance
 * Statistiques de performance des services
 */
router.get('/performance', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const performanceStats = await IAUsage.getPerformanceStats(parseInt(days));
    
    res.json({
      success: true,
      data: {
        period: `${days} derniers jours`,
        statistics: performanceStats
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques performance:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques performance',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/services
 * Statut et statistiques des services IA
 */
router.get('/services', async (req, res) => {
  try {
    const [servicesStatus, globalStats] = await Promise.all([
      Promise.resolve(aiOrchestrator.getServicesStatus()),
      aiOrchestrator.getGlobalStats()
    ]);

    res.json({
      success: true,
      data: {
        status: servicesStatus,
        statistics: globalStats,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques services:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques services',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/usage/:patientId
 * Statistiques d'utilisation par patient
 */
router.get('/usage/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const patientStats = await IAUsage.getPatientStats(patientId, parseInt(days));
    
    res.json({
      success: true,
      data: {
        patientId,
        period: `${days} derniers jours`,
        statistics: patientStats
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques patient:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques patient',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/errors
 * Analyse des erreurs et problèmes
 */
router.get('/errors', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const errorStats = await IAUsage.getErrorAnalysis(parseInt(days));
    
    res.json({
      success: true,
      data: {
        period: `${days} derniers jours`,
        errors: errorStats
      }
    });

  } catch (error) {
    logger.error('❌ Erreur statistiques erreurs:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération statistiques erreurs',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/stats/dashboard
 * Données pour tableau de bord principal
 */
router.get('/dashboard', async (req, res) => {
  try {
    const [
      dailyStats,
      servicesStatus,
      costAlert,
      recentErrors
    ] = await Promise.all([
      IAUsage.getDailyStats(),
      Promise.resolve(aiOrchestrator.getServicesStatus()),
      IAUsage.getCostAlert(parseFloat(process.env.MAX_DAILY_COST) || 2.0),
      IAUsage.getErrorAnalysis(1) // Erreurs du jour
    ]);

    // Calculer quelques métriques rapides
    const todayRequests = dailyStats.reduce((sum, stat) => sum + stat.total_requests, 0);
    const todayCost = dailyStats.reduce((sum, stat) => sum + stat.total_cost, 0);
    const avgResponseTime = dailyStats.length > 0 
      ? dailyStats.reduce((sum, stat) => sum + stat.avg_response_time, 0) / dailyStats.length 
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          todayRequests,
          todayCost,
          avgResponseTime: Math.round(avgResponseTime),
          servicesOnline: Object.values(servicesStatus).filter(status => status).length,
          totalServices: Object.keys(servicesStatus).length
        },
        services: servicesStatus,
        budget: {
          used: todayCost,
          limit: parseFloat(process.env.MAX_DAILY_COST) || 2.0,
          alert: costAlert.length > 0 ? costAlert[0] : null
        },
        errors: {
          todayCount: recentErrors.reduce((sum, error) => sum + error.error_count, 0),
          recentErrors: recentErrors.slice(0, 5) // Top 5 erreurs
        },
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Erreur données dashboard:', error.message);
    
    res.status(500).json({
      error: 'Erreur récupération données dashboard',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/stats/export
 * Exporte les statistiques en CSV
 */
router.post('/export', async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Dates de début et fin requises',
        code: 'MISSING_DATE_RANGE'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: 'Format de date invalide',
        code: 'INVALID_DATE_FORMAT'
      });
    }

    const exportData = await IAUsage.exportStats(start, end);

    if (format === 'csv') {
      // Convertir en CSV
      const csv = convertToCSV(exportData);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="stats_${startDate}_${endDate}.csv"`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: {
          period: { startDate, endDate },
          statistics: exportData,
          exportedAt: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    logger.error('❌ Erreur export statistiques:', error.message);
    
    res.status(500).json({
      error: 'Erreur export statistiques',
      code: 'EXPORT_ERROR'
    });
  }
});

/**
 * Convertit les données en format CSV
 */
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' ? `"${value}"` : value
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

module.exports = router;
