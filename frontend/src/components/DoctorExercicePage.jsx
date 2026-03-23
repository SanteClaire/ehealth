import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './DoctorExercicePage.module.css'
import logo from '../assets/logo.png'

const STRUCTURE_TYPES = [
    'Cabinet libéral', 'Hôpital / CHU', 'Clinique privée',
    'Maison de santé', 'Autre'
]

const LOGICIELS = [
    'Doctolib', 'Maiia', 'Ordoclic', 'Weda', 'Hellodoc',
    'MédecinDirect', 'Cegedim', 'Aucun', 'Autre'
]

export default function DoctorExercicePage({ onBack, onNext }) {
    const { t } = useLanguage()
    const [form, setForm] = useState({
        structureType: 'Cabinet libéral',
        structureName: '', address: '', postalCode: '', city: '',
        phoneCabinet: '', website: '', logiciel: ''
    })

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Doctor exercice:', form)
        onNext && onNext()
    }

    return (
        <div className={styles.page}>

            {/* ── Logo ── */}
            <header className={styles.header}>
                <img src={logo} alt="SantéClaire" className={styles.logo} />
                <LanguageSwitcher />
            </header>

            {/* ── Stepper ── */}
            <div className={styles.stepper}>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 1</span>
                    <span className={styles.stepTitle}>Informations</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepLabel}>ÉTAPE 2 SUR 3</span>
                    <span className={styles.stepTitle}>Exercice</span>
                    <div className={styles.stepBar}><div className={styles.stepBarFill} /></div>
                </div>
                <div className={`${styles.step} ${styles.stepInactive}`}>
                    <span className={styles.stepLabel}>ÉTAPE 3</span>
                    <span className={styles.stepTitle}>Documents</span>
                    <div className={styles.stepBar}><div className={styles.stepBarEmpty} /></div>
                </div>
            </div>

            {/* ── Card ── */}
            <main className={styles.card}>
                <span className={styles.badge}>🩺 ESPACE MÉDECIN</span>
                <h1 className={styles.heading}>Votre lieu d'exercice</h1>
                <p className={styles.subheading}>Indiquez où vous exercez votre activité.</p>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Type de structure */}
                    <div className={styles.field}>
                        <label className={styles.label}>Type de structure *</label>
                        <div className={styles.radioGrid}>
                            {STRUCTURE_TYPES.map(type => (
                                <label key={type} className={`${styles.radioCard} ${form.structureType === type ? styles.radioCardActive : ''}`}>
                                    <input type="radio" name="structureType" value={type}
                                        checked={form.structureType === type}
                                        onChange={set('structureType')} />
                                    <span className={styles.radioCircle}></span>
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Nom de la structure */}
                    <div className={styles.field}>
                        <label className={styles.label}>Nom de la structure *</label>
                        <input className={styles.input} placeholder="Cabinet Dr. Martin ou Hôpital Saint-Louis"
                            value={form.structureName} onChange={set('structureName')} required />
                    </div>

                    {/* Adresse */}
                    <div className={styles.field}>
                        <label className={styles.label}>Adresse *</label>
                        <input className={styles.input} placeholder="Numéro et nom de rue"
                            value={form.address} onChange={set('address')} required />
                    </div>

                    {/* Code postal / Ville */}
                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label className={styles.label}>Code postal *</label>
                            <input className={styles.input} placeholder="75000"
                                value={form.postalCode} onChange={set('postalCode')} required />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Ville *</label>
                            <input className={styles.input} placeholder="Paris"
                                value={form.city} onChange={set('city')} required />
                        </div>
                    </div>

                    {/* Téléphone cabinet / Site web */}
                    <div className={styles.row2}>
                        <div className={styles.field}>
                            <label className={styles.label}>Téléphone du cabinet</label>
                            <input className={styles.input} type="tel" placeholder="01 XX XX XX XX"
                                value={form.phoneCabinet} onChange={set('phoneCabinet')} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Site web (optionnel)</label>
                            <input className={styles.input} placeholder="https://..."
                                value={form.website} onChange={set('website')} />
                        </div>
                    </div>

                    {/* Logiciel médical */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Utilisez-vous un logiciel médical ? <span className={styles.infoIcon} title="Nous pouvons faciliter l'intégration avec votre logiciel">ℹ</span>
                        </label>
                        <select className={styles.select} value={form.logiciel} onChange={set('logiciel')}>
                            <option value="" disabled>Sélectionnez un logiciel</option>
                            {LOGICIELS.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className={styles.buttons}>
                        <button type="button" className={styles.btnBack} onClick={onBack}>
                            ← Retour
                        </button>
                        <button type="submit" className={styles.btnNext}>
                            Étape suivante — Documents requis &nbsp;→
                        </button>
                    </div>
                </form>
            </main>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                Besoin d'aide ? Contactez notre support au <strong>01 23 45 67 89</strong>
            </footer>
        </div>
    )
}
