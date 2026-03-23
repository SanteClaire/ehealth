import { useState, useRef, useEffect } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Search, Bell, Plus, Upload, ChevronRight, MessageSquare,
    AlertCircle, Clock, Mail, FolderOpen, Bot,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchPatientStats, fetchPatientConsultations, fetchPatientDocuments, fetchPatientOrdonnances } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientDashboard.module.css'
import logo from '../assets/logo.png'

const SUPPORT_EMAIL = 'mailto:support@santeclaire.fr'

export default function PatientDashboard({ user, onLogout, onNavigate }) {
    const { t } = useLanguage()
    const fileInputRef = useRef(null)
    const [stats, setStats] = useState(null)
    const [consultations, setConsultations] = useState([])
    const [documents, setDocuments] = useState([])
    const [ordonnances, setOrdonnances] = useState([])

    useEffect(() => {
        fetchPatientStats().then(r => r.success && setStats(r.data))
        fetchPatientConsultations().then(r => r.success && setConsultations(r.data))
        fetchPatientDocuments().then(r => r.success && setDocuments(r.data))
        fetchPatientOrdonnances().then(r => r.success && setOrdonnances(r.data))
    }, [])

    const userName = user?.firstName || 'Patient'
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Patient'
    const userInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'P'

    // Build "at a glance" cards from real data
    const atAGlance = []
    if (ordonnances.length > 0) {
        const latest = ordonnances[0]
        atAGlance.push({
            icon: 'document',
            title: `Ordonnance Dr. ${latest.medecin.lastName}`,
            statusType: 'new',
            desc: `Émise le ${new Date(latest.dateEmission).toLocaleDateString('fr-FR')}`,
            onAction: () => onNavigate && onNavigate('documents'),
        })
    }
    if (consultations.length > 0) {
        const next = consultations.find(c => c.estActive) || consultations[0]
        atAGlance.push({
            icon: 'appointment',
            title: `Dr. ${next.medecin.lastName} — ${next.medecin.specialite}`,
            statusType: next.estActive ? 'new' : 'scheduled',
            desc: new Date(next.dateDebut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
            onAction: () => onNavigate && onNavigate('documents'),
        })
    }
    if (atAGlance.length === 0) {
        atAGlance.push({
            icon: 'document',
            title: 'Aucune activité récente',
            statusType: 'scheduled',
            desc: 'Vos documents et ordonnances apparaîtront ici.',
            onAction: () => onNavigate && onNavigate('documents'),
        })
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard', active: true },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents' },
        { icon: Users, label: t('sidebar.family'), id: 'famille' },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia' },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings' },
    ]

    const handleLogout = () => {
        onLogout && onLogout()
    }

    const handleFilesSelected = (e) => {
        const files = e.target.files
        if (files?.length) {
            console.info('[SantéClaire] Fichiers sélectionnés pour import :', [...files].map((f) => f.name))
        }
        e.target.value = ''
    }

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
                                    className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                                    onClick={() => onNavigate && onNavigate(item.id)}
                                >
                                    <Icon size={17} className={styles.navIcon} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className={styles.sidebarBottom}>
                    <button className={styles.btnLogout} onClick={handleLogout}>
                        <LogOut size={16} /> {t('sidebar.logout')}
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
                            placeholder={t('dashboard.searchPlaceholder')}
                        />
                    </div>
                    <div className={styles.topRight}>
                        <LanguageSwitcher />
                        <button className={styles.iconBtn}>
                            <Bell size={17} />
                        </button>
                        <button
                            type="button"
                            className={styles.profileBlock}
                            onClick={() => onNavigate && onNavigate('profil')}
                            aria-label={t('sidebar.profile')}
                        >
                            <div className={styles.profileInfo}>
                                <span className={styles.profileName}>{userFullName}</span>
                                <span className={styles.profileRole}>{t('common.patientId')}</span>
                            </div>
                            <div className={styles.profileAvatar}>{userInitials}</div>
                        </button>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>
                    {/* Stats bar */}
                    {stats && (
                        <div className={styles.familyTabs}>
                            <div className={styles.dossiertLabel}>{t('dashboard.activeFile')}</div>
                            <div className={styles.tabs}>
                                <span className={styles.tab} style={{ cursor: 'default', opacity: 0.9 }}>
                                    <span className={styles.dot} />
                                    {stats.ordonnancesCount} ordonnance{stats.ordonnancesCount !== 1 ? 's' : ''}
                                </span>
                                <span className={styles.tab} style={{ cursor: 'default', opacity: 0.9 }}>
                                    <span className={styles.dot} />
                                    {stats.documentsCount} document{stats.documentsCount !== 1 ? 's' : ''}
                                </span>
                                <span className={styles.tab} style={{ cursor: 'default', opacity: 0.9 }}>
                                    <span className={styles.dot} />
                                    {consultations.length} consultation{consultations.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Welcome section */}
                    <div className={styles.welcomeSection}>
                        <h1 className={styles.greeting}>
                            Bonjour, {userName}
                        </h1>
                        <p className={styles.subgreeting}>
                            Heureux de vous revoir. Voici un aperçu de votre santé aujourd'hui.
                        </p>
                    </div>

                    {/* At a glance section */}
                    <div className={styles.atGlanceSection}>
                        <h2 className={styles.sectionTitle}>
                            <AlertCircle size={18} /> {t('dashboard.atAGlance')}
                        </h2>
                        <div className={styles.atGlanceGrid}>
                            {atAGlance.map((item, i) => (
                                <div key={i} className={styles.atGlanceCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardIcon}>
                                            {item.icon === 'document' && <FileText size={22} />}
                                            {item.icon === 'appointment' && <Clock size={22} />}
                                        </div>
                                        <span className={`${styles.statusBadge} ${styles[`status_${item.statusType}`]}`}>
                                            {item.statusType === 'new' ? 'Nouveau' : 'Planifié'}
                                        </span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDesc}>{item.desc}</p>
                                    <button
                                        type="button"
                                        className={styles.cardAction}
                                        onClick={item.onAction}
                                    >
                                        {t('dashboard.view')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sharing preferences */}
                    <div className={styles.sharingSection}>
                        <span className={styles.sharedBadge}>{t('dashboard.shared')}</span>
                        <span className={styles.privateBadge}>{t('dashboard.makePrivate')}</span>
                        <p className={styles.sharingText}>
                            {t('dashboard.sharingDefault')}{' '}
                            <button
                                type="button"
                                className={styles.link}
                                onClick={() => onNavigate && onNavigate('settings')}
                            >
                                {t('dashboard.managePreferences')}
                            </button>
                        </p>
                    </div>

                    {/* Timeline from real documents */}
                    <div className={styles.timeline}>
                        {documents.map((doc, i) => (
                            <div key={i} className={styles.timelineItem}>
                                <div className={styles.timelineMarker} />
                                <div className={styles.timelineContent}>
                                    <span className={styles.timelineDate}>{doc.type}</span>
                                    <h3 className={styles.timelineTitle}>{doc.nomOriginal}</h3>
                                    <p className={styles.timelineProvider}>
                                        {doc.createurMedecin ? `Dr. ${doc.createurMedecin.lastName} — ${doc.createurMedecin.specialite}` : 'Source inconnue'}
                                    </p>
                                    <div className={styles.timelineBadges}>
                                        <span className={styles.badge}>
                                            {doc.estPartage ? 'Partagé' : 'Privé'}
                                        </span>
                                    </div>
                                    {doc.resumeIA && (
                                        <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: 6, fontStyle: 'italic' }}>
                                            IA: {doc.resumeIA}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {documents.length === 0 && (
                            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Aucun document médical pour le moment.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Right panel ── */}
            <aside className={styles.rightPanel}>
                {/* Upload section */}
                <div className={styles.uploadCard}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.heic"
                        multiple
                        className={styles.visuallyHidden}
                        aria-hidden
                        tabIndex={-1}
                        onChange={handleFilesSelected}
                    />
                    <h3 className={styles.panelTitle}>{t('dashboard.addDocument')}</h3>
                    <button
                        type="button"
                        className={styles.uploadZone}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={32} className={styles.uploadIcon} />
                    </button>
                    <p className={styles.uploadText}>
                        {t('dashboard.dragDrop')}<br />
                        {t('dashboard.uploadFormats')}
                    </p>
                    <button
                        type="button"
                        className={styles.browseBtn}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {t('dashboard.browseFiles')}
                    </button>
                </div>

                {/* AI Assistant */}
                <div className={styles.aiCard}>
                    <div className={styles.aiHeader}>
                        <MessageCircle size={20} />
                        <div>
                            <h3 className={styles.aiTitle}>{t('dashboard.aiAssistant')}</h3>
                            <p className={styles.aiSubtitle}>{t('dashboard.available247')}</p>
                        </div>
                    </div>
                    <p className={styles.aiDesc}>
                        {t('dashboard.aiDesc')}
                    </p>
                    <button
                        type="button"
                        className={styles.btnDiscuss}
                        onClick={() => onNavigate && onNavigate('ia')}
                    >
                        <MessageSquare size={14} /> {t('dashboard.startDiscussion')}
                    </button>
                </div>

                {/* Patient info card */}
                {user && (
                    <div className={styles.familyCard}>
                        <h3 className={styles.panelTitle}>Mon profil</h3>
                        <div className={styles.familyAvatars}>
                            <div className={styles.avatar}>{userInitials}</div>
                        </div>
                        <p className={styles.familyText}>
                            {user.groupeSanguin && <>Groupe sanguin : <strong>{user.groupeSanguin}</strong><br /></>}
                            {user.allergies && <>Allergies : {user.allergies}<br /></>}
                            {user.telephone && <>Tél : {user.telephone}</>}
                        </p>
                        <button
                            type="button"
                            className={styles.familyDashboardCta}
                            onClick={() => onNavigate && onNavigate('profil')}
                        >
                            Voir mon profil
                        </button>
                    </div>
                )}

                {/* Support */}
                <div className={styles.supportCard}>
                    <h3 className={styles.supportTitle}>{t('dashboard.supportHealth')}</h3>
                    <p className={styles.supportText}>
                        {t('dashboard.needHelp')}
                    </p>
                    <a className={styles.btnSupport} href={SUPPORT_EMAIL}>
                        {t('dashboard.contactAdvisor')}
                    </a>
                </div>
            </aside>
        </div>
    )
}
