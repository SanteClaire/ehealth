import { useState, useRef } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Search, Bell, Plus, ChevronRight, Shield,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientFamilyProfiles.module.css'
import logo from '../assets/logo.png'

const SUPPORT_EMAIL = 'mailto:support@santeclaire.fr'

export default function PatientFamilyProfiles({ user, onLogout, onNavigate, onManageRights }) {
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState('self')
    const addMemberFileRef = useRef(null)

    const handleAddMemberFiles = (e) => {
        const files = e.target.files
        if (files?.length) {
            console.info('[SantéClaire] Documents pour ajout membre :', [...files].map((f) => f.name))
        }
        e.target.value = ''
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard' },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents' },
        { icon: Users, label: t('sidebar.family'), id: 'famille', active: true },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia' },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings' },
    ]

    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Patient'
    const userInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'P'

    const familyMembers = [
        { id: 'self', name: userFullName, relationKey: 'family.me', age: '', avatar: userInitials, typeKey: 'family.legalRep', lastUpdateKey: 'family.ago2Days', accessLevelKey: 'family.fullAccess', accessColor: 'success' },
    ]

    const profileSnapshots = []

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
                            placeholder={t('family.searchPlaceholder')}
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
                            <span className={styles.profileName}>{userFullName}</span>
                            <div className={styles.profileAvatar}>{userInitials}</div>
                        </button>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.contentHeader}>
                        <div>
                            <h1 className={styles.contentTitle}>{t('family.title')}</h1>
                            <p className={styles.contentSubtitle}>
                                {t('family.subtitle')}
                            </p>
                        </div>
                        <input
                            ref={addMemberFileRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            className={styles.visuallyHidden}
                            aria-hidden
                            tabIndex={-1}
                            onChange={handleAddMemberFiles}
                        />
                        <button
                            type="button"
                            className={styles.btnAdd}
                            onClick={() => addMemberFileRef.current?.click()}
                        >
                            <Plus size={18} /> {t('family.addMember')}
                        </button>
                    </div>

                    {/* Hint Box */}
                    <div className={styles.hintBox}>
                        <span className={styles.hintIcon}>💡</span>
                        <div>
                            <strong>{t('family.hintText')}</strong>
                            <button
                                type="button"
                                className={styles.hintLink}
                                onClick={() => onNavigate && onNavigate('dashboard')}
                            >
                                {t('family.goToDashboard')}
                            </button>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t('family.members')}</h2>
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <div className={styles.colMember}>{t('family.member')}</div>
                                <div className={styles.colRelation}>{t('family.relation')}</div>
                                <div className={styles.colType}>{t('family.type')}</div>
                                <div className={styles.colUpdate}>{t('family.lastUpdate')}</div>
                                <div className={styles.colAccess}>{t('family.accessLevel')}</div>
                                <div className={styles.colActions}>{t('family.actions')}</div>
                            </div>
                            {familyMembers.map((member) => (
                                <div key={member.id} className={styles.tableRow}>
                                    <div className={styles.colMember}>
                                        <div className={styles.memberInfo}>
                                            <div className={styles.avatar}>{member.avatar}</div>
                                            <div>
                                                <div className={styles.memberName}>{member.name}</div>
                                                <div className={styles.memberRelation}>{member.relation}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.colRelation}>{t(member.relationKey)}{member.age ? ` — ${member.age} ${t('family.years')}` : ''}</div>
                                    <div className={styles.colType}>
                                        <span className={styles.badge}>{t(member.typeKey)}</span>
                                    </div>
                                    <div className={styles.colUpdate}>{t(member.lastUpdateKey)}</div>
                                    <div className={styles.colAccess}>
                                        <span className={`${styles.accessBadge} ${styles[`access_${member.accessColor}`]}`}>
                                            {t(member.accessLevelKey)}
                                        </span>
                                    </div>
                                    <div className={styles.colActions}>
                                        <button className={styles.actionBtn} onClick={() => onManageRights && onManageRights(member.id)}>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profile Snapshots */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t('family.profileSnapshot')}</h2>
                        <div className={styles.snapshotsGrid}>
                            {profileSnapshots.map((profile) => (
                                <div key={profile.id} className={styles.snapshotCard}>
                                    <div className={styles.snapshotBox} style={{backgroundColor: `var(--box-${profile.box})`}}></div>
                                    <div className={styles.snapshotContent}>
                                        <div className={styles.snapshotStatus}>
                                            <span className={styles.statusLabel}>MISE À JOUR : 2J</span>
                                            <span className={`${styles.statusBadge} ${styles[`status_${profile.statusColor}`]}`}>
                                                {t(profile.statusKey)}
                                            </span>
                                        </div>
                                        <h3 className={styles.snapshotName}>{profile.name}</h3>
                                        <p className={styles.snapshotRole}>{t(profile.roleKey)}</p>
                                        <p className={styles.snapshotSpec}>{t(profile.specKey)}</p>
                                        <button
                                            type="button"
                                            className={styles.btnView}
                                            onClick={() => onNavigate && onNavigate('dashboard')}
                                        >
                                            Voir le tableau de bord <ChevronRight size={16} />
                                        </button>
                                        <button className={styles.btnRights} onClick={() => onManageRights && onManageRights(profile.id)}>
                                            <Shield size={14} /> Gérer les droits d'accès médicins
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className={styles.footerInfo}>
                        <p>
                            {t('family.rgpdNote')} {t('family.encryptionNote')}
                        </p>
                        <div className={styles.footerLinks}>
                            <a href="/#cta" className={styles.footerLink}>{t('family.termsOfUse')}</a>
                            <a href={SUPPORT_EMAIL} className={styles.footerLink}>{t('family.assistance')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
