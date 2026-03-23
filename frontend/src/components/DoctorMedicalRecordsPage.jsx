import { useState, useEffect } from 'react'
import {
    Sparkles, Eye, MoreVertical, Download, Shield,
    Bell, ChevronDown, Calendar, Filter, X,
    FolderOpen, FileText, Image, FileSpreadsheet,
    List, LayoutGrid, Printer, Paperclip
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchMedecinPatientDetail } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorMedicalRecordsPage.module.css'

const documents_UNUSED = [
    {
        id: 1,
        name: 'Blood_Panel_Jan2024.pdf',
        sub: 'LAB RESULTS • 2.4 MB',
        cat: 'LABORATOIRE',
        catColor: '#3B82F6',
        date: 'Jan 12, 2024',
        relevance: 'HAUTE PERTINENCE',
        relevanceBars: 3,
        relevanceColor: '#F97316',
        icon: 'pdf',
        masked: false,
    },
    {
        id: 2,
        name: 'ECG_Scan_Dec05.jpg',
        sub: 'IMAGING • 5.1 MB',
        cat: 'IMAGERIE',
        catColor: '#8B5CF6',
        date: 'Dec 05, 2023',
        relevance: 'CRITIQUE',
        relevanceBars: 4,
        relevanceColor: '#EF4444',
        icon: 'img',
        masked: false,
    },
    {
        id: 3,
        name: 'Lisinopril_Prescription.pdf',
        sub: 'SCRIPT • 0.8 MB',
        cat: 'PHARMACIE',
        catColor: '#22C55E',
        date: 'Feb 01, 2024',
        relevance: 'ROUTINE',
        relevanceBars: 1,
        relevanceColor: '#9CA3AF',
        icon: 'rx',
        masked: false,
    },
    {
        id: 4,
        name: 'Surgery_Summary_2021.pdf',
        sub: 'NOTES • 1.1 MB',
        cat: 'CHIRURGIE',
        catColor: '#F59E0B',
        date: 'Oct 20, 2021',
        relevance: 'HISTORIQUE',
        relevanceBars: 2,
        relevanceColor: '#6B7280',
        icon: 'doc',
        masked: false,
    },
]

function DocIcon({ type }) {
    const map = {
        pdf: { bg: '#FEE2E2', color: '#EF4444', label: 'PDF' },
        img: { bg: '#EDE9FE', color: '#7C3AED', label: 'IMG' },
        rx: { bg: '#DCFCE7', color: '#15803D', label: 'RX' },
        doc: { bg: '#FEF3C7', color: '#B45309', label: 'DOC' },
    }
    const iconMap = map[type] || map.doc
    return (
        <div style={{ width: 38, height: 38, borderRadius: 8, background: iconMap.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: iconMap.color, letterSpacing: '0.04em' }}>{iconMap.label}</span>
        </div>
    )
}

function RelevanceBars({ n, color }) {
    return (
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                    width: 4,
                    height: 6 + i * 3,
                    borderRadius: 2,
                    background: i <= n ? color : '#E5E7EB',
                }} />
            ))}
        </div>
    )
}

export default function DoctorMedicalRecordsPage({ patientId, onBack, onLogout, onNavigate }) {
    const { t } = useLanguage()
    const [seconds, setSeconds] = useState(14 * 60 + 59)
    const [patient, setPatient] = useState(null)
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        if (!patientId) return
        fetchMedecinPatientDetail(patientId).then(r => {
            if (r.success) {
                setPatient(r.data)
                const catColors = { ANALYSE: '#3B82F6', RADIOGRAPHIE: '#8B5CF6', ORDONNANCE: '#F59E0B', COMPTE_RENDU: '#10B981', CERTIFICAT: '#6B7280', AUTRE: '#6B7280' }
                setDocuments(r.data.documents.map((d, i) => ({
                    id: d.id,
                    name: d.nomFichier,
                    sub: `${d.type} • ${(d.taille / 1024).toFixed(0)} Ko`,
                    cat: d.type,
                    catColor: catColors[d.type] || '#6B7280',
                    date: 'Récent',
                    preview: d.resumeIA || `Document: ${d.nomOriginal}`,
                    aiSummary: d.resumeIA || null,
                })))
            }
        })
    }, [patientId])

    const [selected, setSelected] = useState(null)
    useEffect(() => { if (documents.length > 0 && !selected) setSelected(documents[0]) }, [documents])
    const [view, setView] = useState('list')
    const [activeFilter, setActiveFilter] = useState(true)

    useEffect(() => {
        if (seconds <= 0) return
        const t = setInterval(() => setSeconds(s => s - 1), 1000)
        return () => clearInterval(t)
    }, [seconds])

    const fmt = (s) => ({
        m: String(Math.floor(s / 60)).padStart(2, '0'),
        s: String(s % 60).padStart(2, '0'),
    })
    const time = fmt(seconds)

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="patients" onNavigate={onNavigate} onLogout={onLogout} />
            <div className={styles.page}>

            {/* ── Top bar ── */}
            <header className={styles.navbar}>
                <div className={styles.navLeft}>
                    <div className={styles.searchBox}>
                        <Filter size={13} className={styles.searchIcon} />
                        <input className={styles.searchInput} placeholder="Search records..." />
                    </div>
                </div>
                <div className={styles.navRight}>
                    <LanguageSwitcher />
                    <button type="button" className={styles.bellBtn}>
                        <Bell size={18} />
                        <span className={styles.bellDot} />
                    </button>
                    <button
                        type="button"
                        className={styles.doctorBlock}
                        onClick={() => onNavigate && onNavigate('profil')}
                        aria-label={t('doctor.navMyProfile')}
                    >
                        <div>
                            <div className={styles.doctorName}>Dr. Sarah Smith</div>
                            <div className={styles.doctorRole}>Cardiologist</div>
                        </div>
                        <div className={styles.doctorAvatar}>SS</div>
                    </button>
                </div>
            </header>

            {/* ── Patient bar ── */}
            <div className={styles.patientBar}>
                <div className={styles.patientLeft}>
                    <div className={styles.patientAvatar}>JD</div>
                    <div>
                        <div className={styles.patientNameRow}>
                            <span className={styles.patientName}>Jean Dupont</span>
                            <span className={styles.stableBadge}>STABLE</span>
                        </div>
                        <div className={styles.patientMeta}>65 years old • Male • ID: #JD-9928 • O Positive</div>
                    </div>
                </div>
                <div className={styles.patientRight}>
                    <div className={styles.accessBox}>
                        <div>
                            <div className={styles.accessLabel}>STATUT D'ACCÈS</div>
                            <div className={styles.accessValue}>
                                <span className={styles.accessDot} /> Consultation active
                            </div>
                        </div>
                        <div className={styles.timerBox}>
                            <div className={styles.timerLabel}>RESTANT</div>
                            <div className={styles.timerValue}>
                                <span>{time.m}</span>
                                <span className={styles.timerColon}>:</span>
                                <span>{time.s}</span>
                            </div>
                        </div>
                    </div>
                    <button className={styles.btnExport}><Download size={14} /> Exporter</button>
                    <button className={styles.btnReport}><FileText size={14} /> Compte rendu</button>
                </div>
            </div>

            {/* ── 3-column grid ── */}
            <div className={styles.grid}>

                {/* ── Left: AI summary ── */}
                <aside className={styles.sideLeft}>
                    <div className={styles.aiPanel}>
                        <div className={styles.aiPanelHeader}>
                            <Sparkles size={15} className={styles.aiStar} />
                            <span className={styles.aiPanelTitle}>RÉSUMÉ IA DES ANTÉCÉDENTS</span>
                        </div>
                        <div className={styles.aiCard}>
                            <div className={styles.aiCardLabel}>
                                <Sparkles size={13} className={styles.aiStar} /> ANALYSE IA
                            </div>
                            <p className={styles.aiCardText}>
                                Patient suivi depuis 10 ans pour diabète de type 2 et hypertension. Dernière intervention : pose stent coronaire 2021. Palpitations intermittentes récentes.
                            </p>
                            <button className={styles.aiCardBtn}>Générer résumé complet →</button>
                        </div>
                        <button className={styles.historyBtn} onClick={onBack}>Voir l'historique complet</button>
                    </div>
                </aside>

                {/* ── Center: Document list ── */}
                <div className={styles.docPanel}>

                    {/* Header */}
                    <div className={styles.docPanelHeader}>
                        <div className={styles.docPanelTitle}>
                            <FolderOpen size={16} />
                            Dossier médical
                            <span className={styles.docCount}>(12 Documents)</span>
                        </div>
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
                                onClick={() => setView('list')}
                            ><List size={15} /></button>
                            <button
                                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
                                onClick={() => setView('grid')}
                            ><LayoutGrid size={15} /></button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filterRow}>
                        {activeFilter && (
                            <button className={styles.filterTag}>
                                <Sparkles size={11} /> Pertinent pour les symptômes
                                <X size={11} onClick={() => setActiveFilter(false)} />
                            </button>
                        )}
                        <button className={styles.filterDropdown}>Type de document <ChevronDown size={12} /></button>
                        <button className={styles.filterDropdown}><Calendar size={12} /> Période</button>
                        <button className={styles.filterDropdown}>Service <ChevronDown size={12} /></button>
                        <button className={styles.clearFilters}>Effacer les filtres</button>
                    </div>

                    {/* RGPD warning */}
                    <div className={styles.rgpdBanner}>
                        🔒 2 documents masqués par le patient conformément au RGPD — non accessibles
                    </div>

                    {/* Table */}
                    <div className={styles.tableWrap}>
                        <div className={styles.tableHead}>
                            <span style={{ flex: 2.5 }}>DOCUMENT</span>
                            <span style={{ flex: 1 }}>CATÉGORIE</span>
                            <span style={{ flex: 1 }}>DATE D'AJOUT</span>
                            <span style={{ flex: 1.2 }}>PERTINENCE IA</span>
                            <span style={{ flex: 0.5 }}>ACTIONS</span>
                        </div>

                        {/* Masked row */}
                        <div className={`${styles.tableRow} ${styles.maskedRow}`}>
                            <div className={styles.docCell}>
                                <Shield size={16} color="#9CA3AF" />
                                <div>
                                    <div className={styles.docName} style={{ filter: 'blur(5px)' }}>document_confidentiel.pdf</div>
                                    <div className={styles.docSub}>INCONNU • — MB</div>
                                </div>
                            </div>
                            <span className={styles.catBadge} style={{ background: '#F3F4F6', color: '#9CA3AF' }}>MASQUÉ</span>
                            <span className={styles.docDate} style={{ filter: 'blur(4px)' }}>-- --, --</span>
                            <span className={styles.indispoLabel}>⊘ INDISPONIBLE</span>
                            <Shield size={15} color="#D1D5DB" />
                        </div>

                        {documents.map(doc => (
                            <div
                                key={doc.id}
                                className={`${styles.tableRow} ${selected?.id === doc.id ? styles.tableRowActive : ''}`}
                                onClick={() => setSelected(doc)}
                            >
                                <div className={styles.docCell}>
                                    <DocIcon type={doc.icon} />
                                    <div>
                                        <div className={styles.docName}>{doc.name}</div>
                                        <div className={styles.docSub}>{doc.sub}</div>
                                    </div>
                                </div>
                                <span
                                    className={styles.catBadge}
                                    style={{ background: doc.catColor + '18', color: doc.catColor }}
                                >
                                    {doc.cat}
                                </span>
                                <span className={styles.docDate}>{doc.date}</span>
                                <div className={styles.relevanceCell}>
                                    <RelevanceBars n={doc.relevanceBars} color={doc.relevanceColor} />
                                    <span style={{ color: doc.relevanceColor, fontSize: '0.7rem', fontWeight: 700 }}>
                                        {doc.relevance}
                                    </span>
                                </div>
                                <div className={styles.actionCell}>
                                    <button className={styles.actionBtn}><Eye size={15} /></button>
                                    <button className={styles.actionBtn}><MoreVertical size={15} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: Document preview ── */}
                <aside className={styles.previewPanel}>
                    <div className={styles.previewHeader}>
                        <Eye size={14} />
                        <span className={styles.previewTitle}>Aperçu du document</span>
                    </div>

                    {selected && (
                        <>
                            {/* Placeholder preview */}
                            <div className={styles.previewImg}>
                                <div className={styles.previewPlaceholder}>
                                    <Image size={40} color="#D1D5DB" />
                                </div>
                            </div>

                            <div className={styles.previewName}>{selected.name}</div>

                            <div className={styles.extractCard}>
                                <div className={styles.extractHeader}>
                                    <Sparkles size={13} className={styles.aiStar} />
                                    <span className={styles.extractLabel}>EXTRAIT IA</span>
                                </div>
                                <p className={styles.extractText}>
                                    "Shows significant ST-segment changes in leads. Consistent with patient history. Highly relevant to current consultation."
                                </p>
                            </div>

                            <button className={styles.btnPrint}><Printer size={14} /> Imprimer</button>
                            <button className={styles.btnAttach}><Paperclip size={14} /> Joindre au compte rendu</button>
                        </>
                    )}
                </aside>
            </div>

            {/* ── Bottom bar ── */}
            <div className={styles.bottomBar}>
                <div className={styles.bottomLeft}>
                    <span className={styles.bottomBadge}><Shield size={12} /> Session chiffrée de bout en bout</span>
                    <span className={styles.bottomBadge}><Shield size={12} /> Accès conforme HDS</span>
                </div>
                <div className={styles.bottomRight}>
                    <span className={styles.bottomMeta}>Session ID: f92-882-xa1</span>
                    <span className={styles.bottomMeta}>v2.4.1-stable</span>
                </div>
            </div>

            </div>
        </div>
    )
}
