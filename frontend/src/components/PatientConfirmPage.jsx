import { CheckCircle2, FileText, Upload, Shield, Calendar, ArrowRight } from 'lucide-react'
import styles from './PatientConfirmPage.module.css'
import logo from '../assets/logo2.png'

export default function PatientConfirmPage({ onDashboard }) {

    return (
        <div className={styles.page}>

            {/* ── Logo ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.logo} />
            </header>

            {/* ── Stepper ── */}
            <div className={styles.stepper}>
                <div className={styles.step}>
                    <span className={styles.stepCheck}>
                        <CheckCircle2 size={16} color="#fff" strokeWidth={3} /> {/* Changed Check to CheckCircle2 based on instruction's import */}
                    </span>
                    <div>
                        <span className={styles.stepLabel}>ÉTAPE 1/2 : VOS</span>
                        <span className={styles.stepTitle}>INFORMATIONS</span>
                    </div>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepNum}>2</span>
                    <div>
                        <span className={styles.stepLabel}>ÉTAPE 2/2 :</span>
                        <span className={styles.stepTitle}>CONFIRMATION</span>
                    </div>
                </div>
            </div>

            {/* ── Card ── */}
            <main className={styles.card}>
                {/* Success icon */}
                <div className={styles.successIcon}>
                    <CheckCircle2 size={48} color="#fff" strokeWidth={2.5} />
                </div>

                <h1 className={styles.heading}>Félicitations, votre compte<br />est créé !</h1>
                <p className={styles.subheading}>Bienvenue sur SantéClaire, votre espace santé sécurisé.</p>

                {/* Steps */}
                <div className={styles.steps}>
                    <div className={styles.stepItem}>
                        <span className={styles.stepItemIcon}><Mail size={22} /></span>
                        <div>
                            <strong className={styles.stepItemTitle}>Vérifiez votre boîte mail</strong>
                            <p className={styles.stepItemDesc}>Un lien de confirmation vous a été envoyé pour valider votre accès.</p>
                        </div>
                    </div>
                    <div className={styles.stepItem}>
                        <span className={styles.stepItemIcon}><FolderOpen size={22} /></span>
                        <div>
                            <strong className={styles.stepItemTitle}>Complétez votre dossier</strong>
                            <p className={styles.stepItemDesc}>Commencez à uploader vos premiers documents pour centraliser votre santé.</p>
                        </div>
                    </div>
                    <div className={styles.stepItem}>
                        <span className={styles.stepItemIcon}><Bot size={22} /></span>
                        <div>
                            <strong className={styles.stepItemTitle}>Parlez à l'Assistant IA</strong>
                            <p className={styles.stepItemDesc}>Posez vos questions pour préparer au mieux votre premier RDV médical.</p>
                        </div>
                    </div>
                </div>

                <button className={styles.btnDashboard} onClick={onDashboard}>
                    Accéder à mon tableau de bord &nbsp;→
                </button>
            </main>

            {/* ── Footer ── */}
            <p className={styles.footer}>
                Besoin d'aide ? <a href="#" className={styles.supportLink}>Contactez notre support</a>
            </p>
        </div>
    )
}
