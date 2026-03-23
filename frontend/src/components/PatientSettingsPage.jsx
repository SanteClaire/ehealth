import { useState } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Search, Bell, Camera, Eye, EyeOff, Lock,
    Smartphone, Download, Trash2, LogOut as LogOutIcon, Check,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientSettingsPage.module.css'
import logo from '../assets/logo.png'

export default function PatientSettingsPage({ user, onLogout, onNavigate }) {
    const { t } = useLanguage()
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Patient'
    const userInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'P'

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard' },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents' },
        { icon: Users, label: t('sidebar.family'), id: 'famille' },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia' },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings', active: true },
    ]
    const [firstName, setFirstName] = useState(user?.firstName || '')
    const [lastName, setLastName] = useState(user?.lastName || '')
    const [email, setEmail] = useState(user?.email || '')
    const [phone, setPhone] = useState(user?.telephone || '')
    
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    
    const [twoFAEnabled, setTwoFAEnabled] = useState(false)
    const [shareDocsByDefault, setShareDocsByDefault] = useState(true)
    
    const [notifications, setNotifications] = useState({
        appointmentEmail: true,
        appointmentSMS: true,
        appointmentPush: true,
        documentsEmail: true,
        documentsSMS: false,
        documentsPush: true,
        securityEmail: false,
        securitySMS: true,
        securityPush: true,
    })

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSaveProfile = () => {
        console.log('Profile saved:', { firstName, lastName, email, phone })
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
                            <span className={styles.profileName}>{userFullName}</span>
                            <div className={styles.profileAvatar}>{userInitials}</div>
                        </button>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.contentHeader}>
                        <h1 className={styles.contentTitle}>{t('settings.title')}</h1>
                        <p className={styles.contentSubtitle}>
                            {t('settings.subtitle')}
                        </p>
                    </div>

                    {/* MON PROFIL */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            👤 {t('settings.myProfile')}
                        </h2>
                        <div className={styles.profileCard}>
                            <div className={styles.profilePhotoSection}>
                                <div className={styles.profilePhoto}>{userInitials}</div>
                                <button className={styles.btnUploadPhoto}>
                                    <Camera size={16} /> {t('settings.photoFormat')}
                                </button>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('settings.lastName')}</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('settings.phone')}</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button className={styles.btnSubmit} onClick={handleSaveProfile}>
                                {t('settings.saveChanges')}
                            </button>
                        </div>
                    </section>

                    {/* SÉCURITÉ & CONNEXION */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Lock size={16} /> SÉCURITÉ & CONNEXION
                        </h2>

                        {/* Change Password */}
                        <div className={styles.subsection}>
                            <h3 className={styles.subsectionTitle}>{t('settings.changePassword')}</h3>
                            <div className={styles.passwordGrid}>
                                <div className={styles.formGroup}>
                                    <label>{t('settings.currentPassword')}</label>
                                    <div className={styles.passwordInput}>
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nouveau mot de passe</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t('settings.confirmPassword')}</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button 
                                className={styles.btnShowPassword}
                                onClick={() => setShowPasswords(!showPasswords)}
                            >
                                {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                                {showPasswords ? 'Masquer' : 'Afficher'}
                            </button>
                            <button className={styles.btnUpdatePassword}>
                                {t('settings.updatePassword')}
                            </button>
                        </div>

                        {/* 2FA */}
                        <div className={styles.subsection}>
                            <div className={styles.subsectionHeader}>
                                <div>
                                    <h3 className={styles.subsectionTitle}>{t('settings.twoFactor')}</h3>
                                    <p className={styles.subsectionDesc}>
                                        {t('settings.twoFactorDesc')}
                                    </p>
                                </div>
                                <button 
                                    className={`${styles.toggleBtn} ${twoFAEnabled ? styles.toggleOn : ''}`}
                                    onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                                >
                                    <div className={styles.toggleSlider}></div>
                                </button>
                            </div>
                        </div>

                        {/* Active Sessions */}
                        <div className={styles.subsection}>
                            <h3 className={styles.subsectionTitle}>Sessions actives</h3>
                            <div className={styles.sessionsList}>
                                <div className={styles.sessionItem}>
                                    <div className={styles.sessionInfo}>
                                        <Smartphone size={20} />
                                        <div>
                                            <div className={styles.sessionDevice}>Session actuelle — {navigator.userAgent.includes('Windows') ? 'Windows' : navigator.userAgent.includes('Mac') ? 'Mac' : 'Navigateur'}</div>
                                            <div className={styles.sessionTime}>{t('settings.connectedNow')}</div>
                                        </div>
                                    </div>
                                    <span className={styles.sessionCurrent}>{t('settings.currentSession')}</span>
                                </div>
                            </div>
                            <button className={styles.btnRevokeAll}>
                                <LogOutIcon size={14} /> {t('settings.revokeAll')}
                            </button>
                        </div>
                    </section>

                    {/* CONFIDENTIALITÉ & RGPD */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Lock size={16} /> CONFIDENTIALITÉ & RGPD
                        </h2>

                        <div className={styles.gdprGrid}>
                            <div className={styles.gdprCard}>
                                <div className={styles.gdprCardHeader}>
                                    <h3>{t('settings.shareByDefault')}</h3>
                                    <button 
                                        className={`${styles.toggleBtn} ${shareDocsByDefault ? styles.toggleOn : ''}`}
                                        onClick={() => setShareDocsByDefault(!shareDocsByDefault)}
                                    >
                                        <div className={styles.toggleSlider}></div>
                                    </button>
                                </div>
                                <p>Autoriser les praticiens à consulter mes antécédents médicaux lors d'un rendez-vous.</p>
                            </div>

                            <div className={styles.gdprButtonsGrid}>
                                <div className={styles.gdprCard2}>
                                    <h3>{t('settings.dataPortability')}</h3>
                                    <p>{t('settings.dataPortabilityDesc')}</p>
                                    <button className={styles.btnGdpr}>
                                        <Download size={14} /> {t('settings.exportData')}
                                    </button>
                                </div>
                                <div className={styles.gdprCard2}>
                                    <h3>{t('settings.rightToForget')}</h3>
                                    <p>{t('settings.rightToForgetDesc')}</p>
                                    <button className={styles.btnGdprDanger}>
                                        <Trash2 size={14} /> {t('settings.deleteAccount')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PRÉFÉRENCES DE NOTIFICATION */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Bell size={16} /> {t('settings.notifications')}
                        </h2>
                        <div className={styles.notificationsTable}>
                            <div className={styles.notificationsHeader}>
                                <div className={styles.colType}>{t('settings.notifType')}</div>
                                <div className={styles.colEmail}>EMAIL</div>
                                <div className={styles.colSMS}>SMS</div>
                                <div className={styles.colPush}>PUSH APP</div>
                            </div>

                            <div className={styles.notificationRow}>
                                <div className={styles.colType}>
                                    <div className={styles.notifTitle}>{t('settings.appointmentReminders')}</div>
                                    <div className={styles.notifDesc}>{t('settings.appointmentRemindersDesc')}</div>
                                </div>
                                <div className={styles.colEmail}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.appointmentEmail}
                                        onChange={() => handleNotificationChange('appointmentEmail')}
                                    />
                                </div>
                                <div className={styles.colSMS}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.appointmentSMS}
                                        onChange={() => handleNotificationChange('appointmentSMS')}
                                    />
                                </div>
                                <div className={styles.colPush}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.appointmentPush}
                                        onChange={() => handleNotificationChange('appointmentPush')}
                                    />
                                </div>
                            </div>

                            <div className={styles.notificationRow}>
                                <div className={styles.colType}>
                                    <div className={styles.notifTitle}>{t('settings.newDocuments')}</div>
                                    <div className={styles.notifDesc}>{t('settings.newDocumentsDesc')}</div>
                                </div>
                                <div className={styles.colEmail}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.documentsEmail}
                                        onChange={() => handleNotificationChange('documentsEmail')}
                                    />
                                </div>
                                <div className={styles.colSMS}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.documentsSMS}
                                        onChange={() => handleNotificationChange('documentsSMS')}
                                    />
                                </div>
                                <div className={styles.colPush}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.documentsPush}
                                        onChange={() => handleNotificationChange('documentsPush')}
                                    />
                                </div>
                            </div>

                            <div className={styles.notificationRow}>
                                <div className={styles.colType}>
                                    <div className={styles.notifTitle}>Alertes de sécurité</div>
                                    <div className={styles.notifDesc}>Connexion suspecte, changement de MDP</div>
                                </div>
                                <div className={styles.colEmail}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.securityEmail}
                                        onChange={() => handleNotificationChange('securityEmail')}
                                    />
                                </div>
                                <div className={styles.colSMS}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.securitySMS}
                                        onChange={() => handleNotificationChange('securitySMS')}
                                    />
                                </div>
                                <div className={styles.colPush}>
                                    <input
                                        type="checkbox"
                                        checked={notifications.securityPush}
                                        onChange={() => handleNotificationChange('securityPush')}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p>{t('settings.footer')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
