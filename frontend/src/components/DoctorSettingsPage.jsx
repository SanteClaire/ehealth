import { useState } from 'react'
import {
    LayoutDashboard, Users, Calendar, MessageSquare, BarChart2,
    Settings, LogOut, CheckCircle2, Shield, Bell, CreditCard,
    Stethoscope, Clock, Lock
} from 'lucide-react'
import styles from './DoctorSettingsPage.module.css'
import logo from '../assets/logo2.png'

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard' },
    { icon: Users, label: 'Mes Patients', id: 'patients' },
    { icon: Calendar, label: 'Planning', id: 'planning' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: BarChart2, label: 'Rapports', id: 'reports' },
]

export default function DoctorSettingsPage({ onNavigate, onLogout }) {
    const [activeTab, setActiveTab] = useState('profile') // profile, security, notifications, billing

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
                    <button className={`${styles.navItem} ${styles.navActive}`} disabled>
                        <Settings size={18} /> Paramètres
                    </button>
                    <button className={styles.logoutBtn} onClick={onLogout}>
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className={styles.main}>

                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1>Paramètres du compte</h1>
                        <p>Gérez vos informations professionnelles et vos préférences</p>
                    </div>
                </header>

                <div className={styles.content}>

                    {/* Settings Navigation */}
                    <div className={styles.settingsNav}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <Stethoscope size={16} /> Profil Professionnel
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'security' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={16} /> Sécurité & Accès
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell size={16} /> Notifications
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'billing' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('billing')}
                        >
                            <CreditCard size={16} /> Facturation
                        </button>
                    </div>

                    {/* Active Tab Content */}
                    <div className={styles.tabContent}>

                        {activeTab === 'profile' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2>Informations Publiques</h2>
                                    <p>Ces informations seront visibles par vos patients lors de la prise de RDV.</p>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.avatarSection}>
                                        <div className={styles.avatarCircle}>DS</div>
                                        <div className={styles.avatarActions}>
                                            <button className={styles.btnPrimary}>Changer la photo</button>
                                            <button className={styles.btnText}>Supprimer</button>
                                        </div>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Titre</label>
                                            <select className={styles.input}>
                                                <option>Docteur</option>
                                                <option>Professeur</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Nom Complet</label>
                                            <input type="text" className={styles.input} defaultValue="Dupont" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Spécialité</label>
                                            <input type="text" className={styles.input} defaultValue="Cardiologue" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Numéro RPPS</label>
                                            <input type="text" className={styles.input} defaultValue="10001234567" disabled />
                                        </div>
                                        <div className={styles.formGroupFull}>
                                            <label>Adresse du cabinet</label>
                                            <textarea className={styles.inputArea} defaultValue="12 Rue de la Paix, 75002 Paris"></textarea>
                                        </div>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <button className={styles.btnPrimary}>Sauvegarder les modifications</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h2>Authentification à deux facteurs (2FA)</h2>
                                    <p>Sécurisez votre compte avec une étape de validation supplémentaire.</p>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.securityRow}>
                                        <div className={styles.securityInfo}>
                                            <div className={styles.securityIcon}><Lock size={20} color="#0EA5B0" /></div>
                                            <div>
                                                <h3>Application Authenticator</h3>
                                                <p>Utilisez Google Authenticator ou Authy pour générer des codes.</p>
                                            </div>
                                        </div>
                                        <button className={styles.btnSecondary}>Activer</button>
                                    </div>
                                </div>

                                <div className={`${styles.cardHeader} ${styles.borderTop}`}>
                                    <h2>Changer de mot de passe</h2>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.formGroupFull}>
                                        <label>Mot de passe actuel</label>
                                        <input type="password" className={styles.input} />
                                    </div>
                                    <div className={styles.formGroupFull}>
                                        <label>Nouveau mot de passe</label>
                                        <input type="password" className={styles.input} />
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <button className={styles.btnPrimary}>Mettre à jour le mot de passe</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other tabs placeholder */}
                        {(activeTab === 'notifications' || activeTab === 'billing') && (
                            <div className={styles.emptyState}>
                                <Clock size={40} color="#D1D5DB" />
                                <h3>Module en cours de développement</h3>
                                <p>Cette section sera disponible dans la prochaine version.</p>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}
