import { useEffect } from 'react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose }) {
    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        if (isOpen) {
            document.addEventListener('keydown', handler)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handler)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className={styles.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className={styles.modal}>
                <button className={styles.close} onClick={onClose}>✕</button>
                <div className={styles.title}>Qui êtes-vous ?</div>
                <p className={styles.sub}>
                    Sélectionnez votre profil pour créer votre espace SantéClaire.
                </p>

                <div className={styles.cards}>
                    <div
                        className={`${styles.card} ${styles.patient}`}
                        onClick={() => alert('→ Redirection vers inscription patient')}
                    >
                        <div className={styles.icon}>👤</div>
                        <div className={styles.cardTitle}>Je suis patient</div>
                        <div className={styles.cardDesc}>
                            Centralisez vos documents et partagez-les avec vos médecins en toute sécurité.
                        </div>
                        <div className={`${styles.badge} ${styles.free}`}>✓ Inscription en 2 min</div>
                    </div>

                    <div
                        className={`${styles.card} ${styles.medecin}`}
                        onClick={() => alert('→ Redirection vers inscription médecin étape 1')}
                    >
                        <div className={styles.icon}>🩺</div>
                        <div className={styles.cardTitle}>Je suis médecin</div>
                        <div className={styles.cardDesc}>
                            Accédez aux dossiers patients, transcription IA et comptes rendus automatiques.
                        </div>
                        <div className={`${styles.badge} ${styles.pro}`}>⏱ Vérification 24-48h</div>
                    </div>
                </div>

                <p className={styles.footerNote}>
                    Vous avez déjà un compte ? <a href="#">Se connecter</a>
                </p>
            </div>
        </div>
    )
}
