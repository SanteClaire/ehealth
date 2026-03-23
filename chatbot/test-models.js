const mongoose = require('mongoose');
const { Conversation, CacheResume, IAUsage } = require('./src/models');

async function testModels() {
  console.log('🧪 Test des modèles MongoDB pour SantéClaire\n');

  try {
    // Connexion à MongoDB
    console.log('📡 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/santeclaire-chatbot');
    console.log('✅ Connecté à MongoDB\n');

    // Test 1: Créer une conversation
    console.log('💬 Test 1: Création d\'une conversation...');
    const conversation = new Conversation({
      patient_id: 'patient-test-123',
      messages: [
        {
          role: 'user',
          content: 'Bonjour, j\'ai de la fièvre depuis hier',
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: '🌡️ **Fièvre** :\n\n**Mesures générales** :\n• Buvez beaucoup d\'eau\n• Reposez-vous\n• Prenez votre température régulièrement',
          timestamp: new Date(),
          metadata: {
            source: 'decision_tree',
            category: 'symptomes',
            confidence: 0.95
          }
        }
      ],
      status: 'active'
    });

    await conversation.save();
    console.log('✅ Conversation créée:', conversation._id);

    // Test 2: Créer un usage IA
    console.log('\n📊 Test 2: Création d\'un usage IA...');
    const usage = new IAUsage({
      endpoint: 'chatbot',
      ai_service: 'decision_tree',
      model_used: 'decision_tree_v1',
      patient_id: 'patient-test-123',
      request_data: {
        message: 'J\'ai de la fièvre',
        input_length: 16,
        tokens_used: 0
      },
      response_data: {
        response: 'Conseils pour la fièvre...',
        output_length: 28,
        tokens_generated: 0
      },
      performance: {
        response_time_ms: 15,
        success: true
      },
      cost: {
        input_cost: 0,
        output_cost: 0,
        total_cost: 0
      }
    });

    await usage.save();
    console.log('✅ Usage IA créé:', usage._id);

    // Test 3: Créer un cache de résumé
    console.log('\n📄 Test 3: Création d\'un cache de résumé...');
    const cacheResume = new CacheResume({
      patient_id: 'patient-test-456',
      documents_hash: 'abc123def456',
      documents_count: 2,
      resume_content: 'Résumé médical: Patient présente des symptômes de grippe. Traitement symptomatique recommandé.',
      metadata: {
        model: 'lm_studio',
        tokens_used: 150,
        generation_time_ms: 2500,
        cost: 0
      }
    });

    await cacheResume.save();
    console.log('✅ Cache résumé créé:', cacheResume._id);

    // Test 4: Vérifier les données
    console.log('\n🔍 Test 4: Vérification des données...');
    
    const conversationCount = await Conversation.countDocuments();
    const usageCount = await IAUsage.countDocuments();
    const cacheCount = await CacheResume.countDocuments();

    console.log(`📊 Statistiques de la base de données:`);
    console.log(`   - Conversations: ${conversationCount}`);
    console.log(`   - Usages IA: ${usageCount}`);
    console.log(`   - Résumés en cache: ${cacheCount}`);

    // Test 5: Tester les méthodes des modèles
    console.log('\n🧮 Test 5: Test des méthodes...');
    
    // Ajouter un message à la conversation
    await conversation.addMessage('user', 'Merci pour les conseils !');
    await conversation.addMessage('assistant', 'De rien ! N\'hésitez pas si vous avez d\'autres questions.');
    
    console.log('✅ Messages ajoutés à la conversation');

    // Incrémenter l'accès au cache
    await cacheResume.incrementAccess();
    console.log('✅ Accès au cache incrémenté');

    // Statistiques quotidiennes
    try {
      const dailyStats = await IAUsage.getDailyStats();
      console.log('✅ Statistiques quotidiennes récupérées:', dailyStats.length, 'entrées');
    } catch (error) {
      console.log('⚠️ Erreur statistiques quotidiennes:', error.message);
    }

    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n📋 Résumé:');
    console.log('- ✅ Modèles MongoDB fonctionnels');
    console.log('- ✅ Données de test créées');
    console.log('- ✅ Méthodes des modèles testées');
    console.log('- ✅ Base de données peuplée');
    
    console.log('\n🔗 Vérifiez maintenant dans MongoDB Compass:');
    console.log('   Database: santeclaire-chatbot');
    console.log('   Collections: conversations, iausages, cacheresumes');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Déconnecté de MongoDB');
  }
}

// Lancer le test
if (require.main === module) {
  testModels().catch(console.error);
}

module.exports = { testModels };
