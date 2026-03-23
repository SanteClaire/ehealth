import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { login, getUserRole } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './LoginPage.module.css'
import logo from '../assets/logo.png'
import doctorImg from '../assets/doctor.png'

export default function LoginPage({ onClose, onRegister, onDoctorLogin, onPatientLogin }) {
    const { t } = useLanguage()
    const [role, setRole] = useState('patient')
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await login(email, password)
            if (!result.success) {
                setError(result.message || 'Erreur de connexion')
                setLoading(false)
                return
            }

            const userRole = getUserRole(result.data)
            if (userRole === 'medecin') {
                onDoctorLogin && onDoctorLogin(result.data)
            } else {
                onPatientLogin && onPatientLogin(result.data)
            }
        } catch (err) {
            setError(err.message || 'Identifiants incorrects')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.wrapper}>
            {/* ── Panneau gauche ── */}
            <aside className={styles.left}>
                <div className={styles.leftTop}>
                    <img src={logo} alt="SantéClaire" className={styles.leftLogo} />
                </div>

                <div className={styles.leftIllustration}>
                    <div className={styles.doctorCard}>
                        <img src={doctorImg} alt="Médecin SantéClaire" className={styles.doctorImg} />
                    </div>
                </div>

                <div className={styles.leftContent}>
                    <h2 className={styles.leftTitle}>{t('auth.welcome_title')}</h2>
                    <p className={styles.leftSubtitle}>{t('auth.welcome_subtitle')}</p>
                </div>

                <div className={styles.badges}>
                    <span className={styles.badge}>🔒 HDS</span>
                    <span className={styles.badge}>🇫🇷 RGPD</span>
                    <span className={styles.badge}>🔐 Chiffré</span>
                </div>
            </aside>

            {/* ── Panneau droit ── */}
            <main className={styles.right}>
                <div className={styles.langWrap}>
                    <LanguageSwitcher />
                </div>

                <div className={styles.formCard}>
                    <h1 className={styles.heading}>{t('auth.login_title')}</h1>
                    <p className={styles.subheading}>{t('auth.login_subtitle')}</p>

                    {/* Tabs Patient / Médecin */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${role === 'patient' ? styles.tabActive : ''}`}
                            onClick={() => setRole('patient')}
                        >
                            {t('auth.patient')}
                        </button>
                        <button
                            className={`${styles.tab} ${role === 'medecin' ? styles.tabActive : ''}`}
                            onClick={() => setRole('medecin')}
                        >
                            {t('auth.doctor')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', marginBottom: 8 }}>
                                {error}
                            </div>
                        )}
                        {/* Email */}
                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>{t('auth.email')}</label>
                            <div className={styles.inputWrap}>
                                <span className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="3" />
                                        <path d="m2 7 10 7 10-7" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder={t('auth.email_placeholder')}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className={styles.field}>
                            <div className={styles.passwordRow}>
                                <label htmlFor="password" className={styles.label}>{t('auth.password')}</label>
                                <a href="mailto:support@santeclaire.fr?subject=R%C3%A9initialisation%20mot%20de%20passe" className={styles.forgotLink}>{t('auth.forgot_password')}</a>
                            </div>
                            <div className={styles.inputWrap}>
                                <span className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Afficher/masquer mot de passe"
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.btnSubmit} disabled={loading}>
                            {loading ? 'Connexion...' : t('auth.sign_in')}
                        </button>
                    </form>

                    <div className={styles.divider}><span>— ou —</span></div>

                    <p className={styles.registerText}>
                        {t('auth.no_account')}{' '}
                        <button
                            className={styles.registerLink}
                            onClick={() => onRegister && onRegister()}
                        >{t('auth.create_account')} →</button>
                    </p>

                    <p className={styles.secureNote}>🔒 {t('auth.secure_login')}</p>
                </div>
            </main>
        </div>
    )
}
