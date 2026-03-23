import { useState, useEffect } from 'react'
import {
    Search, Bell, Plus, CalendarDays, ClipboardList, FileText, FlaskConical,
    AlertTriangle, FileSignature, Download, Eye, ChevronRight, Play, Users,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchMedecinStats, fetchMedecinConsultations, fetchMedecinPatients, fetchMedecinDocuments, fetchMedecinAppointmentsToday } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorDashboard.module.css'

export default function DoctorDashboard({ user, onLogout, onPatients, onNavigate }) {
    const { t } = useLanguage()
    const [stats, setStats] = useState(null)
    const [consultations, setConsultations] = useState([])
    const [patients, setPatients] = useState([])
    const [documents, setDocuments] = useState([])
    const [todayAppointments, setTodayAppointments] = useState([])

    useEffect(() => {
        fetchMedecinStats().then(r => r.success && setStats(r.data))
        fetchMedecinConsultations().then(r => r.success && setConsultations(r.data))
        fetchMedecinPatients().then(r => r.success && setPatients(r.data))
        fetchMedecinDocuments().then(r => r.success && setDocuments(r.data))
        fetchMedecinAppointmentsToday().then(r => r.success && setTodayAppointments(r.data))
    }, [])

    const doctorName = user ? `Dr. ${user.firstName} ${user.lastName}` : 'Dr.'
    const doctorInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'DR'
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    const statsCards = [
        { label: t('doctor.consultationsToday'), value: stats?.consultationsToday ?? '—', badge: todayAppointments.length > 0 ? `${todayAppointments.length} RDV` : '', badgeType: 'green', icon: CalendarDays },
        { label: 'Total patients', value: stats?.totalPatients ?? '—', badge: '', badgeType: 'blue', icon: Users },
        { label: t('doctor.sharedDocuments'), value: stats?.sharedDocuments ?? '—', badge: '', badgeType: 'blue', icon: FileText },
        { label: 'Consultations totales', value: consultations.length || '—', badge: '', badgeType: 'green', icon: ClipboardList },
    ]

    // Build appointments from real consultations
    const appointmentList = consultations.slice(0, 6).map((c) => ({
        time: new Date(c.dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        name: `${c.patient.firstName} ${c.patient.lastName}`,
        desc: c.estActive ? 'En cours' : (c.dateFin ? 'Terminée' : 'Planifiée'),
        statusType: c.estActive ? 'ongoing' : (c.dateFin ? 'arrived' : 'planned'),
        avatar: `${(c.patient.firstName?.[0] || '')}${(c.patient.lastName?.[0] || '')}`.toUpperCase(),
        avatarColor: c.estActive ? '#0EA5B0' : '#6B7280',
        date: new Date(c.dateDebut).toLocaleDateString('fr-FR'),
    }))

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Top bar ── */}
                <header className={styles.topbar}>
                    <div className={styles.searchWrap}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="text"
                            placeholder={t('doctor.searchPlaceholder')}
                        />
                    </div>
                    <div className={styles.topRight}>
                        <LanguageSwitcher />
                        <button className={styles.iconBtn}><Bell size={17} /></button>
                        <button className={styles.iconBtn}><Plus size={17} /></button>
                        <button
                            type="button"
                            className={styles.doctorProfileChip}
                            onClick={() => onNavigate && onNavigate('profil')}
                            aria-label={t('doctor.navMyProfile')}
                        >
                            <span className={styles.doctorProfileAvatar}>{doctorInitials}</span>
                            <span className={styles.doctorProfileName}>{doctorName}</span>
                        </button>
                        <div className={styles.dateBlock}>
                            <span className={styles.dateLabel}>DATE DU JOUR</span>
                            <span className={styles.dateValue}>{today}</span>
                        </div>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>
                    <div className={styles.consultationBar}>
                        <button
                            type="button"
                            className={styles.btnConsultation}
                            onClick={() => onNavigate && onNavigate('patients')}
                        >
                            <Play size={14} /> {t('doctor.startConsultation')}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        {statsCards.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <div key={i} className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <span className={styles.statLabel}>{s.label}</span>
                                        <span className={styles.statIconWrap}><Icon size={18} strokeWidth={1.8} /></span>
                                    </div>
                                    <div className={styles.statRow}>
                                        <span className={styles.statValue}>
                                            {s.value}
                                        </span>
                                        {s.badge && (
                                            <span className={`${styles.statBadge} ${styles[`badge_${s.badgeType}`]}`}>
                                                {s.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Middle row */}
                    <div className={styles.middleRow}>

                        {/* Consultations list */}
                        <div className={styles.planningCard}>
                            <div className={styles.planningHeader}>
                                <h2 className={styles.planningTitle}>Consultations récentes</h2>
                                <button className={styles.linkBtn} onClick={() => onNavigate && onNavigate('planning')}>Voir le calendrier <ChevronRight size={13} /></button>
                            </div>

                            <div className={styles.appointmentList}>
                                {appointmentList.length === 0 && (
                                    <p style={{ color: '#9CA3AF', fontSize: '0.9rem', padding: '16px' }}>Aucune consultation enregistrée.</p>
                                )}
                                {appointmentList.map((a, i) => (
                                    <div key={i} className={`${styles.appointment} ${a.statusType === 'ongoing' ? styles.apptOngoing : ''}`}>
                                        <div className={styles.apptTime}>
                                            <div>{a.time}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{a.date}</div>
                                        </div>
                                        <div className={styles.apptAvatar} style={{ background: a.avatarColor }}>
                                            {a.avatar}
                                        </div>
                                        <div className={styles.apptInfo}>
                                            <div className={styles.apptName}>{a.name}</div>
                                            <div className={styles.apptDesc}>{a.desc}</div>
                                        </div>
                                        <div className={styles.apptActions}>
                                            <span className={`${styles.apptStatus} ${styles[`status_${a.statusType}`]}`}>
                                                {a.desc}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right panel */}
                        <div className={styles.rightPanel}>

                            {/* Patients */}
                            <div className={styles.alertCard}>
                                <div className={styles.alertHeader}>
                                    <h3 className={styles.alertTitle}>Mes patients</h3>
                                    <span className={styles.actionBadge}>{patients.length} PATIENT{patients.length !== 1 ? 'S' : ''}</span>
                                </div>
                                {patients.slice(0, 3).map((p, i) => (
                                    <div key={i} className={`${styles.alertItem} ${styles.alert_warning}`}>
                                        <div className={styles.alertItemHeader}>
                                            <Users size={15} />
                                            <strong className={styles.alertItemTitle}>{p.firstName} {p.lastName}</strong>
                                        </div>
                                        <p className={styles.alertDesc}>
                                            {p.allergies ? `Allergies: ${p.allergies}` : 'Pas d\'allergies connues'}
                                            {p.groupeSanguin ? ` — Groupe: ${p.groupeSanguin}` : ''}
                                        </p>
                                        <button className={styles.alertAction} onClick={() => onPatients && onPatients()}>Voir le dossier</button>
                                    </div>
                                ))}
                                {patients.length === 0 && (
                                    <p style={{ color: '#9CA3AF', fontSize: '0.85rem', padding: '12px' }}>Aucun patient enregistré.</p>
                                )}
                            </div>

                            {/* Fichiers partagés */}
                            <div className={styles.filesCard}>
                                <h3 className={styles.filesTitle}>Documents partagés</h3>
                                {documents.slice(0, 3).map((f, i) => (
                                    <div key={i} className={styles.fileRow}>
                                        <div className={styles.fileIcon} style={{ color: '#3B82F6' }}><FileText size={22} strokeWidth={1.5} /></div>
                                        <div className={styles.fileInfo}>
                                            <div className={styles.fileName}>{f.nomOriginal}</div>
                                            <div className={styles.fileMeta}>{f.patient.firstName} {f.patient.lastName} — {f.type}</div>
                                        </div>
                                        <button className={styles.fileActionBtn}>
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                ))}
                                {documents.length === 0 && (
                                    <p style={{ color: '#9CA3AF', fontSize: '0.85rem', padding: '12px' }}>Aucun document partagé.</p>
                                )}
                                <button className={styles.seeAllBtn} onClick={() => onNavigate && onNavigate('patients')}>{t('doctor.viewAllDocuments')}</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
