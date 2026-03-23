import React, { useState, useEffect } from 'react';
import styles from './ChatbotTester.module.css';
import AudioRecorder from './AudioRecorder';
import MedicalFileAnalyzer from './MedicalFileAnalyzer';

const API_URL = '/api/chatbot/message'; // Adapter si besoin

export default function ChatbotTester() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Écouter l'événement de transcription audio
  useEffect(() => {
    const handleTranscription = (event) => {
      const transcription = event.detail;
      if (transcription && transcription.trim()) {
        // Ajouter la transcription comme message utilisateur
        const userMsg = { sender: 'user', text: `[Audio] ${transcription}` };
        setMessages((msgs) => [...msgs, userMsg]);
        
        // Envoyer automatiquement au chatbot
        sendMessage(transcription);
      }
    };

    window.addEventListener('sendToChatbot', handleTranscription);
    return () => window.removeEventListener('sendToChatbot', handleTranscription);
  }, []);

  const sendMessage = async (messageText) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, patientId: 'test' })
      });
      if (!res.ok) throw new Error('Erreur API');
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.data?.response || data.response || '[Pas de réponse]' }]);
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Erreur lors de la requête: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    sendMessage(input);
    setInput('');
  };

  return (
    <div className={styles.chatbotTester}>
      <h2>Testeur de Chatbot</h2>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? styles.user : styles.bot}>
            <b>{msg.sender === 'user' ? 'Vous' : 'Bot'} :</b> {msg.text}
          </div>
        ))}
        {loading && <div className={styles.bot}><b>Bot :</b> ...</div>}
      </div>
      <form onSubmit={handleSend} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={loading}
          className={styles.input}
        />
        <button type="submit" disabled={loading || !input.trim()} className={styles.button}>
          Envoyer
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <AudioRecorder onTranscription={texte => {
        if (texte && texte.trim()) {
          setMessages(msgs => [...msgs, { sender: 'user', text: '[Transcription audio] ' + texte }]);
        }
      }} />
      <MedicalFileAnalyzer onAnalysis={recommendations => {
        if (recommendations && recommendations.trim()) {
          setMessages(msgs => [...msgs, 
            { sender: 'user', text: '[Analyse médicale] Veuillez analyser mes recommandations' },
            { sender: 'bot', text: recommendations }
          ]);
        }
      }} />
    </div>
  );
}
