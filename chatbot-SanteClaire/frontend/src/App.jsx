import React from 'react';
import ChatbotTester from './components/ChatbotTester';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb' }}>
      <h1 style={{ textAlign: 'center', marginTop: 40 }}>Test du Chatbot</h1>
      <ChatbotTester />
    </div>
  );
}
