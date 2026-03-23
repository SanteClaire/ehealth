// Mock simple des modèles MongoDB pour éviter les erreurs
const mockModels = {
  IAUsage: {
    logUsage: async () => ({}),
    getCostAlert: async () => ([]),
    getDailyStats: async () => ([])
  }
};

// Remplacer le module models par notre mock avant les imports
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === './src/models' || id.endsWith('/src/models')) {
    return mockModels;
  }
  return originalRequire.apply(this, arguments);
};

const { AIOrchestrator, LMStudioService } = require('./src/services/ai');

async function testLMStudio() {
  console.log('🚀 Test de LM Studio pour SantéClaire\n');

  try {
    // Test 1: Connexion LM Studio
    console.log('📡 Test 1: Connexion à LM Studio...');
    const lmStudio = new LMStudioService();
    
    // Attendre un peu pour la connexion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (lmStudio.isAvailable()) {
      console.log('✅ LM Studio connecté avec succès');
      console.log(`   Modèle: ${lmStudio.model}`);
      console.log(`   URL: ${lmStudio.baseURL}`);
    } else {
      console.log('❌ LM Studio non disponible');
      console.log('💡 Assurez-vous que LM Studio est démarré et qu\'un modèle est chargé');
      console.log('💡 URL attendue: http://localhost:1234');
      return;
    }

    // Test 2: Test simple de génération
    console.log('\n💬 Test 2: Test de génération simple...');
    try {
      const simpleResult = await lmStudio.generateChatbotResponse(
        "Bonjour, comment allez-vous ?",
        []
      );
      
      console.log('✅ Réponse générée avec succès:');
      console.log(`   Réponse: "${simpleResult.content.substring(0, 100)}..."`);
      console.log(`   Tokens: ${simpleResult.metadata.total_tokens}`);
      console.log(`   Temps: ${simpleResult.metadata.response_time_ms}ms`);
      console.log(`   Coût: ${simpleResult.metadata.total_cost}€ (GRATUIT!)`);
    } catch (error) {
      console.log('❌ Erreur génération simple:', error.message);
    }

    // Test 3: Test médical
    console.log('\n🩺 Test 3: Test question médicale...');
    try {
      const medicalResult = await lmStudio.generateChatbotResponse(
        "J'ai mal à la tête depuis ce matin, que dois-je faire ?",
        []
      );
      
      console.log('✅ Réponse médicale générée:');
      console.log(`   Réponse: "${medicalResult.content.substring(0, 150)}..."`);
      console.log(`   Tokens: ${medicalResult.metadata.total_tokens}`);
      console.log(`   Temps: ${medicalResult.metadata.response_time_ms}ms`);
    } catch (error) {
      console.log('❌ Erreur question médicale:', error.message);
    }

    // Test 4: Test avec l'orchestrateur (arbre de décision)
    console.log('\n🎯 Test 4: Test orchestrateur (arbre de décision)...');
    try {
      const orchestrator = new AIOrchestrator();
      
      const treeResult = await orchestrator.processChatbotMessage(
        "Comment prendre rendez-vous ?",
        'test-patient-123'
      );
      
      console.log('✅ Orchestrateur (arbre de décision):');
      console.log(`   Source: ${treeResult.source}`);
      console.log(`   Catégorie: ${treeResult.category}`);
      console.log(`   Réponse: "${treeResult.response.substring(0, 100)}..."`);
      console.log(`   Coût: ${treeResult.metadata.cost}€`);
    } catch (error) {
      console.log('❌ Erreur orchestrateur:', error.message);
    }

    // Test 5: Test orchestrateur avec LM Studio
    console.log('\n🧠 Test 5: Test orchestrateur (LM Studio)...');
    try {
      const orchestrator = new AIOrchestrator();
      
      const lmResult = await orchestrator.processChatbotMessage(
        "Expliquez-moi ce qu'est l'hypertension artérielle",
        'test-patient-456'
      );
      
      console.log('✅ Orchestrateur (LM Studio):');
      console.log(`   Source: ${lmResult.source}`);
      console.log(`   Catégorie: ${lmResult.category}`);
      console.log(`   Réponse: "${lmResult.response.substring(0, 150)}..."`);
      console.log(`   Coût: ${lmResult.metadata.cost}€`);
    } catch (error) {
      console.log('❌ Erreur orchestrateur LM Studio:', error.message);
    }

    // Test 6: Statut des services
    console.log('\n📊 Test 6: Statut des services...');
    try {
      const orchestrator = new AIOrchestrator();
      const status = orchestrator.getServicesStatus();
      
      console.log('✅ Statut des services:');
      console.log(`   Arbre de décision: ${status.decision_tree ? '✅' : '❌'}`);
      console.log(`   LM Studio: ${status.lm_studio ? '✅' : '❌'}`);
      console.log(`   Whisper Local: ${status.whisper_local ? '✅' : '❌'}`);
      console.log(`   Orchestrateur: ${status.orchestrator ? '✅' : '❌'}`);
    } catch (error) {
      console.log('❌ Erreur statut services:', error.message);
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📋 Instructions pour utiliser LM Studio:');
    console.log('1. Ouvrez LM Studio');
    console.log('2. Allez dans l\'onglet "Local Server"');
    console.log('3. Chargez votre modèle Gemma 3-4b');
    console.log('4. Démarrez le serveur sur le port 1234');
    console.log('5. Relancez ce test avec: node test-lm-studio.js');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}


// Lancer le test
if (require.main === module) {
  testLMStudio().catch(console.error);
}

module.exports = { testLMStudio };
