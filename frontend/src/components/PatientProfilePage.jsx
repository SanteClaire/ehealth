import { useState } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Search, Bell, Camera, Edit2, Check, Shield,
    User, Phone, Mail, MapPin, Heart, Clock,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { updateProfile } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientProfilePage.module.css'
import logo from '../assets/logo.png'

export default function PatientProfilePage({ user, onLogout, onNavigate }) {
    const { t } = useLanguage()
    const [isEditing, setIsEditing] = useState(false)

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard' },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents' },
        { icon: Clock, label: t('sidebar.appointments'), id: 'rdv' },
        { icon: Users, label: t('sidebar.family'), id: 'famille' },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia' },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings' },
    ]

    const userInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'P'
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Patient'

    // Informations personnelles
    const [firstName, setFirstName] = useState(user?.firstName || '')
    const [lastName, setLastName] = useState(user?.lastName || '')
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateNaissance ? new Date(user.dateNaissance).toLocaleDateString('fr-FR') : '')
    const [bloodType, setBloodType] = useState(user?.groupeSanguin || '')

    // Coordonnées
    const [email, setEmail] = useState(user?.email || '')
    const [phone, setPhone] = useState(user?.telephone || '')
    const [address, setAddress] = useState(user?.adresse || '')
    const [city, setCity] = useState('')

    // Contact d'urgence (pas en BDD — local)
    const [emergencyName, setEmergencyName] = useState('')
    const [emergencyRelation, setEmergencyRelation] = useState('')
    const [emergencyPhone, setEmergencyPhone] = useState('')

    // Médecin traitant (pas en BDD — local)
    const [doctorName, setDoctorName] = useState('')
    const [doctorCity, setDoctorCity] = useState('')
    const [doctorPhone, setDoctorPhone] = useState('')

    const handleSave = async () => {
        const result = await updateProfile({
            firstName, lastName,
            telephone: phone,
            adresse: address,
            groupeSanguin: bloodType,
        })
        if (result.success) {
            alert('Profil sauvegardé avec succès !')
        }
        setIsEditing(false)
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
                                    className={`${styles.navItem} ${item.id === 'profil' ? styles.navActive : ''}`}
                                    onClick={() => onNavigate && onNavigate(item.id)}
                                >
                                    <Icon size={17} className={styles.navIcon} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className={styles.userCard}>
                    <div className={styles.userAvatar}>{userInitials}</div>
                    <div className={styles.userName}>{userFullName}</div>
                    <div className={styles.userStatus}>Compte Passant</div>
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
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Mon Profil</h1>
                        <p className={styles.pageSubtitle}>
                            Gérez vos informations personnelles et médicales de base
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className={styles.profileHeader}>
                        <div className={styles.profilePhoto}>
                            <div className={styles.avatar}>{userInitials}</div>
                            <button className={styles.btnChangePhoto}>
                                <Camera size={14} /> Modifier la photo
                            </button>
                        </div>
                        <div className={styles.profileInfo}>
                            <h2 className={styles.profileName}>{firstName} {lastName}</h2>
                            <p className={styles.profileStatus}>Patient vérifié</p>
                            <span className={styles.dossierBadge}>
                                <Check size={14} /> {t('profile.dossierUpToDate')}
                            </span>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className={styles.actionBar}>
                        {!isEditing ? (
                            <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>
                                <Edit2 size={16} /> Modifier les informations
                            </button>
                        ) : (
                            <div className={styles.editButtons}>
                                <button className={styles.btnCancel} onClick={() => setIsEditing(false)}>
                                    Annuler
                                </button>
                                <button className={styles.btnSave} onClick={handleSave}>
                                    <Check size={16} /> Sauvegarder les modifications
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info Sections */}
                    <div className={styles.sectionsGrid}>
                        {/* Informations Personnelles */}
                        <section className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>
                                <User size={16} /> INFORMATIONS PERSONNELLES
                            </h3>
                            <div className={styles.fieldsGrid}>
                                <div className={styles.field}>
                                    <label>PRÉNOM</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>NOM</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>DATE DE NAISSANCE</label>
                                    <input
                                        type="text"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>GROUPE SANGUIN</label>
                                    <input
                                        type="text"
                                        value={bloodType}
                                        onChange={(e) => setBloodType(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Coordonnées */}
                        <section className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>
                                <MapPin size={16} /> COORDONNÉES
                            </h3>
                            <div className={styles.fieldsGrid}>
                                <div className={styles.field}>
                                    <label>EMAIL</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>TÉLÉPHONE</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label>ADRESSE POSTALE COMPLÈTE</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label></label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                        placeholder="Code Postal, Ville, Pays"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Contact d'Urgence */}
                        <section className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>
                                <Heart size={16} /> CONTACT D'URGENCE
                            </h3>
                            <div className={styles.fieldsGrid}>
                                <div className={styles.field}>
                                    <label>NOM DU CONTACT</label>
                                    <input
                                        type="text"
                                        value={emergencyName}
                                        onChange={(e) => setEmergencyName(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>RELATION</label>
                                    <input
                                        type="text"
                                        value={emergencyRelation}
                                        onChange={(e) => setEmergencyRelation(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label>TÉLÉPHONE D'URGENCE</label>
                                    <input
                                        type="tel"
                                        value={emergencyPhone}
                                        onChange={(e) => setEmergencyPhone(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Médecin Traitant */}
                        <section className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>
                                <Shield size={16} /> MÉDECIN TRAITANT
                            </h3>
                            <div className={styles.fieldsGrid}>
                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label>NOM DU PRATICIEN</label>
                                    <input
                                        type="text"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>VILLE</label>
                                    <input
                                        type="text"
                                        value={doctorCity}
                                        onChange={(e) => setDoctorCity(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>TÉLÉPHONE</label>
                                    <input
                                        type="tel"
                                        value={doctorPhone}
                                        onChange={(e) => setDoctorPhone(e.target.value)}
                                        disabled={!isEditing}
                                        className={isEditing ? styles.fieldEditing : ''}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* HDS Certified */}
                    <div className={styles.hdsCertified}>
                        <Shield size={16} /> DONNÉES CERTIFIÉES HDS
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p>© 2024 SantéClaire. Tous droits réservés. Vos données de santé sont protégées et hébergées sur des serveurs certifiés HDS.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
