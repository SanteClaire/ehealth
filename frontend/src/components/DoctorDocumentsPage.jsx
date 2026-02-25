import { useState } from 'react'
import styles from './DoctorDocumentsPage.module.css'
import logo from '../assets/logo2.png'

export default function DoctorDocumentsPage({ onBack, onComplete }) {
    const [consents, setConsents] = useState({
        cgu: false,
        exact: false
    })

    const canSubmit = consents.cgu && consents.exact

    const handleSubmit = (e) => {
        e.preventDefault()
        if (canSubmit) {
            onComplete && onComplete()
        }
    }

    return (
        <div className={styles.page}>

            {/* ── Logo ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.logo} />
            </header>

            {/* ── Stepper ── */}
            <div className={styles.stepper}>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 1</span>
                    <span className={styles.stepTitle}>Informations</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 2</span>
                    <span className={styles.stepTitle}>Exercice</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 3 SUR 3</span>
                    <span className={styles.stepTitle}>Documents</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
            </div>

            {/* ── Card ── */}
            <main className={styles.card}>
                <div className={styles.badgeWrap}>
                    <span className={styles.badge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                        Vérification requise
                    </span>
                </div>

                <h1 className={styles.heading}>Documents justificatifs</h1>
                <p className={styles.subheading}>
                    Afin de vérifier votre identité professionnelle, nous avons besoin des documents suivants. Votre compte sera activé sous 24 à 48h.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* CPS */}
                    <div className={styles.uploadSection}>
                        <div className={styles.uploadHeader}>
                            <label className={styles.uploadLabel}>Carte professionnelle de santé (CPS) *</label>
                            <span className={styles.tagRequis}>Requis</span>
                        </div>
                        <div className={styles.dropZone}>
                            <div className={styles.dropIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></svg>
                            </div>
                            <p className={styles.dropText}>Glissez votre fichier ici ou <strong>Parcourir &nbsp;→</strong></p>
                            <p className={styles.dropHint}>PDF, JPG ou PNG (max. 5 Mo)</p>
                        </div>
                    </div>

                    {/* Diplôme */}
                    <div className={styles.uploadSection}>
                        <div className={styles.uploadHeader}>
                            <label className={styles.uploadLabel}>Diplôme de médecine *</label>
                            <span className={styles.tagRequis}>Requis</span>
                        </div>
                        <div className={styles.dropZone}>
                            <div className={styles.dropIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                            </div>
                            <p className={styles.dropText}>Glissez votre fichier ici ou <strong>Parcourir &nbsp;→</strong></p>
                            <p className={styles.dropHint}>PDF, JPG ou PNG (max. 5 Mo)</p>
                        </div>
                    </div>

                    {/* Justificatif d'exercice */}
                    <div className={styles.uploadSection}>
                        <div className={styles.uploadHeader}>
                            <label className={styles.uploadLabel}>Justificatif d'exercice</label>
                            <span className={styles.tagOptionnel}>Optionnel</span>
                        </div>
                        <div className={styles.dropZone}>
                            <div className={styles.dropIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
                            </div>
                            <p className={styles.dropText}>Glissez votre fichier ici ou <strong>Parcourir &nbsp;→</strong></p>
                            <p className={styles.dropHint}>Feuille de soins, attestation CPAM, etc.</p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className={styles.infoBox}>
                        <div className={styles.infoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A3412" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                        </div>
                        <div className={styles.infoContent}>
                            <span className={styles.infoTitle}>Délai de vérification : 24 à 48h ouvrées.</span>
                            <p className={styles.infoText}>
                                Vous recevrez un email de confirmation dès que votre compte sera activé. En attendant, vous pouvez explorer l'interface en mode démo.
                            </p>
                        </div>
                    </div>

                    {/* Consents */}
                    <div className={styles.consents}>
                        <label className={styles.checkRow}>
                            <input type="checkbox" checked={consents.cgu}
                                onChange={(e) => setConsents(c => ({ ...c, cgu: e.target.checked }))} />
                            <span>J'accepte les <a href="#" className={styles.link}>CGU</a> et la <a href="#" className={styles.link}>Politique de confidentialité</a> *</span>
                        </label>
                        <label className={styles.checkRow}>
                            <input type="checkbox" checked={consents.exact}
                                onChange={(e) => setConsents(c => ({ ...c, exact: e.target.checked }))} />
                            <span>Je certifie que les informations fournies sont exactes et authentiques *</span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className={styles.buttons}>
                        <button type="button" className={styles.btnBack} onClick={onBack}>
                            ← Retour
                        </button>
                        <button type="submit" className={styles.btnSubmit} disabled={!canSubmit}>
                            Soumettre ma demande &nbsp;
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                        </button>
                    </div>
                </form>
            </main>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                Besoin d'aide ? Contactez notre support au <strong>01 02 03 04 05</strong>
            </footer>
        </div>
    )
}
