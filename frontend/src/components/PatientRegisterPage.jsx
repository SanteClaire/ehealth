import { useState, useMemo } from 'react'
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react'
import { register } from '../services/api'
import styles from './PatientRegisterPage.module.css'
import logo from '../assets/logo.png'

function getStrength(pw) {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score // 0-4
}

const STRENGTH_LABELS = ['', 'Faible', 'Moyen', 'Bon', 'Excellent']
const STRENGTH_COLORS = ['#E5E7EB', '#EF4444', '#F59E0B', '#0EA5B0', '#22C55E']

export default function PatientRegisterPage({ onBack, onLogin, onConfirm }) {
    const [form, setForm] = useState({
        prenom: '', nom: '', email: '', tel: '', dob: '',
        password: '', confirmPassword: ''
    })
    const [showPw, setShowPw] = useState(false)
    const [acceptCGU, setAcceptCGU] = useState(false)
    const [acceptPrivacy, setAcceptPrivacy] = useState(false)
    const [acceptShare, setAcceptShare] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const strength = useMemo(() => getStrength(form.password), [form.password])

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }

        setLoading(true)
        try {
            const result = await register({
                role: 'patient',
                email: form.email,
                password: form.password,
                firstName: form.prenom,
                lastName: form.nom,
                telephone: form.tel,
                birthDate: form.dob,
            })

            if (result.success) {
                onConfirm && onConfirm()
            } else {
                setError(result.message || 'Erreur lors de l\'inscription')
            }
        } catch (err) {
            setError(err.message || 'Erreur réseau')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>

            {/* ── Top bar ── */}
            <header className={styles.topBar}>
                <button className={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={15} /> Choisir un autre profil
                </button>
                <img src={logo} alt="SantéClaire" className={styles.topLogo} />
                <div className={styles.topSpacer} />
            </header>

            {/* ── Stepper ── */}
            <div className={styles.stepper}>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 1 SUR 2</span>
                    <span className={styles.stepTitle}>Vos informations</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
                <div className={`${styles.step} ${styles.stepInactive}`}>
                    <span className={styles.stepLabel}>ÉTAPE 2</span>
                    <span className={styles.stepTitle}>Confirmation</span>
                    <div className={styles.stepBar}><div className={styles.stepBarEmpty} /></div>
                </div>
            </div>

            {/* ── Form card ── */}
            <main className={styles.card}>
                <h1 className={styles.heading}>Créer mon compte patient</h1>
                <p className={styles.subheading}>Inscription rapide et sécurisée</p>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Prénom / Nom */}
                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label className={styles.label}>Prénom *</label>
                            <input className={styles.input} value={form.prenom} onChange={set('prenom')} required />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Nom *</label>
                            <input className={styles.input} value={form.nom} onChange={set('nom')} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.field}>
                        <label className={styles.label}>Email *</label>
                        <input className={styles.input} type="email" placeholder="jean.dupont@email.fr"
                            value={form.email} onChange={set('email')} required />
                    </div>

                    {/* Téléphone */}
                    <div className={styles.field}>
                        <label className={styles.label}>Téléphone *</label>
                        <input className={styles.input} type="tel" placeholder="+33 6 XX XX XX XX"
                            value={form.tel} onChange={set('tel')} required />
                    </div>

                    {/* Date de naissance */}
                    <div className={styles.field}>
                        <label className={styles.label}>Date de naissance *</label>
                        <input className={styles.input} type="date"
                            value={form.dob} onChange={set('dob')} required />
                    </div>

                    {/* Mot de passe */}
                    <div className={styles.field}>
                        <label className={styles.label}>Mot de passe *</label>
                        <div className={styles.inputWrap}>
                            <input className={styles.input}
                                type={showPw ? 'text' : 'password'}
                                value={form.password} onChange={set('password')} required />
                            <button type="button" className={styles.eyeBtn}
                                onClick={() => setShowPw(!showPw)} aria-label="Afficher mot de passe">
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        {form.password && (
                            <div className={styles.strengthWrap}>
                                <span className={styles.strengthLabel}>
                                    SÉCURITÉ : {STRENGTH_LABELS[strength]}
                                </span>
                                <div className={styles.strengthBars}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={styles.strengthSeg}
                                            style={{ background: i <= strength ? STRENGTH_COLORS[strength] : '#E5E7EB' }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirmer mot de passe */}
                    <div className={styles.field}>
                        <label className={styles.label}>Confirmer le mot de passe *</label>
                        <input className={styles.input} type="password"
                            value={form.confirmPassword} onChange={set('confirmPassword')} required />
                    </div>

                    {/* Checkboxes */}
                    <div className={styles.checks}>
                        <label className={styles.checkRow}>
                            <input type="checkbox" checked={acceptCGU} onChange={() => setAcceptCGU(!acceptCGU)} />
                            <span>J'accepte les <a href="/#cta" className={styles.link}>Conditions Générales d'Utilisation</a> *</span>
                        </label>
                        <label className={styles.checkRow}>
                            <input type="checkbox" checked={acceptPrivacy} onChange={() => setAcceptPrivacy(!acceptPrivacy)} />
                            <span>J'accepte la <a href="/#security" className={styles.link}>Politique de confidentialité</a> *</span>
                        </label>
                        <label className={styles.checkRow}>
                            <input type="checkbox" checked={acceptShare} onChange={() => setAcceptShare(!acceptShare)} />
                            <span>J'accepte que mes documents soient partagés par défaut avec mon médecin lors des consultations, conformément au RGPD. Je peux modifier cela à tout moment. *</span>
                        </label>
                    </div>

                    {error && (
                        <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', marginBottom: 8 }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className={styles.btnSubmit}
                        disabled={!acceptCGU || !acceptPrivacy || !acceptShare || loading}>
                        {loading ? 'Inscription en cours...' : 'Créer mon compte →'}
                    </button>
                </form>
            </main>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                <p className={styles.footerNote}><Lock size={13} /> Vos données sont chiffrées et hébergées en France (HDS)</p>
                <div className={styles.footerBadges}>
                    <span className={styles.footerBadge}>CERTIFIÉ HDS</span>
                    <span className={styles.footerBadge}>RGPD COMPLIANT</span>
                </div>
                <p className={styles.footerCopy}>© 2024 SantéClaire. Tous droits réservés.</p>
            </footer>

        </div>
    )
}
