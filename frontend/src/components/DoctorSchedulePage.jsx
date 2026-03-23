import { useState, useEffect } from 'react'
import {
    ChevronLeft, ChevronRight, Search, Bell,
    Video, Plus, User,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchMedecinConsultations } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorSchedulePage.module.css'

export default function DoctorSchedulePage({ user, onNavigate, onLogout }) {
    const { t } = useLanguage()
    const [currentView, setCurrentView] = useState('day')
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        fetchMedecinConsultations().then(r => {
            if (r.success) {
                setAppointments(r.data.map(c => ({
                    id: c.id,
                    time: new Date(c.dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    duration: c.dateFin ? `${Math.round((new Date(c.dateFin) - new Date(c.dateDebut)) / 60000)}m` : '—',
                    patient: `${c.patient.firstName} ${c.patient.lastName}`,
                    type: 'consultation',
                    typeLabel: c.estActive ? 'En cours' : 'Consultation',
                    typeColor: c.estActive ? '#FEF3C7' : '#E0F2FE',
                    textColor: c.estActive ? '#D97706' : '#0284C7',
                    status: c.estActive ? 'en cours' : (c.dateFin ? 'terminée' : 'planifiée'),
                    date: new Date(c.dateDebut).toLocaleDateString('fr-FR'),
                })))
            }
        })
    }, [])

    // Build week days from current date
    const today = new Date()
    const weekDays = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - today.getDay() + 1 + i)
        return { day: d.toLocaleDateString('fr-FR', { weekday: 'short' }), date: d.getDate().toString(), current: d.toDateString() === today.toDateString() }
    })

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="planning" onNavigate={onNavigate} onLogout={onLogout} />

            {/* ── Main content ── */}
            <main className={styles.main}>

                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1>{t('doctor.schedule')}</h1>
                        <p>Gérez vos rendez-vous et disponibilités</p>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.searchBox}>
                            <Search size={16} className={styles.searchIcon} />
                            <input type="text" placeholder="Rechercher un RDV..." className={styles.searchInput} />
                        </div>
                        <LanguageSwitcher />
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
