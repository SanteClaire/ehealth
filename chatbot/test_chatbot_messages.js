require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3001/api/chatbot/message';

async function testMessages() {
  const testMessages = [
    { patientId: 'test1', message: 'Bonjour, j\'ai mal à la tête' },
    { patientId: 'test2', message: 'J\'ai la fièvre depuis hier' },
    { patientId: 'test3', message: 'Quels sont les symptômes de la grippe ?' },
    { patientId: 'test4', message: 'Je suis stressé' },
    { patientId: 'test5', message: 'Merci pour votre aide' }
  ];

  console.log('🧪 Test du chatbot médical...\n');

  for (const test of testMessages) {
    try {
      console.log(`📝 Message: "${test.message}"`);
      const response = await axios.post(API_URL, test);
      
      console.log(`✅ Réponse: ${JSON.stringify(response.data)}`);
      console.log(`📊 Source: ${response.data.data?.source || 'N/A'}`);
      console.log(`🎯 Catégorie: ${response.data.data?.category || 'N/A'}`);
      console.log(`💪 Confiance: ${response.data.data?.confidence || 'N/A'}`);
      console.log('---');
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
    }
  }
}

testMessages();
