import { useState, useMemo } from 'react'
import { Eye, EyeOff, Hospital, Info, ArrowLeft } from 'lucide-react'
import styles from './DoctorRegisterPage.module.css'
import logo from '../assets/logo2.png'

const SPECIALTIES = [
    'Médecine générale', 'Cardiologie', 'Dermatologie', 'Endocrinologie',
    'Gastro-entérologie', 'Gynécologie', 'Neurologie', 'Ophtalmologie',
    'ORL', 'Pédiatrie', 'Pneumologie', 'Psychiatrie', 'Radiologie',
    'Rhumatologie', 'Urologie', 'Chirurgie', 'Autre'
]

function getStrength(pw) {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
}

const STRENGTH_LABELS = ['', 'Faible', 'Moyen', 'Bon', 'Excellent']
const STRENGTH_COLORS = ['#E5E7EB', '#EF4444', '#F59E0B', '#0EA5B0', '#22C55E']

export default function DoctorRegisterPage({ onBack, onConfirm }) {
    const [form, setForm] = useState({
        prenom: '', nom: '', email: '', tel: '', dob: '',
        specialty: '', rpps: '', password: '', confirmPassword: ''
    })

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
    const [showPw, setShowPw] = useState(false)
    const strength = useMemo(() => getStrength(form.password), [form.password])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Doctor register step 1:', form)
        onConfirm && onConfirm()
    }

    return (
        <div className={styles.page}>

            {/* ── Logo ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.logo} />
            </header>

            {/* ── Back link ── */}
            <button className={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={15} /> Choisir un autre profil
            </button>

            {/* ── Stepper ── */}
            <div className={styles.stepper}>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 1 SUR 3</span>
                    <span className={styles.stepTitle}>Informations</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
                <div className={`${styles.step} ${styles.stepInactive}`}>
                    <span className={styles.stepLabel}>ÉTAPE 2</span>
                    <span className={styles.stepTitle}>Exercice</span>
                    <div className={styles.stepBar}><div className={styles.stepBarEmpty} /></div>
                </div>
                <div className={`${styles.step} ${styles.stepInactive}`}>
                    <span className={styles.stepLabel}>ÉTAPE 3</span>
                    <span className={styles.stepTitle}>Documents</span>
                    <div className={styles.stepBar}><div className={styles.stepBarEmpty} /></div>
                </div>
            </div>

            {/* ── Form card ── */}
            <main className={styles.card}>
                <span className={styles.badge}><Hospital size={14} /> ESPACE MÉDECIN</span>
                <h1 className={styles.heading}>Vos informations personnelles</h1>
                <p className={styles.subheading}>
                    Ces informations seront vérifiées par notre équipe avant activation de votre compte.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Prénom / Nom */}
                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label className={styles.label}>Prénom *</label>
                            <input className={styles.input} placeholder="Jean"
                                value={form.prenom} onChange={set('prenom')} required />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Nom *</label>
                            <input className={styles.input} placeholder="Martin"
                                value={form.nom} onChange={set('nom')} required />
                        </div>
                    </div>

                    {/* Email professionnel */}
                    <div className={styles.field}>
                        <label className={styles.label}>Email professionnel *</label>
                        <input className={styles.input} type="email" placeholder="dr.martin@hopital.fr"
                            value={form.email} onChange={set('email')} required />
                    </div>

                    {/* Téléphone professionnel */}
                    <div className={styles.field}>
                        <label className={styles.label}>Téléphone professionnel *</label>
                        <input className={styles.input} type="tel" placeholder="06 12 34 56 78"
                            value={form.tel} onChange={set('tel')} required />
                    </div>

                    {/* Date de naissance */}
                    <div className={styles.field}>
                        <label className={styles.label}>Date de naissance *</label>
                        <input className={styles.input} type="date"
                            value={form.dob} onChange={set('dob')} required />
                    </div>

                    {/* Spécialité médicale */}
                    <div className={styles.field}>
                        <label className={styles.label}>Spécialité médicale *</label>
                        <select className={styles.select} value={form.specialty}
                            onChange={set('specialty')} required>
                            <option value="" disabled>Choisir une spécialité</option>
                            {SPECIALTIES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Numéro RPPS */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Numéro RPPS * <span className={styles.infoIcon} title="Le numéro RPPS est votre identifiant unique de professionnel de santé"><Info size={14} /></span>
                        </label>
                        <input className={styles.input} placeholder="1234567890"
                            value={form.rpps} onChange={set('rpps')} required />
                    </div>

                    {/* Mot de passe */}
                    <div className={styles.field}>
                        <label className={styles.label}>Mot de passe *</label>
                        <div className={styles.inputWrap}>
                            <input className={styles.input} type={showPw ? 'text' : 'password'} placeholder="••••••••"
                                value={form.password} onChange={set('password')} required />
                            <button type="button" className={styles.eyeBtn}
                                onClick={() => setShowPw(!showPw)} aria-label="Afficher mot de passe">
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
                        <input className={styles.input} type="password" placeholder="••••••••"
                            value={form.confirmPassword} onChange={set('confirmPassword')} required />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                        Étape suivante : Informations d'exercice &nbsp;→
                    </button>

                    <p className={styles.required}>* Champs obligatoires</p>
                </form>
            </main>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                Besoin d'aide ? <a href="#" className={styles.supportLink}>Contactez le support praticiens</a>
            </footer>

        </div>
    )
}
