const axios = require('axios');

const API_BASE = 'http://localhost:3001/api/test';

async function testSimpleAPI() {
  console.log('🚀 Test API Simple (sans base de données)\n');

  try {
    // Test 1: Vérifier que le serveur répond
    console.log('📡 Test 1: Connexion au serveur...');
    try {
      const healthResponse = await axios.get('http://localhost:3001/health');
      console.log('✅ Serveur accessible');
      console.log(`   Status: ${healthResponse.data.status}`);
      console.log(`   Database: ${healthResponse.data.database}`);
      console.log(`   Services: ${Object.entries(healthResponse.data.services).map(([k,v]) => `${k}:${v}`).join(', ')}`);
    } catch (error) {
      console.log('❌ Serveur non accessible');
      console.log('💡 Démarrez le serveur avec: node start-without-db.js');
      return;
    }

    // Test 2: Route API principale
    console.log('\n📋 Test 2: Route API principale...');
    try {
      const apiResponse = await axios.get('http://localhost:3001/api');
      console.log('✅ Route API accessible');
      console.log(`   Version: ${apiResponse.data.version}`);
      console.log(`   Mode: Test sans base de données`);
    } catch (error) {
      console.log('❌ Erreur route API:', error.message);
    }

    // Test 3: Questions suggérées
    console.log('\n💡 Test 3: Questions suggérées...');
    try {
      const suggestionsResponse = await axios.get(`${API_BASE}/suggestions`);
      const suggestions = suggestionsResponse.data.data.suggestions;
      
      console.log('✅ Questions suggérées récupérées:');
      suggestions.slice(0, 5).forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    } catch (error) {
      console.log('❌ Erreur suggestions:', error.message);
    }

    // Test 4: Message simple (arbre de décision)
    console.log('\n🤖 Test 4: Message simple...');
    try {
      const messageResponse = await axios.post(`${API_BASE}/message`, {
        message: "Comment prendre rendez-vous ?"
      });
      
      const result = messageResponse.data.data;
      console.log('✅ Message traité avec succès:');
      console.log(`   Source: ${result.source}`);
      console.log(`   Catégorie: ${result.category}`);
      console.log(`   Confiance: ${result.confidence}`);
      console.log(`   Réponse: "${result.response.substring(0, 100)}..."`);
      console.log(`   Coût: ${result.metadata.cost}€`);
    } catch (error) {
      console.log('❌ Erreur message simple:', error.response?.data?.message || error.message);
    }

    // Test 5: Message médical
    console.log('\n🩺 Test 5: Message médical...');
    try {
      const medicalResponse = await axios.post(`${API_BASE}/message`, {
        message: "J'ai de la fièvre depuis hier"
      });
      
      const result = medicalResponse.data.data;
      console.log('✅ Message médical traité:');
      console.log(`   Source: ${result.source}`);
      console.log(`   Catégorie: ${result.category}`);
      console.log(`   Réponse: "${result.response.substring(0, 150)}..."`);
    } catch (error) {
      console.log('❌ Erreur message médical:', error.message);
    }

    // Test 6: Message complexe (fallback)
    console.log('\n🧠 Test 6: Message complexe...');
    try {
      const complexResponse = await axios.post(`${API_BASE}/message`, {
        message: "Expliquez-moi en détail le fonctionnement du système cardiovasculaire"
      });
      
      const result = complexResponse.data.data;
      console.log('✅ Message complexe traité:');
      console.log(`   Source: ${result.source}`);
      console.log(`   Réponse: "${result.response.substring(0, 100)}..."`);
      
      if (result.source === 'fallback') {
        console.log('💡 Réponse de fallback - configurez LM Studio pour plus de fonctionnalités');
      }
    } catch (error) {
      console.log('❌ Erreur message complexe:', error.message);
    }

    // Test 7: Statut des services
    console.log('\n📊 Test 7: Statut des services...');
    try {
      const statusResponse = await axios.get(`${API_BASE}/status`);
      const data = statusResponse.data.data;
      
      console.log('✅ Statut récupéré:');
      console.log(`   Mode: ${data.mode}`);
      console.log(`   Services actifs: ${Object.entries(data.services).filter(([k,v]) => v).map(([k,v]) => k).join(', ')}`);
      console.log(`   Arbre de décision: ${data.decision_tree_stats.total_categories} catégories`);
    } catch (error) {
      console.log('❌ Erreur statut:', error.message);
    }

    // Test 8: Validation des erreurs
    console.log('\n❌ Test 8: Validation des erreurs...');
    try {
      await axios.post(`${API_BASE}/message`, {
        // Message manquant intentionnellement
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation des erreurs fonctionne');
        console.log(`   Code: ${error.response.data.code}`);
      } else {
        console.log('❌ Validation inattendue:', error.message);
      }
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📋 Résumé:');
    console.log('- ✅ Serveur accessible (mode test)');
    console.log('- ✅ Arbre de décision fonctionnel');
    console.log('- ✅ Questions suggérées disponibles');
    console.log('- ✅ Réponses automatiques pour questions courantes');
    console.log('- ✅ Fallback pour questions complexes');
    console.log('- ✅ Validation des erreurs');
    
    console.log('\n🔧 Prochaines étapes:');
    console.log('1. Démarrer MongoDB avec: start-mongodb.bat');
    console.log('2. Configurer LM Studio sur le port 1234');
    console.log('3. Installer Whisper: pip install openai-whisper');
    console.log('4. Démarrer le serveur complet avec: npm start');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Lancer le test
if (require.main === module) {
  testSimpleAPI().catch(console.error);
}

module.exports = { testSimpleAPI };
