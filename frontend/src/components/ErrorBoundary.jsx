import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          fontFamily: 'var(--font-family)',
          maxWidth: '600px',
          margin: '2rem auto',
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
        }}>
          <h1 style={{ color: '#c53030', marginBottom: '1rem' }}>Une erreur s'est produite</h1>
          <p style={{ color: '#742a2a', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#0F2445',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Recharger la page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
