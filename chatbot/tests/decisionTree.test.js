const DecisionTreeService = require('../src/services/ai/decisionTree');

describe('DecisionTreeService', () => {
  let decisionTree;

  beforeEach(() => {
    decisionTree = new DecisionTreeService();
  });

  describe('analyzeMessage', () => {
    it('devrait reconnaître une question sur les médicaments', () => {
      const result = decisionTree.analyzeMessage("J'ai oublié de prendre mon médicament");
      
      expect(result).not.toBeNull();
      expect(result.category).toBe('medicaments');
      expect(result.source).toBe('decision_tree');
      expect(result.response).toContain('Oubli de médicament');
    });

    it('devrait reconnaître une question sur la fièvre', () => {
      const result = decisionTree.analyzeMessage("J'ai de la fièvre, que faire ?");
      
      expect(result).not.toBeNull();
      expect(result.category).toBe('symptomes');
      expect(result.response).toContain('Fièvre');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('devrait reconnaître une urgence', () => {
      const result = decisionTree.analyzeMessage("C'est urgent, j'ai besoin d'aide !");
      
      expect(result).not.toBeNull();
      expect(result.category).toBe('urgences');
      expect(result.response).toContain('URGENCES MÉDICALES');
      expect(result.response).toContain('15');
    });

    it('devrait reconnaître une question sur les rendez-vous', () => {
      const result = decisionTree.analyzeMessage("Comment prendre rendez-vous avec un médecin ?");
      
      expect(result).not.toBeNull();
      expect(result.category).toBe('rendezvous');
      expect(result.response).toContain('Prendre rendez-vous');
    });

    it('devrait retourner null pour un message non reconnu', () => {
      const result = decisionTree.analyzeMessage("Bonjour, comment allez-vous ?");
      
      expect(result).toBeNull();
    });

    it('devrait gérer les messages vides ou invalides', () => {
      expect(decisionTree.analyzeMessage("")).toBeNull();
      expect(decisionTree.analyzeMessage(null)).toBeNull();
      expect(decisionTree.analyzeMessage(undefined)).toBeNull();
    });
  });

  describe('normalizeText', () => {
    it('devrait normaliser le texte correctement', () => {
      const result = decisionTree.normalizeText("Médecin, j'ai mal à la tête !");
      expect(result).toBe('medecin j ai mal a la tete');
    });

    it('devrait supprimer les accents', () => {
      const result = decisionTree.normalizeText("fièvre élevée");
      expect(result).toBe('fievre elevee');
    });
  });

  describe('getSuggestedQuestions', () => {
    it('devrait retourner une liste de questions suggérées', () => {
      const suggestions = decisionTree.getSuggestedQuestions();
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toContain('médicaments');
    });
  });

  describe('getStatistics', () => {
    it('devrait retourner les statistiques de l\'arbre de décision', () => {
      const stats = decisionTree.getStatistics();
      
      expect(stats).toHaveProperty('categories');
      expect(stats).toHaveProperty('responses');
      expect(stats).toHaveProperty('keywords');
      expect(stats).toHaveProperty('categories_list');
      
      expect(stats.categories).toBeGreaterThan(0);
      expect(stats.responses).toBeGreaterThan(0);
      expect(stats.keywords).toBeGreaterThan(0);
      expect(Array.isArray(stats.categories_list)).toBe(true);
    });
  });

  describe('Cas d\'usage réels', () => {
    const testCases = [
      {
        message: "J'ai mal à la gorge depuis 2 jours",
        expectedCategory: 'symptomes',
        shouldContain: 'gorge'
      },
      {
        message: "Comment bien me laver les mains ?",
        expectedCategory: 'prevention',
        shouldContain: 'mains'
      },
      {
        message: "Je veux annuler mon rendez-vous",
        expectedCategory: 'rendezvous',
        shouldContain: 'Modifier un rendez-vous'
      },
      {
        message: "Quelle dose de paracétamol prendre ?",
        expectedCategory: 'medicaments',
        shouldContain: 'posologie'
      }
    ];

    testCases.forEach(({ message, expectedCategory, shouldContain }) => {
      it(`devrait traiter: "${message}"`, () => {
        const result = decisionTree.analyzeMessage(message);
        
        expect(result).not.toBeNull();
        expect(result.category).toBe(expectedCategory);
        expect(result.response.toLowerCase()).toContain(shouldContain.toLowerCase());
      });
    });
  });
});
