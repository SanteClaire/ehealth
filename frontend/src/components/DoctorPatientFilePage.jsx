import { useState, useEffect } from 'react'
import {
    LayoutDashboard, Users, Calendar, MessageSquare, BarChart2,
    LogOut, Play, FilePlus, FileText, Mic, PenLine,
    CheckCircle2, Circle, AlertCircle, Download, ExternalLink,
    Lock, ChevronRight, Settings, User
} from 'lucide-react'
import styles from './DoctorPatientFilePage.module.css'
import logo from '../assets/logo2.png'
import SendReportModal from './SendReportModal'

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard' },
    { icon: Users, label: 'Mes Patients', id: 'patients', active: true },
    { icon: Calendar, label: 'Planning', id: 'planning' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: BarChart2, label: 'Rapports', id: 'reports' },
]

const history = [
    {
        type: 'consult',
        color: '#3B82F6',
        title: 'General Consultation',
        date: 'Oct 12, 2023',
        desc: 'Routine check-up, blood glucose monitoring. Patient reported slight fatigue.',
        doctor: 'DR. SARAH MILLER',
    },
    {
        type: 'surgery',
        color: '#8B5CF6',
        title: 'Left Hip Arthroplasty',
        date: 'Aug 05, 2023',
        desc: 'Total hip replacement surgery. St. Vincent Hospital. Post-op follow-up recommended.',
        doctor: null,
    },
    {
        type: 'urgency',
        color: '#EF4444',
        title: 'Acute Hyperglycemia Episode',
        date: 'Jan 19, 2023',
        desc: 'ER Admission. Glucose 320 mg/dL. Stabilized with insulin. Meds adjusted.',
        doctor: null,
    },
]

const sharedDocs = [
    { name: 'Bilan sanguin', meta: 'LABORATOIRE — 12 OCT 2023', status: 'shared' },
    { name: 'Radio hanche', meta: 'IMAGERIE — 24 SEP 2023', status: 'shared' },
    { name: 'Compte-rendu', meta: '1 document masqué par le patient', status: 'hidden' },
]

const recentDocs = [
    { icon: '🔬', name: 'Blood Analysis (Full)', meta: 'OCT 10, 2023 • PDF • 1.2MB', action: 'download' },
    { icon: '🦴', name: 'X-Ray: Left Hip Follow-up', meta: 'SEP 24, 2023 • DICOM', action: 'open' },
    { icon: '❤️', name: 'Cardiology Stress Test', meta: 'JUL 12, 2023 • PDF', action: 'download' },
]

const cercle = [
    { initial: 'M', name: 'Marie Dupont', role: 'Médecin généraliste', color: '#0EA5B0' },
    { initial: 'C', name: 'Dr. Claude Bernard', role: 'Médecin généraliste', color: '#6B7280' },
]

export default function DoctorPatientFilePage({ onBack, onPatients, onLogout, onConsult, onMedicalRecords, onPatientOverview, onNavigate }) {
    const [seconds, setSeconds] = useState(34 * 60 + 12)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (seconds <= 0) return
        const t = setInterval(() => setSeconds(s => s - 1), 1000)
        return () => clearInterval(t)
    }, [seconds])

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    return (
        <div className={styles.layout}>

            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brand}>
                        <img src={logo} alt="SantéClaire" className={styles.logo} />
                        <span className={styles.brandSub}>MEDICAL PLATFORM</span>
                    </div>
                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (onNavigate && item.id) onNavigate(item.id)
                                    }}
                                    className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                                >
                                    <Icon size={17} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>
                <div className={styles.sidebarBottom}>
                    <button className={styles.navItem} onClick={() => onNavigate && onNavigate('settings')}>
                        <Settings size={17} /> Paramètres
                    </button>
                    <button className={styles.logoutBtn} onClick={onLogout}>
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Patient header ── */}
                <div className={styles.patientHeader}>
                    <div className={styles.patientLeft}>
                        <div className={styles.avatarWrap}>
                            <div className={styles.avatar}>JD</div>
                            <span className={styles.onlineDot} />
                        </div>

                        <div className={styles.patientMeta}>
                            <div className={styles.nameRow}>
                                <h1 className={styles.patientName}>Jean Dupont</h1>
                                <span className={styles.statusPill}>EN SALLE D'ATTENTE</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>65 years old</span>
                                <span className={styles.dot}>•</span>
                                <span>Male</span>
                                <span className={styles.dot}>•</span>
                                <span className={styles.bloodType}>Blood Type: <strong>O+</strong></span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>📞 +33 6 12 34 56 78</span>
                                <span className={styles.divider}>|</span>
                                <span>📍 Paris, France</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.patientActions}>
                        <button className={styles.btnPrimary} onClick={() => onConsult && onConsult()}>
                            <Play size={14} /> Démarrer la consultation
                        </button>
                        <button className={styles.btnSecondary}>
                            <FilePlus size={14} /> Ajouter une note
                        </button>
                        <button className={styles.btnSecondary} onClick={() => onMedicalRecords && onMedicalRecords()}>
                            <FileText size={14} /> Voir les documents
                        </button>
                    </div>
                </div>

                {/* ── Access banner ── */}
                <div className={styles.accessBanner}>
                    <div className={styles.bannerLeft}>
                        <Lock size={15} className={styles.bannerLock} />
                        <div>
                            <div className={styles.bannerTitle}>Accès temporaire accordé par le patient</div>
                            <div className={styles.bannerSub}>L'accès expirera automatiquement à la fin de la consultation.</div>
                        </div>
                    </div>
                    <div className={styles.bannerRight}>
                        <span className={styles.timer}>{fmt(seconds)} restant</span>
                        <button className={styles.btnProlong}>Prolonger</button>
                        <button className={styles.btnEnd}>Terminer</button>
                    </div>
                </div>

                {/* ── Content grid ── */}
                <div className={styles.contentGrid}>

                    {/* ── Left column ── */}
                    <div className={styles.leftCol}>

                        {/* AI Summary */}
                        <div className={styles.aiCard}>
                            <div className={styles.aiHeader}>
                                <span className={styles.aiTitle}>✦ AI CLINICAL SUMMARY</span>
                                <button className={styles.aiSettings}><Settings size={15} /></button>
                            </div>
                            <div className={styles.aiGrid}>
                                <div className={styles.aiBlock}>
                                    <div className={styles.aiBlockLabel}>CHRONIC CONDITIONS</div>
                                    <div className={styles.aiBlockText}>
                                        Type 2 Diabetes<br />(controlled via medication & diet)
                                    </div>
                                </div>
                                <div className={styles.aiBlock}>
                                    <div className={styles.aiBlockLabel}>RECENT SURGERIES</div>
                                    <div className={styles.aiBlockText}>
                                        Hip Replacement (Left), Oct 2023. Fully recovered.
                                    </div>
                                </div>
                                <div className={`${styles.aiBlock} ${styles.aiBlockCritical}`}>
                                    <div className={styles.aiBlockLabelRed}>CRITICAL ALLERGIES</div>
                                    <div className={styles.aiBlockTextRed}>
                                        Penicillin<br />(Anaphylaxis risk)
                                    </div>
                                </div>
                            </div>
                            <button className={styles.aiLink}>View detailed AI insight logs →</button>
                        </div>

                        {/* Historique */}
                        <div className={styles.historySection}>
                            <h2 className={styles.sectionTitle}>Historique médical</h2>
                            {history.map((h, i) => (
                                <div key={i} className={styles.historyItem}>
                                    <div className={styles.historyIcon} style={{ background: h.color }}>
                                        {h.type === 'consult' && <User size={14} color="#fff" />}
                                        {h.type === 'surgery' && <PenLine size={14} color="#fff" />}
                                        {h.type === 'urgency' && <AlertCircle size={14} color="#fff" />}
                                    </div>
                                    <div className={styles.historyContent}>
                                        <div className={styles.historyTop}>
                                            <strong className={styles.historyTitle}>{h.title}</strong>
                                            <span className={styles.historyDate}>{h.date}</span>
                                        </div>
                                        <p className={styles.historyDesc}>{h.desc}</p>
                                        {h.doctor && (
                                            <span className={styles.historyDoctor}>{h.doctor}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className={styles.rightCol}>

                        {/* Documents partagés */}
                        <div className={styles.sideCard}>
                            <div className={styles.sideCardHeader}>
                                <h3 className={styles.sideCardTitle}>Documents partagés</h3>
                                <Lock size={13} color="#9CA3AF" />
                            </div>
                            <p className={styles.sideCardSub}>Le patient contrôle les documents visibles</p>
                            {sharedDocs.map((d, i) => (
                                <div key={i} className={styles.sharedDocRow}>
                                    {d.status === 'shared' ? (
                                        <CheckCircle2 size={15} color="#22C55E" />
                                    ) : (
                                        <Circle size={15} color="#D1D5DB" />
                                    )}
                                    <div className={styles.sharedDocInfo}>
                                        <span className={styles.sharedDocName}>{d.name}</span>
                                        <span className={styles.sharedDocMeta}>{d.meta}</span>
                                    </div>
                                    {d.status === 'shared' && (
                                        <span className={styles.sharedBadge}>PARTAGÉ</span>
                                    )}
                                    {d.status === 'hidden' && (
                                        <span className={styles.hiddenBadge}>MASQUÉ PAR LE PATIENT</span>
                                    )}
                                </div>
                            ))}
                            <button className={styles.seeAllLink} onClick={() => onPatientOverview && onPatientOverview()}>Voir tous les documents →</button>
                        </div>

                        {/* Outils de consultation */}
                        <div className={styles.sideCard}>
                            <h3 className={styles.sideCardTitle}>Outils de consultation</h3>
                            <div className={styles.toolsGrid}>
                                <button className={styles.toolBtn}>
                                    <Mic size={18} />
                                    <span>Enregistrer note</span>
                                </button>
                                <button className={`${styles.toolBtn} ${styles.toolBtnPrimary}`}>
                                    <FileText size={18} />
                                    <span>Générer compte-rendu</span>
                                </button>
                            </div>
                            <div className={styles.draftBox}>
                                <div className={styles.draftHeader}>
                                    <span className={styles.draftLabel}>BROUILLON EN COURS</span>
                                    <span className={styles.draftDot} />
                                    <button className={styles.draftEdit}><PenLine size={13} /></button>
                                </div>
                                <p className={styles.draftText}>
                                    Le patient présente une bonne récupération post-opératoire malgré...
                                </p>
                            </div>
                            <button className={styles.btnSign} onClick={() => setShowModal(true)}>Réviser & Signer</button>
                        </div>

                        {/* Documents récents */}
                        <div className={styles.sideCard}>
                            <div className={styles.sideCardHeader}>
                                <h3 className={styles.sideCardTitle}>Documents récents</h3>
                                <button className={styles.seeAllBtn}>See All</button>
                            </div>
                            {recentDocs.map((d, i) => (
                                <div key={i} className={styles.recentDocRow}>
                                    <span className={styles.recentDocIcon}>{d.icon}</span>
                                    <div className={styles.recentDocInfo}>
                                        <span className={styles.recentDocName}>{d.name}</span>
                                        <span className={styles.recentDocMeta}>{d.meta}</span>
                                    </div>
                                    <button className={styles.recentDocAction}>
                                        {d.action === 'download' ? <Download size={15} /> : <ExternalLink size={15} />}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Cercle de soins */}
                        <div className={`${styles.sideCard} ${styles.cercleCard}`}>
                            <h3 className={styles.cercleTitle}>CERCLE DE SOINS</h3>
                            {cercle.map((c, i) => (
                                <div key={i} className={styles.cercleRow}>
                                    <div className={styles.cercleAvatar} style={{ background: c.color }}>
                                        {c.initial}
                                    </div>
                                    <div>
                                        <div className={styles.cercleName}>{c.name}</div>
                                        <div className={styles.cercleRole}>{c.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {showModal && (
                <SendReportModal
                    onClose={() => setShowModal(false)}
                    onConfirm={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
