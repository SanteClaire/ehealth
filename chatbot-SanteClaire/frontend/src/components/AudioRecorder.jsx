import React, { useState, useRef } from 'react';

export default function AudioRecorder({ onTranscription }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setTranscription('');
    setAudioURL(null);
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioURL(URL.createObjectURL(blob));
      sendAudio(blob);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const sendAudio = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    try {
      const res = await fetch('/api/chatbot/transcribe', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      const transcription = data.data?.transcription || data.transcription || '[Pas de transcription]';
      setTranscription(transcription);
      
      // Envoyer automatiquement la transcription au chatbot
      if (onTranscription && transcription && transcription !== '[Pas de transcription]') {
        onTranscription(transcription);
        
        // Déclencher l'envoi au chatbot via un événement personnalisé
        const event = new CustomEvent('sendToChatbot', { detail: transcription });
        window.dispatchEvent(event);
      }
    } catch (err) {
      setTranscription('[Erreur lors de la transcription]');
    }
  };

  return (
    <div style={{ margin: '24px 0', textAlign: 'center' }}>
      <button onClick={recording ? stopRecording : startRecording} style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', background: recording ? '#c0392b' : '#2b7a78', color: '#fff', border: 'none', cursor: 'pointer' }}>
        {recording ? 'Arrêter' : '🎤 Enregistrer'}
      </button>
      {audioURL && (
        <div style={{ marginTop: 12 }}>
          <audio src={audioURL} controls />
        </div>
      )}
      {transcription && (
        <div style={{ marginTop: 12, fontStyle: 'italic', color: '#22223b' }}>
          <b>Transcription :</b> {transcription}
        </div>
      )}
    </div>
  );
}
