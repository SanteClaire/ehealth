const request = require('supertest');

// Mock MongoDB pour les tests
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({
    connection: { host: 'localhost' }
  }),
  connection: {
    on: jest.fn(),
    close: jest.fn()
  }
}));

// Mock winston pour éviter les logs pendant les tests
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn()
  },
  transports: {
    Console: jest.fn()
  }
}));

describe('SantéClaire Chatbot API', () => {
  let app;

  beforeEach(() => {
    // Reset modules pour chaque test
    jest.resetModules();
    app = require('../src/app');
  });

  describe('GET /health', () => {
    it('devrait retourner le statut de santé du serveur', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('Route inexistante', () => {
    it('devrait retourner 404 pour une route inexistante', async () => {
      const response = await request(app)
        .get('/route-inexistante')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route non trouvée');
    });
  });
});
