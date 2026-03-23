import {
    LayoutDashboard, Users, Calendar, BarChart2, Settings,
    Search, Bell, Plus, CalendarDays, ClipboardList, FileText, FlaskConical,
    AlertTriangle, FileSignature, Download, Eye, ChevronRight, Play,
    Hospital, Lock, Globe, ShieldCheck, MessageCircle, MessageSquare
} from 'lucide-react'
import styles from './DoctorDashboard.module.css'
import PatientChatbot from './Chatbot/PatientChatbot'
import logo from '../assets/logo2.png'
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard', active: true },
    { icon: Users, label: 'Mes Patients', id: 'patients' },
    { icon: Calendar, label: 'Planning', id: 'planning' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: BarChart2, label: 'Rapports', id: 'reports' },
    { icon: Settings, label: 'Paramètres', id: 'settings' },
]

const alerts = [
    {
        type: 'critical',
        icon: AlertTriangle,
        title: 'Résultat critique',
        desc: 'Patient Arthur Morgan: Potassium levels high (6.1 mEq/L.)',
        action: 'CONTACTER LE PATIENT →',
    },
    {
        type: 'warning',
        icon: FileSignature,
        title: 'Rapport en attente',
        desc: 'Le compte rendu de Sarah Connor nécessite votre signature.',
        action: 'SIGNER MAINTENANT →',
    },
]

const files = [
    { icon: FileText, color: '#3B82F6', name: 'BloodWork_Fisher_231...', patient: 'ELENA FISHER', time: '2H AGO', actionType: 'download' },
    { icon: FileText, color: '#8B5CF6', name: 'Chest_XRay_Morgan_A...', patient: 'ARTHUR MORGAN', time: '5H AGO', actionType: 'view' },
]

export default function DoctorDashboard({ user, onLogout, onPatients, onNavigate }) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    const doctorName = user ? `Dr. ${user.firstName} ${user.lastName}` : 'Dr.'

    const [stats, setStats] = useState({ consultationsToday: 0, pendingReports: 0, sharedDocuments: 0, urgentLabResults: 0 })
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [statsRes, appointmentsRes] = await Promise.all([
                authService.getMedecinStats(),
                authService.getMedecinTodayAppointments()
            ])
            if (statsRes.success) setStats(statsRes.data)
            if (appointmentsRes.success) {
                // Transform appointments for display
                const formattedAppts = appointmentsRes.data.map((a, idx) => ({
                    time: a.time,
                    name: `${a.patient.firstName} ${a.patient.lastName}`,
                    desc: 'Consultation',
                    status: a.estActive ? 'En cours' : 'Planifié(e)',
                    statusType: a.estActive ? 'ongoing' : 'planned',
                    avatar: a.patient.initials,
                    avatarColor: ['#7C3AED', '#0EA5B0', '#0F2445', '#6B7280'][idx % 4],
                }))
                setAppointments(formattedAppts)
            }
        } catch (err) {
            console.error('Failed to load doctor data', err)
        } finally {
            setLoading(false)
        }
    }

    const statsDisplay = [
        { label: 'Consultations Today', value: stats.consultationsToday.toString().padStart(2, '0'), badge: 'Aujourd\'hui', badgeType: 'green', icon: CalendarDays },
        { label: 'Pending Reports', value: stats.pendingReports.toString().padStart(2, '0'), badge: 'Sign required', badgeType: 'orange', icon: ClipboardList },
        { label: 'Shared Documents', value: stats.sharedDocuments.toString().padStart(2, '0'), badge: 'Last 24h', badgeType: 'blue', icon: FileText },
        { label: 'Urgent Lab Results', value: stats.urgentLabResults.toString().padStart(2, '0'), badge: 'Critical', badgeType: 'red', icon: FlaskConical },
    ]

    return (
        <div className={styles.layout}>

            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brand}>
                        <img src={logo} alt="SantéClaire" className={styles.logo} />
                    </div>

                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => onNavigate && item.id ? onNavigate(item.id) : null}
                                    className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                                >
                                    <Icon size={17} className={styles.navIcon} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className={styles.sidebarBottom}>
                    <div className={styles.doctorInfo}>
                        <div className={styles.doctorAvatar}>Dr</div>
                        <div>
                            <div className={styles.doctorName}>{doctorName}</div>
                            <div className={styles.doctorStatus}>
                                <span className={styles.statusDot} />
                                EN SERVICE
                            </div>
                        </div>
                    </div>
                    <button className={styles.btnConsultation} onClick={() => onNavigate && onNavigate('patients')}>
                        <Play size={14} /> Démarrer une consultation
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Top bar ── */}
                <header className={styles.topbar}>
                    <div className={styles.searchWrap}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="text"
                            placeholder="Search patients, files, or records..."
                        />
                    </div>
                    <div className={styles.topRight}>
                        <button className={styles.iconBtn}><Bell size={17} /></button>
                        <button className={styles.iconBtn}><Plus size={17} /></button>
                        <div className={styles.dateBlock}>
                            <span className={styles.dateLabel}>DATE DU JOUR</span>
                            <span className={styles.dateValue}>{today}</span>
                        </div>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>

                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        {statsDisplay.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <div key={i} className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <span className={styles.statLabel}>{s.label}</span>
                                        <span className={styles.statIconWrap}><Icon size={18} strokeWidth={1.8} /></span>
                                    </div>
                                    <div className={styles.statRow}>
                                        <span className={`${styles.statValue} ${s.badgeType === 'red' ? styles.statRed : ''}`}>
                                            {s.value}
                                        </span>
                                        <span className={`${styles.statBadge} ${styles[`badge_${s.badgeType}`]}`}>
                                            {s.badge}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Middle row */}
                    <div className={styles.middleRow}>

                        {/* Planning */}
                        <div className={styles.planningCard}>
                            <div className={styles.planningHeader}>
                                <h2 className={styles.planningTitle}>Planning du jour</h2>
                                <button className={styles.linkBtn} onClick={() => onNavigate && onNavigate('planning')}>Voir le calendrier <ChevronRight size={13} /></button>
                            </div>

                            <div className={styles.appointmentList}>
                                {loading ? (
                                    <p className={styles.loadingText}>Chargement...</p>
                                ) : appointments.length === 0 ? (
                                    <p className={styles.emptyText}>Aucune consultation aujourd'hui</p>
                                ) : (
                                    appointments.map((a, i) => (
                                        <div key={i} className={`${styles.appointment} ${a.statusType === 'ongoing' ? styles.apptOngoing : ''}`}>
                                            <div className={styles.apptTime}>{a.time}</div>
                                            <div className={styles.apptAvatar} style={{ background: a.avatarColor }}>
                                                {a.avatar}
                                            </div>
                                            <div className={styles.apptInfo}>
                                                <div className={styles.apptName}>
                                                    {a.name}
                                                    {a.dot && <span className={styles.urgentDot} />}
                                                </div>
                                                <div className={styles.apptDesc}>{a.desc}</div>
                                            </div>
                                            <div className={styles.apptActions}>
                                                <span className={`${styles.apptStatus} ${styles[`status_${a.statusType}`]}`}>
                                                    {a.status}
                                                </span>
                                                {a.action && (
                                                    <button className={styles.profileBtn} onClick={() => onPatients && onPatients()}>{a.action}</button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right panel */}
                        <div className={styles.rightPanel}>

                            {/* Alertes */}
                            <div className={styles.alertCard}>
                                <div className={styles.alertHeader}>
                                    <h3 className={styles.alertTitle}>Alertes critiques</h3>
                                    <span className={styles.actionBadge}>ACTION REQUISE</span>
                                </div>
                                {alerts.map((a, i) => {
                                    const AlertIcon = a.icon
                                    return (
                                        <div key={i} className={`${styles.alertItem} ${styles[`alert_${a.type}`]}`}>
                                            <div className={styles.alertItemHeader}>
                                                <AlertIcon size={15} />
                                                <strong className={styles.alertItemTitle}>{a.title}</strong>
                                            </div>
                                            <p className={styles.alertDesc}>{a.desc}</p>
                                            <button className={styles.alertAction}>{a.action}</button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Fichiers partagés */}
                            <div className={styles.filesCard}>
                                <h3 className={styles.filesTitle}>Fichiers partagés</h3>
                                {files.map((f, i) => {
                                    const FileIcon = f.icon
                                    return (
                                        <div key={i} className={styles.fileRow}>
                                            <div className={styles.fileIcon} style={{ color: f.color }}><FileIcon size={22} strokeWidth={1.5} /></div>
                                            <div className={styles.fileInfo}>
                                                <div className={styles.fileName}>{f.name}</div>
                                                <div className={styles.fileMeta}>{f.patient} • {f.time}</div>
                                            </div>
                                            <button className={styles.fileActionBtn}>
                                                {f.actionType === 'download' ? <Download size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    )
                                })}
                                <button className={styles.seeAllBtn} onClick={() => onNavigate && onNavigate('patients')}>Voir tous les documents</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Le chatbot gère lui-même son mode bouton vs fenêtre avec animation */}
            <PatientChatbot />
        </div>
    )
}
