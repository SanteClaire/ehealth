import { useState } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Search, Bell, ChevronRight, Shield, Check, X,
    Lock, Calendar, Pill, FileCheck, Download,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientManageRights.module.css'
import logo from '../assets/logo.png'


const member = {
    id: 'alice',
    name: 'Alice Dupont',
    relation: 'Daughter',
    memberSince: 'Member since 2021',
    lastActivity: 'Last activity: 2 hours ago',
    avatar: 'AD',
}

const granularPermissions = [
    { id: 'reports', icon: FileCheck, titleKey: 'rights.medicalReports', descKey: 'rights.medicalReportsDesc', enabled: true },
    { id: 'prescriptions', icon: Pill, titleKey: 'rights.prescriptions', descKey: 'rights.prescriptionsDesc', enabled: true },
    { id: 'labResults', icon: FileCheck, titleKey: 'rights.labResults', descKey: 'rights.labResultsDesc', enabled: false },
    { id: 'appointments', icon: Calendar, titleKey: 'rights.upcomingAppointments', descKey: 'rights.upcomingAppointmentsDesc', enabled: true },
]


const sharedDocuments = [
    {
        id: 1,
        name: 'Blood_Work_Oct_2023.pdf',
        date: 'Oct 12, 2023',
        category: 'Lab Result',
        categoryColor: 'purple',
        shared: true,
    },
    {
        id: 2,
        name: 'Discharge_Summary.docx',
        date: 'Sep 28, 2023',
        category: 'Report',
        categoryColor: 'blue',
        shared: true,
    },
    {
        id: 3,
        name: 'MRI_Brain_Scan_Results.pdf',
        date: 'Aug 05, 2023',
        category: 'Lab Result',
        categoryColor: 'purple',
        shared: true,
    },
    {
        id: 4,
        name: 'Amoxicillin_Prescription.pdf',
        date: 'Jul 20, 2023',
        category: 'Prescription',
        categoryColor: 'green',
        shared: true,
    },
]

export default function PatientManageRights({ onLogout, onNavigate, onBack, selectedMemberId }) {
    const { t } = useLanguage()
    const [accessLevel, setAccessLevel] = useState('full')
    const [permissions, setPermissions] = useState(granularPermissions)

    const doctorInfo = {
        name: 'Dr. Jean Martin',
        specialtyKey: 'doctor.cardiology',
        status: 'Latest visit 24/07/2024 (7 DAYS REMAINING)',
        expiresInKey: 'doctor.expiresIn',
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard' },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents' },
        { icon: Users, label: t('sidebar.family'), id: 'famille', active: true },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia' },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings' },
    ]

    // Récupérer les données du membre selon l'ID
    const getMemberData = () => {
        const members = {
            'self': { name: 'Jean Dupont', relation: 'Moi', avatar: 'JD', memberSince: 'Member since 2021', lastActivity: 'Last activity: 2 hours ago' },
            'alice': { name: 'Alice Dupont', relation: 'Fille', avatar: 'AD', memberSince: 'Member since 2021', lastActivity: 'Last activity: 2 hours ago' },
            'robert': { name: 'Robert Dupont', relation: 'Père', avatar: 'RD', memberSince: 'Member since 2021', lastActivity: 'Last activity: 5 days ago' },
        }
        return members[selectedMemberId] || members['alice']
    }

    const selectedMember = getMemberData()

    const handlePermissionToggle = (id) => {
        setPermissions(permissions.map(p => 
            p.id === id ? { ...p, enabled: !p.enabled } : p
        ))
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
                    <button className={styles.btnLogout} onClick={onLogout}>
                        <LogOut size={16} /> {t('sidebar.logout')}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>
                {/* ── Topbar ── */}
                <header className={styles.topbar}>
                    <div className={styles.searchWrap}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="text"
                            placeholder={t('settings.searchPlaceholder')}
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
                            <span className={styles.profileName}>Jean Dupont</span>
                            <div className={styles.profileAvatar}>JD</div>
                        </button>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>
                    {/* Breadcrumb */}
                    <div className={styles.breadcrumb}>
                        <button className={styles.breadcrumbLink} onClick={onBack}>
                            Family Members
                        </button>
                        <ChevronRight size={16} />
                        <span className={styles.breadcrumbCurrent}>{t('rights.manageRights')}</span>
                    </div>

                    {/* Member Header */}
                    <div className={styles.memberHeader}>
                        <div className={styles.memberInfo}>
                            <div className={styles.memberAvatar}>{selectedMember.avatar}</div>
                            <div>
                                <h1 className={styles.memberName}>{selectedMember.name}</h1>
                                <p className={styles.memberMeta}>{selectedMember.relation} • {selectedMember.memberSince}</p>
                                <p className={styles.memberActivity}>{selectedMember.lastActivity}</p>
                            </div>
                        </div>
                        <div className={styles.secureAccessBadge}>
                            <Shield size={16} /> SECURE ACCESS
                        </div>
                    </div>

                    {/* Global Access Level */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Shield size={16} /> {t('rights.globalAccess')}
                        </h2>
                        <div className={styles.accessLevels}>
                            <button
                                className={`${styles.accessOption} ${accessLevel === 'full' ? styles.accessOptionActive : ''}`}
                                onClick={() => setAccessLevel('full')}
                            >
                                <div className={styles.accessIcon}>
                                    <Check size={20} />
                                </div>
                                <div className={styles.accessContent}>
                                    <div className={styles.accessTitle}>Full Access</div>
                                    <div className={styles.accessDesc}>
                                        Can view, download and manage all records and medical appointments.
                                    </div>
                                </div>
                            </button>

                            <button
                                className={`${styles.accessOption} ${accessLevel === 'view' ? styles.accessOptionActive : ''}`}
                                onClick={() => setAccessLevel('view')}
                            >
                                <div className={styles.accessIcon}>
                                    <FileText size={20} />
                                </div>
                                <div className={styles.accessContent}>
                                    <div className={styles.accessTitle}>{t('rights.viewOnly')}</div>
                                    <div className={styles.accessDesc}>
                                        {t('rights.viewOnlyDesc')}
                                    </div>
                                </div>
                            </button>

                            <button
                                className={`${styles.accessOption} ${accessLevel === 'none' ? styles.accessOptionActive : ''}`}
                                onClick={() => setAccessLevel('none')}
                            >
                                <div className={styles.accessIcon}>
                                    <X size={20} />
                                </div>
                                <div className={styles.accessContent}>
                                    <div className={styles.accessTitle}>No Access</div>
                                    <div className={styles.accessDesc}>
                                        Revokes all access to any personal data and medical history.
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Granular Permissions */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Lock size={16} /> {t('rights.granularPermissions')}
                        </h2>
                        <div className={styles.permissionsList}>
                            {permissions.map((perm) => {
                                const Icon = perm.icon
                                return (
                                    <div key={perm.id} className={styles.permissionItem}>
                                        <div className={styles.permissionContent}>
                                            <Icon size={20} className={styles.permissionIcon} />
                                            <div>
                                                <div className={styles.permissionTitle}>{t(perm.titleKey)}</div>
                                                <div className={styles.permissionDesc}>{t(perm.descKey)}</div>
                                            </div>
                                        </div>
                                        <button
                                            className={`${styles.permissionToggle} ${perm.enabled ? styles.permissionToggleOn : ''}`}
                                            onClick={() => handlePermissionToggle(perm.id)}
                                        >
                                            <div className={styles.toggleSlider}></div>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className={styles.doctorSection}>
                        <div className={styles.doctorCard}>
                            <div className={styles.doctorHeader}>
                                <div>
                                    <div className={styles.doctorName}>{doctorInfo.name}</div>
                                    <div className={styles.doctorSpecialty}>{t(doctorInfo.specialtyKey)}</div>
                                </div>
                                <div className={styles.doctorStatus}>
                                    <span className={styles.dot}></span>
                                    {doctorInfo.status}
                                </div>
                            </div>
                            <div className={styles.doctorTiming}>
                                <div>⏱️ {t(doctorInfo.expiresInKey)}</div>
                                <div>
                                    <button className={styles.btnRevoke}>Révoquer l'accès maintenant</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document Sharing */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Download size={16} /> {t('rights.docSharing')}
                        </h2>
                        <div className={styles.infoBox}>
                            <Check size={16} className={styles.infoIcon} />
                            <span>
                                Tous les documents sont partagés par défaut. Décochez ceux que vous souhaitez garder privés.
                            </span>
                        </div>
                        <div className={styles.documentsTable}>
                            <div className={styles.tableHeader}>
                                <div className={styles.colName}>{t('rights.docName')}</div>
                                <div className={styles.colDate}>{t('rights.date')}</div>
                                <div className={styles.colCategory}>{t('rights.category')}</div>
                                <div className={styles.colShared}>{t('rights.shared')}</div>
                            </div>
                            {sharedDocuments.map((doc) => (
                                <div key={doc.id} className={styles.tableRow}>
                                    <div className={styles.colName}>
                                        <FileText size={16} /> {doc.name}
                                    </div>
                                    <div className={styles.colDate}>{doc.date}</div>
                                    <div className={styles.colCategory}>
                                        <span className={`${styles.categoryBadge} ${styles[`cat_${doc.categoryColor}`]}`}>
                                            {doc.category}
                                        </span>
                                    </div>
                                    <div className={styles.colShared}>
                                        {doc.shared && <Check size={18} className={styles.checkIcon} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.viewAll}>
                            <button type="button" className={styles.viewAllLink} onClick={() => onNavigate && onNavigate('documents')}>
                                View All 12 Documents
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className={styles.footerNote}>
                        <Shield size={12} />
                        {t('rights.changesEffective')}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionBar}>
                <button className={styles.btnCancel} onClick={onBack}>
                    {t('rights.cancel')}
                </button>
                <button className={styles.btnSave}>
                    <Check size={16} /> {t('rights.saveChanges')}
                </button>
            </div>
        </div>
    )
}
