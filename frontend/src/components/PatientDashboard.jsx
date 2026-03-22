import { useState } from 'react'
import { 
    Home, 
    Folder, 
    Calendar, 
    MessageSquare, 
    Settings, 
    LogOut,
    FileText,
    Pill,
    Bot,
    Bell,
    User,
    ChevronRight
} from 'lucide-react'
import styles from './PatientDashboard.module.css'
import logo from '../assets/logo2.png'

export default function PatientDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard')

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
        { id: 'dossier', icon: Folder, label: 'Mon dossier médical' },
        { id: 'rdv', icon: Calendar, label: 'Mes rendez-vous' },
        { id: 'ordonnances', icon: FileText, label: 'Mes ordonnances' },
        { id: 'messages', icon: MessageSquare, label: 'Messages' },
        { id: 'assistant', icon: Bot, label: 'Assistant IA' },
        { id: 'settings', icon: Settings, label: 'Paramètres' },
    ]

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <img src={logo} alt="SantéClaire" className={styles.logo} />
                </div>

                <nav className={styles.nav}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button className={styles.logoutBtn} onClick={onLogout}>
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>Tableau de bord</h1>
                        <p className={styles.welcomeText}>
                            Bienvenue, <strong>{user?.firstName || 'Patient'}</strong> !
                        </p>
                    </div>
                    <div className={styles.headerRight}>
                        <button className={styles.notifBtn}>
                            <Bell size={20} />
                            <span className={styles.notifBadge}>2</span>
                        </button>
                        <div className={styles.userAvatar}>
                            <User size={20} />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className={styles.content}>
                    {/* Quick Stats */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #0d7377, #14a3a8)' }}>
                                <Calendar size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>2</span>
                                <span className={styles.statLabel}>RDV à venir</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <FileText size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>3</span>
                                <span className={styles.statLabel}>Ordonnances actives</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                                <Folder size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>12</span>
                                <span className={styles.statLabel}>Documents</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                                <MessageSquare size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>1</span>
                                <span className={styles.statLabel}>Message non lu</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Actions rapides</h2>
                        <div className={styles.actionsGrid}>
                            <button className={styles.actionCard}>
                                <Calendar size={32} className={styles.actionIcon} />
                                <span>Prendre RDV</span>
                                <ChevronRight size={16} />
                            </button>
                            <button className={styles.actionCard}>
                                <Bot size={32} className={styles.actionIcon} />
                                <span>Parler à l'Assistant IA</span>
                                <ChevronRight size={16} />
                            </button>
                            <button className={styles.actionCard}>
                                <Folder size={32} className={styles.actionIcon} />
                                <span>Ajouter un document</span>
                                <ChevronRight size={16} />
                            </button>
                            <button className={styles.actionCard}>
                                <Pill size={32} className={styles.actionIcon} />
                                <span>Mes traitements</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </section>

                    {/* Upcoming Appointments */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Prochains rendez-vous</h2>
                        <div className={styles.appointmentsList}>
                            <div className={styles.appointmentCard}>
                                <div className={styles.appointmentDate}>
                                    <span className={styles.day}>25</span>
                                    <span className={styles.month}>Mars</span>
                                </div>
                                <div className={styles.appointmentInfo}>
                                    <strong>Dr. Jean Dupont</strong>
                                    <span>Médecine Générale</span>
                                    <span className={styles.time}>14h30</span>
                                </div>
                                <button className={styles.detailsBtn}>Détails</button>
                            </div>
                            <div className={styles.appointmentCard}>
                                <div className={styles.appointmentDate}>
                                    <span className={styles.day}>02</span>
                                    <span className={styles.month}>Avril</span>
                                </div>
                                <div className={styles.appointmentInfo}>
                                    <strong>Dr. Sophie Martin</strong>
                                    <span>Cardiologie</span>
                                    <span className={styles.time}>10h00</span>
                                </div>
                                <button className={styles.detailsBtn}>Détails</button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
