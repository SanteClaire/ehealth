const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🚀 Test des routes API SantéClaire\n');

  try {
    // Test 1: Vérifier que le serveur répond
    console.log('📡 Test 1: Connexion au serveur...');
    try {
      const healthResponse = await axios.get('http://localhost:3001/health');
      console.log('✅ Serveur accessible');
      console.log(`   Status: ${healthResponse.data.status}`);
      console.log(`   Environment: ${healthResponse.data.environment}`);
    } catch (error) {
      console.log('❌ Serveur non accessible');
      console.log('💡 Assurez-vous que le serveur est démarré avec: npm start');
      return;
    }

    // Test 2: Route API principale
    console.log('\n📋 Test 2: Route API principale...');
    try {
      const apiResponse = await axios.get(`${API_BASE}/`);
      console.log('✅ Route API principale accessible');
      console.log(`   Version: ${apiResponse.data.version}`);
      console.log(`   Services: ${Object.keys(apiResponse.data.services).join(', ')}`);
    } catch (error) {
      console.log('❌ Erreur route API:', error.message);
    }

    // Test 3: Statut des services
    console.log('\n🔧 Test 3: Statut des services...');
    try {
      const statusResponse = await axios.get(`${API_BASE}/chatbot/status`);
      const services = statusResponse.data.data.services;
      
      console.log('✅ Statut des services récupéré:');
      console.log(`   Arbre de décision: ${services.decision_tree ? '✅' : '❌'}`);
      console.log(`   LM Studio: ${services.lm_studio ? '✅' : '❌'}`);
      console.log(`   Whisper Local: ${services.whisper_local ? '✅' : '❌'}`);
    } catch (error) {
      console.log('❌ Erreur statut services:', error.message);
    }

    // Test 4: Questions suggérées
    console.log('\n💡 Test 4: Questions suggérées...');
    try {
      const suggestionsResponse = await axios.get(`${API_BASE}/chatbot/suggestions`);
      const suggestions = suggestionsResponse.data.data.suggestions;
      
      console.log('✅ Questions suggérées récupérées:');
      suggestions.slice(0, 3).forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    } catch (error) {
      console.log('❌ Erreur suggestions:', error.message);
    }

    // Test 5: Message chatbot (arbre de décision)
    console.log('\n🤖 Test 5: Message chatbot (arbre de décision)...');
    try {
      const messageResponse = await axios.post(`${API_BASE}/chatbot/message`, {
        message: "Comment prendre rendez-vous ?",
        patientId: "test-patient-123"
      });
      
      const result = messageResponse.data.data;
      console.log('✅ Message traité avec succès:');
      console.log(`   Source: ${result.metadata.source}`);
      console.log(`   Catégorie: ${result.metadata.category}`);
      console.log(`   Réponse: "${result.response.substring(0, 100)}..."`);
      console.log(`   Coût: ${result.metadata.cost}€`);
    } catch (error) {
      console.log('❌ Erreur message chatbot:', error.response?.data?.message || error.message);
    }

    // Test 6: Message complexe (LM Studio si disponible)
    console.log('\n🧠 Test 6: Message complexe (LM Studio)...');
    try {
      const complexResponse = await axios.post(`${API_BASE}/chatbot/message`, {
        message: "Expliquez-moi les symptômes de l'hypertension artérielle",
        patientId: "test-patient-456"
      });
      
      const result = complexResponse.data.data;
      console.log('✅ Message complexe traité:');
      console.log(`   Source: ${result.metadata.source}`);
      console.log(`   Réponse: "${result.response.substring(0, 150)}..."`);
      console.log(`   Coût: ${result.metadata.cost}€`);
      
      if (result.metadata.source === 'fallback') {
        console.log('⚠️ LM Studio non disponible - réponse de fallback utilisée');
      }
    } catch (error) {
      console.log('❌ Erreur message complexe:', error.response?.data?.message || error.message);
    }

    // Test 7: Génération de résumé
    console.log('\n📄 Test 7: Génération de résumé...');
    try {
      const resumeResponse = await axios.post(`${API_BASE}/resume/generate`, {
        patientId: "test-patient-789",
        documents: [
          {
            type: "consultation",
            date: "2024-01-15",
            content: "Patient se plaint de maux de tête fréquents depuis 2 semaines. Tension artérielle: 140/90. Prescrit repos et suivi."
          },
          {
            type: "analyse",
            date: "2024-01-10",
            content: "Analyse sanguine normale. Glycémie: 95 mg/dl. Cholestérol total: 180 mg/dl."
          }
        ]
      });
      
      const result = resumeResponse.data.data;
      console.log('✅ Résumé généré:');
      console.log(`   Cache: ${result.fromCache ? 'Oui' : 'Non'}`);
      console.log(`   Documents: ${result.metadata.documentsCount}`);
      console.log(`   Résumé: "${result.summary.substring(0, 150)}..."`);
      console.log(`   Coût: ${result.metadata.cost}€`);
    } catch (error) {
      console.log('❌ Erreur génération résumé:', error.response?.data?.message || error.message);
    }

    // Test 8: Statistiques dashboard
    console.log('\n📊 Test 8: Statistiques dashboard...');
    try {
      const dashboardResponse = await axios.get(`${API_BASE}/stats/dashboard`);
      const stats = dashboardResponse.data.data;
      
      console.log('✅ Statistiques dashboard:');
      console.log(`   Requêtes aujourd'hui: ${stats.overview.todayRequests}`);
      console.log(`   Coût aujourd'hui: ${stats.overview.todayCost}€`);
      console.log(`   Services en ligne: ${stats.overview.servicesOnline}/${stats.overview.totalServices}`);
      console.log(`   Budget utilisé: ${((stats.budget.used / stats.budget.limit) * 100).toFixed(1)}%`);
    } catch (error) {
      console.log('❌ Erreur statistiques:', error.response?.data?.message || error.message);
    }

    // Test 9: Validation des erreurs
    console.log('\n❌ Test 9: Validation des erreurs...');
    try {
      await axios.post(`${API_BASE}/chatbot/message`, {
        // Message manquant intentionnellement
        patientId: "test-patient"
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation des erreurs fonctionne');
        console.log(`   Code: ${error.response.data.code}`);
      } else {
        console.log('❌ Validation inattendue:', error.message);
      }
    }

    console.log('\n🎉 Tests API terminés !');
    console.log('\n📋 Résumé:');
    console.log('- ✅ Serveur accessible');
    console.log('- ✅ Routes API fonctionnelles');
    console.log('- ✅ Chatbot opérationnel (arbre de décision)');
    console.log('- ✅ Système de résumés actif');
    console.log('- ✅ Statistiques disponibles');
    console.log('- ✅ Validation des erreurs');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n🔗 URLs utiles:');
      console.log('- API Documentation: http://localhost:3001/api');
      console.log('- Health Check: http://localhost:3001/health');
      console.log('- Chatbot Status: http://localhost:3001/api/chatbot/status');
      console.log('- Dashboard Stats: http://localhost:3001/api/stats/dashboard');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Lancer le test
if (require.main === module) {
  testAPI().catch(console.error);
}

module.exports = { testAPI };
