import { User, Stethoscope, Check, AlertTriangle, ArrowLeft } from 'lucide-react'
import styles from './RegisterPage.module.css'
import logo from '../assets/logo2.png'

export default function RegisterPage({ onBack, onLogin, onPatient, onDoctor }) {
    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.headerLogo} />
                <button className={styles.backLink} onClick={onBack}>
                    <ArrowLeft size={15} /> Retour à l'accueil
                </button>
            </header>

            {/* ── Hero text ── */}
            <section className={styles.hero}>
                <h1 className={styles.title}>Qui êtes-vous&nbsp;?</h1>
                <p className={styles.subtitle}>Sélectionnez votre profil pour créer votre compte.</p>
            </section>

            {/* ── Cards ── */}
            <div className={styles.cards}>

                {/* Card Patient */}
                <div className={`${styles.card} ${styles.cardPatient}`}>
                    <div className={styles.iconWrap}>
                        <User size={32} strokeWidth={1.8} color="#1B3A6B" />
                    </div>

                    <h2 className={styles.cardTitle}>Je suis patient</h2>
                    <p className={styles.cardDesc}>
                        Centralisez vos documents médicaux, partagez-les avec vos médecins et
                        consultez votre Assistant IA pour mieux comprendre vos soins.
                    </p>

                    <ul className={styles.features}>
                        <li><span className={styles.check}><Check size={13} /></span> Inscription en 2 minutes</li>
                        <li><span className={styles.check}><Check size={13} /></span> Aucun document requis</li>
                        <li><span className={`${styles.check} ${styles.bold}`}><Check size={13} /></span> <strong>Gratuit</strong></li>
                    </ul>

                    <button className={`${styles.btn} ${styles.btnPatient}`} onClick={() => onPatient && onPatient()}>
                        Continuer en tant que patient &nbsp;›
                    </button>
                </div>

                {/* Card Médecin */}
                <div className={`${styles.card} ${styles.cardMedecin}`}>
                    <div className={styles.cardMedecinTop}>
                        <div className={`${styles.iconWrap} ${styles.iconTeal}`}>
                            <Stethoscope size={32} strokeWidth={1.8} color="#0EA5B0" />
                        </div>
                        <span className={styles.badge}><AlertTriangle size={13} /> Validation requise</span>
                    </div>

                    <h2 className={`${styles.cardTitle} ${styles.cardTitleTeal}`}>Je suis médecin</h2>
                    <p className={styles.cardDesc}>
                        Accédez aux dossiers de vos patients, utilisez la transcription IA et
                        générez vos comptes rendus automatiquement en quelques clics.
                    </p>

                    <ul className={styles.features}>
                        <li><span className={`${styles.check} ${styles.checkTeal}`}><Check size={13} /></span> Vérification sous 24-48h</li>
                        <li><span className={`${styles.check} ${styles.checkTeal}`}><Check size={13} /></span> Documents professionnels requis</li>
                        <li><span className={`${styles.check} ${styles.checkTeal}`}><Check size={13} /></span> Accès complet après validation</li>
                    </ul>

                    <button className={`${styles.btn} ${styles.btnMedecin}`} onClick={() => onDoctor && onDoctor()}>
                        Continuer en tant que médecin &nbsp;›
                    </button>
                </div>

            </div>

            {/* ── Déjà un compte ── */}
            <p className={styles.loginText}>
                Vous avez déjà un compte ?{' '}
                <button className={styles.loginLink} onClick={onLogin}>Se connecter →</button>
            </p>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                <span>© 2024 SantéClaire — Plateforme de santé sécurisée</span>
                <div className={styles.footerLinks}>
                    <a href="#">Mentions légales</a>
                    <a href="#">Confidentialité</a>
                    <a href="#">Aide</a>
                </div>
            </footer>

        </div>
    )
}
