import React, { useState } from 'react';

export default function MedicalFileAnalyzer({ onAnalysis }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Vérifier le type de fichier
      const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Veuillez sélectionner un fichier texte (.txt), PDF ou image');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('medicalFile', file);

    try {
      const res = await fetch('/api/chatbot/analyze-medical-file', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data.data);
        if (onAnalysis && data.data?.recommendations) {
          onAnalysis(data.data.recommendations);
        }
      } else {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
    } catch (err) {
      console.error('Erreur analyse:', err);
      setResult({ error: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ margin: '24px 0', padding: '20px', border: '2px dashed #2b7a78', borderRadius: '8px' }}>
      <h3 style={{ color: '#2b7a78', marginBottom: '16px' }}>📋 Analyse de Fichier Médical</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.pdf,.jpg,.jpeg,.png"
          style={{ marginRight: '12px' }}
        />
        <button
          onClick={analyzeFile}
          disabled={!file || analyzing}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: file && !analyzing ? '#2b7a78' : '#ccc',
            color: '#fff',
            border: 'none',
            cursor: file && !analyzing ? 'pointer' : 'not-allowed'
          }}
        >
          {analyzing ? 'Analyse...' : 'Analyser'}
        </button>
      </div>

      {file && (
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          Fichier sélectionné: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: result.error ? '#ffebee' : '#e8f5e8', 
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          {result.error ? (
            <div style={{ color: '#c62828' }}>
              <strong>Erreur:</strong> {result.error}
            </div>
          ) : (
            <div>
              <strong>📊 Analyse médicale:</strong>
              <div style={{ marginTop: '8px' }}>
                <strong>Recommandations:</strong> {result.recommendations || 'Aucune recommandation spécifique'}
              </div>
              {result.summary && (
                <div style={{ marginTop: '8px' }}>
                  <strong>Résumé:</strong> {result.summary}
                </div>
              )}
              {result.riskLevel && (
                <div style={{ marginTop: '8px' }}>
                  <strong>Niveau de risque:</strong> 
                  <span style={{ 
                    color: result.riskLevel === 'élevé' ? '#c62828' : 
                           result.riskLevel === 'modéré' ? '#f57c00' : '#388e3c'
                  }}>
                    {result.riskLevel}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
