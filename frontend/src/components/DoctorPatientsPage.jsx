import { useState, useEffect } from 'react'
import {
    Search, Plus, FileText, ChevronLeft, ChevronRight,
    Filter, Play,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchMedecinPatients } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorPatientsPage.module.css'

const AVATAR_COLORS = ['#7C3AED', '#0EA5B0', '#6B7280', '#3B82F6', '#F59E0B', '#EF4444']

export default function DoctorPatientsPage({ user, onBack, onLogout, onPatientFile, onNavigate, onAddPatient }) {
    const { t } = useLanguage()
    const [search, setSearch] = useState('')
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMedecinPatients().then(r => {
            if (r.success) setPatients(r.data)
            setLoading(false)
        })
    }, [])

    const filtered = patients.filter(p => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
        return fullName.includes(search.toLowerCase())
    })

    const getAge = (dateNaissance) => {
        if (!dateNaissance) return null
        const birth = new Date(dateNaissance)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
        return age
    }

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="patients" onNavigate={onNavigate} onLogout={onLogout} />

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Header ── */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>{t('doctor.patients')}</h1>
                        <p className={styles.pageCount}>{patients.length} patient{patients.length !== 1 ? 's' : ''} suivi{patients.length !== 1 ? 's' : ''} sur la plateforme</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <LanguageSwitcher />
                        <button
                            type="button"
                            className={styles.btnAdd}
                            onClick={() => onAddPatient && onAddPatient()}
                        >
                            <Plus size={16} /> {t('doctor.addPatientBtn')}
                        </button>
                    </div>
                </div>

                {/* ── Search ── */}
                <div className={styles.filterBar}>
                    <div className={styles.searchWrap}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Rechercher un patient par nom..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Patient list ── */}
                <div className={styles.patientList}>
                    {loading && <p style={{ color: '#9CA3AF', padding: 20 }}>Chargement...</p>}
                    {!loading && filtered.length === 0 && (
                        <p style={{ color: '#9CA3AF', padding: 20 }}>Aucun patient trouvé.</p>
                    )}
                    {filtered.map((p, i) => {
                        const initials = `${(p.firstName?.[0] || '')}${(p.lastName?.[0] || '')}`.toUpperCase()
                        const age = getAge(p.dateNaissance)
                        return (
                            <div key={p.id} className={styles.patientCard}>
                                <div className={styles.patientLeft}>
                                    <div className={styles.avatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                                        {initials}
                                    </div>
                                    <div className={styles.patientInfo}>
                                        <div className={styles.patientName}>
                                            {p.firstName} {p.lastName} {age !== null && <span className={styles.patientAge}>• {age} ans</span>}
                                        </div>
                                        <div className={styles.lastConsult}>
                                            {p.lastConsultation && <>Dernière consultation : {new Date(p.lastConsultation).toLocaleDateString('fr-FR')}</>}
                                            {p.consultationCount > 0 && <> — {p.consultationCount} consultation{p.consultationCount > 1 ? 's' : ''}</>}
                                        </div>
                                        {p.allergies && (
                                            <div style={{ fontSize: '0.8rem', color: '#EF4444', marginTop: 2 }}>
                                                Allergies : {p.allergies}
                                            </div>
                                        )}
                                        {p.groupeSanguin && (
                                            <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 2 }}>
                                                Groupe sanguin : {p.groupeSanguin}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.patientRight}>
                                    <div className={styles.actions}>
                                        <button className={styles.btnDossier} onClick={() => onPatientFile && onPatientFile(p.id)}>Voir le dossier</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
