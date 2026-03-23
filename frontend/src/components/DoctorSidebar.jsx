import {
    LayoutDashboard,
    Users,
    Calendar,
    MessageSquare,
    Settings,
    LogOut,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import styles from './DoctorSidebar.module.css'
import logo from '../assets/logo.png'

/**
 * Barre latérale unifiée pour l’espace praticien (même structure que les pages patient).
 * @param {string} [activeId] — id de la entrée active : dashboard | patients | planning | messages | settings
 */
export default function DoctorSidebar({ activeId, onNavigate, onLogout }) {
    const { t } = useLanguage()

    const items = [
        { id: 'dashboard', icon: LayoutDashboard, label: t('doctor.dashboard') },
        { id: 'patients', icon: Users, label: t('doctor.patients') },
        { id: 'planning', icon: Calendar, label: t('doctor.schedule') },
        { id: 'messages', icon: MessageSquare, label: t('doctor.messages') },
        { id: 'settings', icon: Settings, label: t('doctor.settings') },
    ]

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarTop}>
                <div className={styles.brand}>
                    <img src={logo} alt="SantéClaire" className={styles.logo} />
                </div>
                <nav className={styles.nav} aria-label={t('doctor.practitionerSpace')}>
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeId != null && activeId === item.id
                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
                                onClick={() => onNavigate?.(item.id)}
                            >
                                <Icon size={17} className={styles.navIcon} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>
            </div>
            <div className={styles.sidebarBottom}>
                <button type="button" className={styles.btnLogout} onClick={() => onLogout?.()}>
                    <LogOut size={16} /> {t('sidebar.logout')}
                </button>
            </div>
        </aside>
    )
}
