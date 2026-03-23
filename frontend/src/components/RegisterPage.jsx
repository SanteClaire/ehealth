import { User, Stethoscope, Check, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './RegisterPage.module.css'
import logo from '../assets/logo.png'

export default function RegisterPage({ onBack, onLogin, onPatient, onDoctor }) {
    const { t } = useLanguage()

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.headerLogo} />
                <div className={styles.headerRight}>
                    <LanguageSwitcher />
                    <button className={styles.backLink} onClick={onBack}>
                        <ArrowLeft size={15} /> {t('register.back_home')}
                    </button>
                </div>
            </header>

            {/* ── Hero text ── */}
            <section className={styles.hero}>
                <h1 className={styles.title}>{t('register.who_are_you')}</h1>
                <p className={styles.subtitle}>{t('register.select_profile')}</p>
            </section>

            {/* ── Cards ── */}
            <div className={styles.cards}>

                {/* Card Patient */}
                <div className={`${styles.card} ${styles.cardPatient}`}>
                    <div className={styles.iconWrap}>
                        <User size={32} strokeWidth={1.8} color="#1B3A6B" />
                    </div>

                    <h2 className={styles.cardTitle}>{t('register.i_am_patient')}</h2>
                    <p className={styles.cardDesc}>
                        {t('register.patient_desc')}
                    </p>

                    <ul className={styles.features}>
                        <li><span className={styles.check}><Check size={13} /></span> {t('register.patient_feature1')}</li>
                        <li><span className={styles.check}><Check size={13} /></span> {t('register.patient_feature2')}</li>
                        <li><span className={`${styles.check} ${styles.bold}`}><Check size={13} /></span> <strong>{t('register.patient_feature3')}</strong></li>
                    </ul>

                    <button className={`${styles.btn} ${styles.btnPatient}`} onClick={() => onPatient && onPatient()}>
                        {t('register.continue_patient')} &nbsp;›
                    </button>
                </div>

                {/* Card Médecin */}
                <div className={`${styles.card} ${styles.cardMedecin}`}>
                    <div className={styles.cardMedecinTop}>
                        <div className={`${styles.iconWrap} ${styles.iconTeal}`}>
                            <Stethoscope size={32} strokeWidth={1.8} color="#0EA5B0" />
                        </div>
                        <span className={styles.badge}><AlertTriangle size={13} /> {t('register.validation_required')}</span>
                    </div>

                    <h2 className={`${styles.cardTitle} ${styles.cardTitleTeal}`}>{t('register.i_am_doctor')}</h2>
                    <p className={styles.cardDesc}>
                        {t('register.doctor_desc')}
                    </p>

                    <ul className={styles.features}>
                        <li><span className={`${styles.check} ${styles.checkTeal}`}><Check size={13} /></span> {t('register.doctor_feature1')}</li>
                        <li><span className={`${styles.check} ${styles.checkTeal}`}><Check size={13} /></span> {t('register.doctor_feature2')}</li>
                        <li><span className={`${styles.check} ${styles.checkTeal}`}><Check size={13} /></span> {t('register.doctor_feature3')}</li>
                    </ul>

                    <button className={`${styles.btn} ${styles.btnMedecin}`} onClick={() => onDoctor && onDoctor()}>
                        {t('register.continue_doctor')} &nbsp;›
                    </button>
                </div>

            </div>

            {/* ── Déjà un compte ── */}
            <p className={styles.loginText}>
                {t('register.have_account')}{' '}
                <button className={styles.loginLink} onClick={onLogin}>{t('auth.login')} →</button>
            </p>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                <span>{t('register.footer')}</span>
                <div className={styles.footerLinks}>
                    <a href="/#cta">{t('register.legal')}</a>
                    <a href="/#security">{t('register.privacy')}</a>
                    <a href="mailto:support@santeclaire.fr">{t('register.help')}</a>
                </div>
            </footer>

        </div>
    )
}
