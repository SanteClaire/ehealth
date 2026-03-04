import { useState } from 'react'
import {
    LayoutDashboard, Users, Calendar, MessageSquare, BarChart2,
    Settings, LogOut, ChevronLeft, ChevronRight, Search, Bell,
    Clock, Video, User, Plus
} from 'lucide-react'
import styles from './DoctorSchedulePage.module.css'
import logo from '../assets/logo2.png'

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard' },
    { icon: Users, label: 'Mes Patients', id: 'patients' },
    { icon: Calendar, label: 'Planning', id: 'planning', active: true },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: BarChart2, label: 'Rapports', id: 'reports' },
]

// Semaine factice pour la maquette
const weekDays = [
    { day: 'Lun', date: '12' },
    { day: 'Mar', date: '13', current: true },
    { day: 'Mer', date: '14' },
    { day: 'Jeu', date: '15' },
    { day: 'Ven', date: '16' },
]

const appointments = [
    { id: 1, time: '09:00', duration: '30m', patient: 'Alice Dubois', type: 'consultation', typeLabel: 'Consultation', typeColor: '#E0F2FE', textColor: '#0284C7', status: 'confirmé' },
    { id: 2, time: '10:00', duration: '45m', patient: 'Jean Dupont', type: 'video', typeLabel: 'Téléconsultation', typeColor: '#FDF4FF', textColor: '#C026D3', status: 'salle d\'attente' },
    { id: 3, time: '11:30', duration: '30m', patient: 'Marc Leblanc', type: 'followup', typeLabel: 'Suivi', typeColor: '#ECFCCB', textColor: '#65A30D', status: 'confirmé' },
    { id: 4, time: '14:00', duration: '60m', patient: 'Sophie Martin', type: 'consultation', typeLabel: 'Bilan complet', typeColor: '#FEF3C7', textColor: '#D97706', status: 'en attente' },
]

export default function DoctorSchedulePage({ onNavigate, onLogout }) {
    const [currentView, setCurrentView] = useState('day') // day, week, month

    return (
        <div className={styles.layout}>

            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brand}>
                        <img src={logo} alt="SantéClaire" className={styles.logo} />
                        <span className={styles.brandSub}>ESPACE MÉDECIN</span>
                    </div>
                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate && onNavigate(item.id)}
                                    className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>
                <div className={styles.sidebarBottom}>
                    <button className={styles.navItem} onClick={() => onNavigate && onNavigate('settings')}>
                        <Settings size={18} /> Paramètres
                    </button>
                    <button className={styles.logoutBtn} onClick={onLogout}>
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className={styles.main}>

                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1>Planning</h1>
                        <p>Gérez vos rendez-vous et disponibilités</p>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.searchBox}>
                            <Search size={16} className={styles.searchIcon} />
                            <input type="text" placeholder="Rechercher un RDV..." className={styles.searchInput} />
                        </div>
                        <button className={styles.iconBtn}>
                            <Bell size={18} />
                            <span className={styles.notifDot}></span>
                        </button>
                        <button className={styles.btnPrimary}>
                            <Plus size={16} /> Nouveau RDV
                        </button>
                    </div>
                </header>

                <div className={styles.content}>

                    {/* Controls Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.toolbarLeft}>
                            <button className={styles.btnToday}>Aujourd'hui</button>
                            <div className={styles.navArrows}>
                                <button className={styles.arrowBtn}><ChevronLeft size={18} /></button>
                                <button className={styles.arrowBtn}><ChevronRight size={18} /></button>
                            </div>
                            <h2 className={styles.currentDate}>Mardi 13 Octobre 2023</h2>
                        </div>
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${currentView === 'day' ? styles.viewBtnActive : ''}`}
                                onClick={() => setCurrentView('day')}
                            >Jour</button>
                            <button
                                className={`${styles.viewBtn} ${currentView === 'week' ? styles.viewBtnActive : ''}`}
                                onClick={() => setCurrentView('week')}
                            >Semaine</button>
                            <button
                                className={`${styles.viewBtn} ${currentView === 'month' ? styles.viewBtnActive : ''}`}
                                onClick={() => setCurrentView('month')}
                            >Mois</button>
                        </div>
                    </div>

                    {/* Schedule Grid */}
                    <div className={styles.scheduleContainer}>

                        {/* Days Header */}
                        <div className={styles.daysHeader}>
                            <div className={styles.timeColumnEmpty}></div>
                            {weekDays.map((d, i) => (
                                <div key={i} className={`${styles.dayHeaderCell} ${d.current ? styles.dayHeaderCurrent : ''}`}>
                                    <span className={styles.dayName}>{d.day}</span>
                                    <span className={styles.dayNumber}>{d.date}</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Body */}
                        <div className={styles.gridBody}>
                            {/* Time axis */}
                            <div className={styles.timeAxis}>
                                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                                    <div key={t} className={styles.timeSlot}>
                                        <span>{t}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Lines */}
                            <div className={styles.gridLines}>
                                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                                    <div key={t} className={styles.gridLine}></div>
                                ))}

                                {/* Appointments Mocked */}
                                {appointments.map(apt => (
                                    <div
                                        key={apt.id}
                                        className={styles.appointmentCard}
                                        style={{
                                            top: `${(parseInt(apt.time.split(':')[0]) - 8) * 80 + (parseInt(apt.time.split(':')[1]) / 60) * 80}px`,
                                            height: `${(parseInt(apt.duration) / 60) * 80}px`,
                                            backgroundColor: apt.typeColor,
                                            borderLeftColor: apt.textColor
                                        }}
                                    >
                                        <div className={styles.aptHeader}>
                                            <span style={{ color: apt.textColor, fontWeight: 700 }}>{apt.time}</span>
                                            {apt.type === 'video' ? <Video size={12} color={apt.textColor} /> : <User size={12} color={apt.textColor} />}
                                        </div>
                                        <div className={styles.aptPatient}>{apt.patient}</div>
                                        <div className={styles.aptType} style={{ color: apt.textColor }}>{apt.typeLabel}</div>
                                        {apt.status === 'salle d\'attente' && (
                                            <div className={styles.aptBadge}>En salle d'attente</div>
                                        )}
                                    </div>
                                ))}

                                {/* Current time indicator */}
                                <div className={styles.currentTimeLine} style={{ top: '340px' }}>
                                    <div className={styles.currentTimeDot}></div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    )
}
