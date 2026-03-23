import { CheckCircle2, FileText, Upload, Shield, Calendar, ArrowRight, Mail, FolderOpen, Bot } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import styles from './PatientConfirmPage.module.css'
import logo from '../assets/logo.png'

export default function PatientConfirmPage({ onDashboard }) {
    const { t } = useLanguage()

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
                        <CheckCircle2 size={16} color="#fff" strokeWidth={3} />
                    </span>
                    <div>
                        <span className={styles.stepLabel}>{t('confirm.step1')}</span>
                        <span className={styles.stepTitle}>{t('confirm.step1Title')}</span>
                    </div>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepNum}>2</span>
                    <div>
                        <span className={styles.stepLabel}>{t('confirm.step2')}</span>
                        <span className={styles.stepTitle}>{t('confirm.step2Title')}</span>
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
                            <strong className={styles.stepItemTitle}>{t('confirm.checkEmail')}</strong>
                            <p className={styles.stepItemDesc}>{t('confirm.checkEmailDesc')}</p>
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
                            <strong className={styles.stepItemTitle}>{t('confirm.talkToAI')}</strong>
                            <p className={styles.stepItemDesc}>{t('confirm.talkToAIDesc')}</p>
                        </div>
                    </div>
                </div>

                <button className={styles.btnDashboard} onClick={onDashboard}>
                    Accéder à mon tableau de bord &nbsp;→
                </button>
            </main>

            {/* ── Footer ── */}
            <p className={styles.footer}>
                {t('confirm.needHelp')} <a href="mailto:support@santeclaire.fr" className={styles.supportLink}>{t('confirm.contactSupport')}</a>
            </p>
        </div>
    )
}
