import { Check, Mail, Stethoscope, Hospital, FileText, Clock, Lightbulb, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './DoctorConfirmPage.module.css'
import logo from '../assets/logo.png'

export default function DoctorConfirmPage({ doctorName = 'Martin', email = 'dr.martin@hopital.fr', specialty = 'Médecine générale', structure = 'Cabinet Dr. Martin, Paris', docCount = 2, onDemo, onHome }) {
    const { t } = useLanguage()
    return (
        <div className={styles.page}>

            {/* ── Logo ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.logo} />
                <LanguageSwitcher />
            </header>

            {/* ── Success icon ── */}
            <div className={styles.successIcon}>
                <CheckCircle2 size={40} color="#fff" strokeWidth={3} />
            </div>

            <h1 className={styles.heading}>Demande envoyée avec succès !</h1>
            <p className={styles.subheading}>Merci Dr. {doctorName}. Votre dossier est en cours de vérification.</p>

            {/* ── Récapitulatif ── */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Récapitulatif</h2>
                <div className={styles.rows}>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>
                            <span className={styles.rowIcon}><Mail size={14} /></span> Email
                        </span>
                        <span className={styles.rowValue}>{email}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>
                            <span className={styles.rowIcon}><Stethoscope size={14} /></span> Spécialité
                        </span>
                        <span className={styles.rowValue}>{specialty}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>
                            <span className={styles.rowIcon}><Hospital size={14} /></span> Structure
                        </span>
                        <span className={styles.rowValue}>{structure}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>
                            <span className={styles.rowIcon}><FileText size={14} /></span> Documents
                        </span>
                        <span className={styles.rowValue}>{docCount} fichiers reçus <Check size={14} color="#22C55E" /></span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>
                            <span className={styles.rowIcon}><Clock size={14} /></span> Délai
                        </span>
                        <span className={styles.rowValue}>24 à 48h ouvrées</span>
                    </div>
                </div>
            </div>

            {/* ── Étapes suivantes ── */}
            <div className={styles.nextCard}>
                <h2 className={styles.nextTitle}>Étapes suivantes</h2>
                <div className={styles.timeline}>

                    {/* Step 1 — Done */}
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDotDone}>
                            <Check size={14} color="#fff" strokeWidth={3} />
                        </div>
                        <div className={styles.timelineLine} />
                        <div className={styles.timelineContent}>
                            <strong className={styles.timelineLabel}>Demande reçue</strong>
                            <span className={styles.timelineSub}>Maintenant</span>
                        </div>
                    </div>

                    {/* Step 2 — In progress */}
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDotProgress}>
                            <span className={styles.dotLetter}>C</span>
                        </div>
                        <div className={styles.timelineLine} />
                        <div className={styles.timelineContent}>
                            <strong className={styles.timelineLabel}>Vérification des documents</strong>
                            <span className={styles.timelineSubActive}>En cours</span>
                        </div>
                    </div>

                    {/* Step 3 — Pending */}
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDotPending} />
                        <div className={styles.timelineLine} />
                        <div className={styles.timelineContent}>
                            <strong className={styles.timelineLabelGray}>Email de confirmation</strong>
                            <span className={styles.timelineSub}>Sous 24-48h</span>
                        </div>
                    </div>

                    {/* Step 4 — Pending */}
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDotPending} />
                        <div className={styles.timelineContent}>
                            <strong className={styles.timelineLabelGray}>Accès activé</strong>
                            <span className={styles.timelineSub}>Après validation</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Info box ── */}
            <div className={styles.infoBox}>
                <span className={styles.infoEmoji}><Lightbulb size={20} /></span>
                <p className={styles.infoText}>
                    En attendant l'activation de votre compte, vous pouvez explorer l'interface en mode démo non connecté.
                </p>
            </div>

            {/* ── Buttons ── */}
            <div className={styles.buttons}>
                <button className={styles.btnDemo} onClick={onDemo}>
                    Explorer la démo &nbsp;→
                </button>
                <button className={styles.btnHome} onClick={onHome}>
                    Retour à l'accueil
                </button>
            </div>

            {/* ── Footer ── */}
            <p className={styles.footer}>
                Des questions ? Contactez-nous : <a href="mailto:support@santeclaire.fr" className={styles.supportLink}>support@santeclaire.fr</a>
            </p>

        </div>
    )
}
