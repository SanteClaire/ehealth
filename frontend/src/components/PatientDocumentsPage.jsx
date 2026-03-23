import { useState, useEffect, useRef } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Search, Bell, Upload, ChevronRight, Info, AlertCircle,
    FileCheck, Lock, Trash2, Download, MoreVertical, Plus, Cloud,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchPatientDocuments, uploadPatientDocument } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientDocumentsPage.module.css'
import logo from '../assets/logo.png'


function formatSize(bytes) {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} Ko`
    return `${(bytes / 1048576).toFixed(1)} Mo`
}

function mapTypeToCategory(type) {
    const map = { ANALYSE: 'LABORATOIRE', RADIOGRAPHIE: 'IMAGERIE', ORDONNANCE: 'ORDONNANCES', COMPTE_RENDU: 'COMPTES-RENDUS', CERTIFICAT: 'CERTIFICAT', AUTRE: 'AUTRE' }
    return map[type] || type
}

function guessCategoryFromName() { return 'AUTRE' }

const documentCategories = [
    { labelKey: 'documents.all', count: null },
    { labelKey: 'documents.prescriptions', count: null },
    { labelKey: 'documents.analyses', count: null },
    { labelKey: 'documents.imaging', count: null },
    { labelKey: 'documents.reports', count: null },
    { labelKey: 'documents.forAppointment', count: 5 },
]

export default function PatientDocumentsPage({ user, onLogout, onNavigate, onBack }) {
    const { t, language } = useLanguage()
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Patient'
    const userInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'P'
    const [activeTab, setActiveTab] = useState('documents.all')
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        fetchPatientDocuments().then(r => {
            if (r.success) {
                setDocuments(r.data.map(d => ({
                    id: d.id,
                    name: d.nomOriginal,
                    size: formatSize(d.taille),
                    category: mapTypeToCategory(d.type),
                    categoryIcon: 'doc',
                    date: d.id ? 'Récent' : '',
                    statusType: d.estPartage ? 'shared' : 'private',
                    doctor: d.createurMedecin ? `Dr. ${d.createurMedecin.lastName}` : '',
                    consultation: d.resumeIA || '',
                })))
            }
        })
    }, [])
    const [openMenuId, setOpenMenuId] = useState(null)
    const fileInputRef = useRef(null)
    const [uploadCountNotice, setUploadCountNotice] = useState(null)

    const addFilesToList = async (fileList) => {
        if (!fileList?.length) return
        const files = [...fileList]
        let uploadedCount = 0

        for (const file of files) {
            const ext = file.name.toLowerCase().split('.').pop()
            const typeMap = { pdf: 'AUTRE', jpg: 'RADIOGRAPHIE', jpeg: 'RADIOGRAPHIE', png: 'RADIOGRAPHIE' }
            const type = typeMap[ext] || 'AUTRE'

            const result = await uploadPatientDocument(file, type, true)
            if (result.success) {
                uploadedCount++
                setDocuments(prev => [{
                    id: result.data.id,
                    name: result.data.nomOriginal,
                    size: formatSize(result.data.taille),
                    category: mapTypeToCategory(result.data.type),
                    categoryIcon: 'doc',
                    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                    statusType: 'shared',
                    doctor: '',
                    consultation: '',
                }, ...prev])
            }
        }

        if (uploadedCount > 0) {
            setUploadCountNotice(uploadedCount)
            window.setTimeout(() => setUploadCountNotice(null), 5000)
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleFileInputChange = (e) => {
        addFilesToList(e.target.files)
    }

    useEffect(() => {
        if (openMenuId == null) return undefined
        const close = () => setOpenMenuId(null)
        const timeoutId = setTimeout(() => {
            window.addEventListener('click', close)
        }, 0)
        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('click', close)
        }
    }, [openMenuId])

    const setDocumentPrivacy = (id, statusType) => {
        setDocuments((prev) =>
            prev.map((d) => (d.id === id ? { ...d, statusType } : d)),
        )
        setOpenMenuId(null)
    }

    const handleDownload = (doc) => {
        // Démo : on génère un petit fichier texte pour que le bouton "Télécharger" fonctionne.
        const content =
            `Document: ${doc.name}\n` +
            `Catégorie: ${doc.category}\n` +
            `Statut: ${doc.statusType}\n` +
            `Date: ${doc.date}\n`

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${doc.name.replace(/[\/\\?%*:|"<>]/g, '-').trim() || 'document'}.txt`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const handleDelete = (docId) => {
        if (!window.confirm(t('documents.confirmDelete'))) return
        setDocuments((prev) => prev.filter((d) => d.id !== docId))
        setOpenMenuId(null)
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard' },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents', active: true },
        { icon: Users, label: t('sidebar.family'), id: 'famille' },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia' },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings' },
    ]

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

                    {/* Storage */}
                    <div className={styles.storageCard}>
                        <div className={styles.storageHeader}>
                            <span className={styles.storageLabel}>{t('documents.storageUsed')}</span>
                            <span className={styles.storageValue}>1.2 / 5.0Go</span>
                        </div>
                        <div className={styles.storageBar}>
                            <div
                                className={styles.storageFill}
                                style={{ width: '24%' }}
                            />
                        </div>
                        <p className={styles.storageText}>
                            <Lock size={12} /> {t('documents.secureStorage')}
                        </p>
                    </div>
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
                            placeholder={t('documents.searchPlaceholder')}
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
                    <input
                        ref={fileInputRef}
                        type="file"
                        className={styles.visuallyHidden}
                        accept=".pdf,.jpg,.jpeg,.png,.heic,application/pdf,image/*"
                        multiple
                        aria-hidden
                        tabIndex={-1}
                        onChange={handleFileInputChange}
                    />
                    {/* Header */}
                    <div className={styles.header}>
                        <div>
                            <h1 className={styles.title}>{t('documents.myDocuments')}</h1>
                            <p className={styles.subtitle}>
                                {t('documents.manageDesc')}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={styles.btnAdd}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Plus size={16} /> {t('dashboard.addDocument')}
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        {documentCategories.map((cat) => (
                            <button
                                key={cat.labelKey}
                                className={`${styles.tab} ${activeTab === cat.labelKey ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(cat.labelKey)}
                            >
                                {t(cat.labelKey)}
                                {cat.count !== null && <span className={styles.tabCount}>{cat.count}</span>}
                            </button>
                        ))}
                    </div>

                    {uploadCountNotice != null && (
                        <div className={styles.uploadSuccessBanner} role="status">
                            <FileCheck size={18} />
                            <span>{t('documents.uploadAdded', { count: uploadCountNotice })}</span>
                        </div>
                    )}

                    {/* Upload zone */}
                    <div
                        className={styles.uploadZone}
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                fileInputRef.current?.click()
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addFilesToList(e.dataTransfer.files)
                        }}
                    >
                        <Cloud size={40} className={styles.uploadIconLarge} />
                        <h3 className={styles.uploadTitle}>{t('documents.dropTitle')}</h3>
                        <p className={styles.uploadText}>
                            {t('documents.dropDesc')}
                        </p>
                    </div>

                    {/* Documents section */}
                    <div className={styles.documentsSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                {t('documents.visibleBy')}
                            </h2>
                            <button
                                type="button"
                                className={styles.btnModify}
                                onClick={() => onNavigate && onNavigate('settings')}
                            >
                                {t('documents.modifySelection')} <ChevronRight size={14} />
                            </button>
                        </div>

                        {/* Info banner */}
                        <div className={styles.infoBanner} id="rgpd-info">
                            <Info size={16} />
                            <div>
                                <strong>Vos documents sont partagés par défaut avec votre médecin lors d'un rendez-vous.</strong>
                                <br />
                                <a href="mailto:support@santeclaire.fr?subject=RGPD%20%2F%20donn%C3%A9es%20personnelles" className={styles.link}>En savoir plus sur le RGPD →</a>
                            </div>
                        </div>

                        {/* Alert */}
                        <div className={styles.alertBanner}>
                            <AlertCircle size={16} />
                            <strong>{t('documents.accessExpires')}</strong>
                        </div>

                        {/* Documents table */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t('documents.document')}</th>
                                        <th>{t('documents.category')}</th>
                                        <th>{t('documents.dateAdded')}</th>
                                        <th>{t('documents.status')}</th>
                                        <th>{t('documents.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className={styles.docCell}>
                                                <div className={styles.docIcon}>
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <div className={styles.docName}>{doc.name}</div>
                                                    <div className={styles.docSize}>PDF • {doc.size}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.categoryBadge}>{doc.category}</span>
                                            </td>
                                            <td>{doc.date}</td>
                                            <td>
                                                <div className={styles.statusCell}>
                                                    {doc.statusType === 'shared' && (
                                                        <>
                                                            <FileCheck size={16} className={styles.sharedIcon} />
                                                            <span className={styles.sharedStatus}>{t('documents.shared')}</span>
                                                        </>
                                                    )}
                                                    {doc.statusType === 'private' && (
                                                        <>
                                                            <Lock size={16} className={styles.privateIcon} />
                                                            <span className={styles.privateStatus}>{t('documents.private')}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button
                                                        type="button"
                                                        className={styles.actionBtn}
                                                        title={t('documents.download')}
                                                        onClick={() => handleDownload(doc)}
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={styles.actionBtn}
                                                        title={t('documents.delete')}
                                                        onClick={() => handleDelete(doc.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className={styles.actionMenuWrap}>
                                                        <button
                                                            type="button"
                                                            className={styles.actionBtn}
                                                            title={t('documents.menuMore')}
                                                            aria-expanded={openMenuId === doc.id}
                                                            aria-haspopup="menu"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setOpenMenuId((prev) => (prev === doc.id ? null : doc.id))
                                                            }}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                        {openMenuId === doc.id && (
                                                            <div
                                                                className={styles.dropdownMenu}
                                                                role="menu"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    role="menuitem"
                                                                    className={`${styles.dropdownItem} ${doc.statusType === 'private' ? styles.dropdownItemActive : ''}`}
                                                                    disabled={doc.statusType === 'private'}
                                                                    onClick={() => setDocumentPrivacy(doc.id, 'private')}
                                                                >
                                                                    {t('documents.menuMakePrivate')}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    role="menuitem"
                                                                    className={`${styles.dropdownItem} ${doc.statusType === 'shared' ? styles.dropdownItemActive : ''}`}
                                                                    disabled={doc.statusType === 'shared'}
                                                                    onClick={() => setDocumentPrivacy(doc.id, 'shared')}
                                                                >
                                                                    {t('documents.menuMakePublic')}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
