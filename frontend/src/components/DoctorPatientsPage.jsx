import { useState } from 'react'
import {
    LayoutDashboard, Users, Calendar, MessageSquare, BarChart2,
    Settings, LogOut, Search, Plus, FileText, ChevronLeft, ChevronRight,
    Filter, Play
} from 'lucide-react'
import styles from './DoctorPatientsPage.module.css'
import logo from '../assets/logo2.png'

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard' },
    { icon: Users, label: 'Mes Patients', id: 'patients', active: true },
    { icon: Calendar, label: 'Planning', id: 'planning' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: BarChart2, label: 'Rapports', id: 'reports' },
]

const patients = [
    {
        id: 1,
        name: 'Jean Dupont',
        age: 65,
        status: 'active',
        statusLabel: 'CONSULTATION ACTIVE',
        lastConsult: '12 oct. 2023',
        reason: 'Suivi Hypertension',
        docs: 12,
        avatar: 'JD',
        avatarColor: '#7C3AED',
    },
    {
        id: 2,
        name: 'Alice Martin',
        age: 42,
        status: 'pending',
        statusLabel: 'DOCUMENTS EN ATTENTE',
        lastConsult: '28 sept. 2023',
        reason: 'Check-up annuel',
        docs: 5,
        avatar: 'AM',
        avatarColor: '#0EA5B0',
    },
    {
        id: 3,
        name: 'Robert Chen',
        age: 71,
        status: 'inactive',
        statusLabel: 'PAS DE VISITE RÉCENTE',
        lastConsult: '05 août 2023',
        reason: 'Visite spécialiste',
        docs: 8,
        avatar: 'RC',
        avatarColor: '#6B7280',
    },
]

const filters = [
    { id: 'all', label: 'Tous', dot: null },
    { id: 'active', label: 'Consultation active', dot: 'green' },
    { id: 'pending', label: 'Documents en attente', dot: 'orange' },
    { id: 'inactive', label: 'Pas de visite récente', dot: 'gray' },
]

export default function DoctorPatientsPage({ onBack, onLogout, onPatientFile, onNavigate }) {
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [page, setPage] = useState(1)
    const totalPages = 3

    const filtered = patients.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchFilter = activeFilter === 'all' || p.status === activeFilter
        return matchSearch && matchFilter
    })

    return (
        <div className={styles.layout}>

            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brand}>
                        <img src={logo} alt="SantéClaire" className={styles.logo} />
                        <span className={styles.brandSub}>Interface Docteur</span>
                    </div>

                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate && item.id ? onNavigate(item.id) : null}
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
                        <Settings size={18} /> Paramètres
                    </button>
                    <button className={styles.logoutBtn} onClick={onLogout}>
                        <LogOut size={16} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Header ── */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Mes Patients</h1>
                        <p className={styles.pageCount}>28 patients suivis sur la plateforme</p>
                    </div>
                    <button className={styles.btnAdd}>
                        <Plus size={16} /> Ajouter un patient
                    </button>
                </div>

                {/* ── Filters ── */}
                <div className={styles.filterBar}>
                    <div className={styles.searchWrap}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Rechercher un patient par..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <button className={`${styles.filterBtn} ${styles.filterAll}`}>
                            Tous <ChevronRight size={13} style={{ transform: 'rotate(90deg)' }} />
                        </button>
                        {filters.slice(1).map((f) => (
                            <button
                                key={f.id}
                                className={`${styles.filterTag} ${activeFilter === f.id ? styles.filterTagActive : ''}`}
                                onClick={() => setActiveFilter(activeFilter === f.id ? 'all' : f.id)}
                            >
                                <span className={`${styles.dot} ${styles[`dot_${f.id}`]}`} />
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Patient list ── */}
                <div className={styles.patientList}>
                    {filtered.map((p) => (
                        <div key={p.id} className={styles.patientCard}>
                            <div className={styles.patientLeft}>
                                <div className={styles.avatar} style={{ background: p.avatarColor }}>
                                    {p.avatar}
                                </div>
                                <div className={styles.patientInfo}>
                                    <div className={styles.patientName}>
                                        {p.name} <span className={styles.patientAge}>• {p.age} ans</span>
                                    </div>
                                    <div className={`${styles.statusBadge} ${styles[`status_${p.status}`]}`}>
                                        <span className={`${styles.dot} ${styles[`dot_${p.status}`]}`} />
                                        {p.statusLabel}
                                    </div>
                                    <div className={styles.lastConsult}>
                                        Dernière consultation: {p.lastConsult} • {p.reason}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.patientRight}>
                                <div className={styles.docsCount}>
                                    <FileText size={14} />
                                    <span className={styles.docsLink}>{p.docs} documents partagés</span>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.btnDossier} onClick={() => onPatientFile && onPatientFile()}>Voir le dossier</button>
                                    {p.status === 'active' && (
                                        <button className={styles.btnConsult} onClick={() => onPatientFile && onPatientFile()}>
                                            <Play size={13} /> Démarrer consultation
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Pagination ── */}
                <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>Affichage 1-10 sur 28 patients</span>
                    <div className={styles.pages}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={15} />
                        </button>
                        {[1, 2, 3].map(n => (
                            <button
                                key={n}
                                className={`${styles.pageBtn} ${page === n ? styles.pageBtnActive : ''}`}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
