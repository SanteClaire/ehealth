import { useState, useEffect } from 'react'
import {
    LogOut, Play, FilePlus, FileText, Mic, PenLine,
    CheckCircle2, Circle, AlertCircle, Download, ExternalLink,
    Lock, ChevronRight, Settings, User,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { fetchMedecinPatientDetail, createOrdonnance, downloadCompteRenduPdf, savePatientNote } from '../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './DoctorPatientFilePage.module.css'
import logo from '../assets/logo.png'
import SendReportModal from './SendReportModal'
import DoctorSidebar from './DoctorSidebar'

function getAge(dateNaissance) {
    if (!dateNaissance) return null
    const b = new Date(dateNaissance)
    const now = new Date()
    let age = now.getFullYear() - b.getFullYear()
    if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--
    return age
}

export default function DoctorPatientFilePage({ patientId, onBack, onPatients, onLogout, onConsult, onMedicalRecords, onPatientOverview, onNavigate }) {
    const { t } = useLanguage()
    const [seconds, setSeconds] = useState(34 * 60 + 12)
    const [showModal, setShowModal] = useState(false)
    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showOrdonnanceForm, setShowOrdonnanceForm] = useState(false)
    const [ordForm, setOrdForm] = useState({ dateExpiration: '', instructions: '' })
    const [showNoteForm, setShowNoteForm] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [noteSaving, setNoteSaving] = useState(false)

    useEffect(() => {
        if (!patientId) { setLoading(false); return }
        fetchMedecinPatientDetail(patientId).then(r => {
            if (r.success) setPatient(r.data)
            setLoading(false)
        })
    }, [patientId])

    useEffect(() => {
        if (seconds <= 0) return
        const timer = setInterval(() => setSeconds(s => s - 1), 1000)
        return () => clearInterval(timer)
    }, [seconds])

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Chargement du dossier patient...</div>
    if (!patient) return <div style={{ padding: 40, textAlign: 'center' }}>Aucun patient sélectionné. <button onClick={onBack}>Retour</button></div>

    const initials = `${(patient.firstName?.[0] || '')}${(patient.lastName?.[0] || '')}`.toUpperCase()
    const age = getAge(patient.dateNaissance)

    // Build history from consultations
    const history = (patient.consultations || []).map(c => ({
        type: c.estActive ? 'urgency' : 'consult',
        color: c.estActive ? '#EF4444' : '#3B82F6',
        title: c.estActive ? 'Consultation en cours' : 'Consultation terminée',
        date: new Date(c.dateDebut).toLocaleDateString('fr-FR'),
        desc: c.dateFin ? `Durée: ${Math.round((new Date(c.dateFin) - new Date(c.dateDebut)) / 60000)} min` : 'En cours',
    }))

    // Build shared docs from patient documents
    const sharedDocs = (patient.documents || []).map(d => ({
        name: d.nomOriginal,
        meta: `${d.type} — ${d.mimeType}`,
        status: d.estPartage ? 'shared' : 'hidden',
    }))

    // Recent docs
    const recentDocs = (patient.documents || []).slice(0, 3).map(d => ({
        icon: d.type === 'ANALYSE' ? '🔬' : d.type === 'RADIOGRAPHIE' ? '🦴' : '📄',
        name: d.nomOriginal,
        meta: `${d.type} • ${d.mimeType}`,
        action: 'download',
    }))

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="patients" onNavigate={onNavigate} onLogout={onLogout} />

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Patient header ── */}
                <div className={styles.patientHeader}>
                    <div className={styles.patientLeft}>
                        <div className={styles.avatarWrap}>
                            <div className={styles.avatar}>{initials}</div>
                            <span className={styles.onlineDot} />
                        </div>

                        <div className={styles.patientMeta}>
                            <div className={styles.nameRow}>
                                <h1 className={styles.patientName}>{patient.firstName} {patient.lastName}</h1>
                                <span className={styles.statusPill}>DOSSIER PATIENT</span>
                            </div>
                            <div className={styles.detailRow}>
                                {age && <span>{age} ans</span>}
                                {patient.groupeSanguin && <><span className={styles.dot}>•</span><span className={styles.bloodType}>Groupe : <strong>{patient.groupeSanguin}</strong></span></>}
                            </div>
                            <div className={styles.detailRow}>
                                {patient.telephone && <span>📞 {patient.telephone}</span>}
                                {patient.adresse && <><span className={styles.divider}>|</span><span>📍 {patient.adresse}</span></>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.patientActions}>
                        <LanguageSwitcher />
                        <button className={styles.btnPrimary} onClick={() => onConsult && onConsult()}>
                            <Play size={14} /> Démarrer la consultation
                        </button>
                        <button className={styles.btnSecondary} onClick={() => onMedicalRecords && onMedicalRecords()}>
                            <FileText size={14} /> Voir les documents
                        </button>
                        <button className={styles.btnSecondary} onClick={() => setShowOrdonnanceForm(!showOrdonnanceForm)}>
                            <FilePlus size={14} /> Créer ordonnance
                        </button>
                    </div>
                </div>

                {showOrdonnanceForm && (
                    <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, margin: '0 24px 16px' }}>
                        <h3 style={{ marginBottom: 12, fontSize: '1rem', color: '#0F2445' }}>Nouvelle ordonnance pour {patient.firstName} {patient.lastName}</h3>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: 4 }}>Date d'expiration</label>
                                <input type="date" value={ordForm.dateExpiration} onChange={e => setOrdForm(p => ({ ...p, dateExpiration: e.target.value }))}
                                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #D1D5DB' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 250 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: 4 }}>Instructions</label>
                                <input type="text" value={ordForm.instructions} onChange={e => setOrdForm(p => ({ ...p, instructions: e.target.value }))}
                                    placeholder="Ex: Prendre pendant les repas..."
                                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #D1D5DB', width: '100%' }} />
                            </div>
                            <button onClick={async () => {
                                if (!ordForm.dateExpiration) return
                                const result = await createOrdonnance(patient.id, ordForm.dateExpiration, ordForm.instructions)
                                if (result.success) {
                                    alert(`Ordonnance ${result.data.numero} créée avec succès !`)
                                    setShowOrdonnanceForm(false)
                                    setOrdForm({ dateExpiration: '', instructions: '' })
                                    // Reload patient data
                                    fetchMedecinPatientDetail(patientId).then(r => { if (r.success) setPatient(r.data) })
                                }
                            }}
                                style={{ padding: '8px 20px', background: '#0EA5B0', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                                Créer l'ordonnance
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Access banner ── */}
                <div className={styles.accessBanner}>
                    <div className={styles.bannerLeft}>
                        <Lock size={15} className={styles.bannerLock} />
                        <div>
                            <div className={styles.bannerTitle}>Accès temporaire accordé par le patient</div>
                            <div className={styles.bannerSub}>L'accès expirera automatiquement à la fin de la consultation.</div>
                        </div>
                    </div>
                    <div className={styles.bannerRight}>
                        <span className={styles.timer}>{fmt(seconds)} restant</span>
                        <button className={styles.btnProlong}>Prolonger</button>
                        <button className={styles.btnEnd}>Terminer</button>
                    </div>
                </div>

                {/* ── Content grid ── */}
                <div className={styles.contentGrid}>

                    {/* ── Left column ── */}
                    <div className={styles.leftCol}>

                        {/* AI Summary */}
                        <div className={styles.aiCard}>
                            <div className={styles.aiHeader}>
                                <span className={styles.aiTitle}>RÉSUMÉ CLINIQUE</span>
                                <button className={styles.aiSettings}><Settings size={15} /></button>
                            </div>
                            <div className={styles.aiGrid}>
                                <div className={styles.aiBlock}>
                                    <div className={styles.aiBlockLabel}>ANTÉCÉDENTS</div>
                                    <div className={styles.aiBlockText}>
                                        {patient.antecedents || 'Aucun antécédent renseigné'}
                                    </div>
                                </div>
                                {patient.allergies && (
                                    <div className={`${styles.aiBlock} ${styles.aiBlockCritical}`}>
                                        <div className={styles.aiBlockLabelRed}>ALLERGIES</div>
                                        <div className={styles.aiBlockTextRed}>
                                            {patient.allergies}
                                        </div>
                                    </div>
                                )}
                                {patient.documents?.some(d => d.resumeIA) && (
                                    <div className={styles.aiBlock}>
                                        <div className={styles.aiBlockLabel}>RÉSUMÉ IA DOCUMENTS</div>
                                        <div className={styles.aiBlockText}>
                                            {patient.documents.filter(d => d.resumeIA).map(d => d.resumeIA).join(' | ')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Historique */}
                        <div className={styles.historySection}>
                            <h2 className={styles.sectionTitle}>Historique médical</h2>
                            {history.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Aucune consultation enregistrée.</p>}
                            {history.map((h, i) => (
                                <div key={i} className={styles.historyItem}>
                                    <div className={styles.historyIcon} style={{ background: h.color }}>
                                        {h.type === 'consult' && <User size={14} color="#fff" />}
                                        {h.type === 'urgency' && <AlertCircle size={14} color="#fff" />}
                                    </div>
                                    <div className={styles.historyContent}>
                                        <div className={styles.historyTop}>
                                            <strong className={styles.historyTitle}>{h.title}</strong>
                                            <span className={styles.historyDate}>{h.date}</span>
                                        </div>
                                        <p className={styles.historyDesc}>{h.desc}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Ordonnances */}
                            {patient.ordonnances?.length > 0 && (
                                <>
                                    <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Ordonnances</h2>
                                    {patient.ordonnances.map((o, i) => (
                                        <div key={i} className={styles.historyItem}>
                                            <div className={styles.historyIcon} style={{ background: '#8B5CF6' }}>
                                                <PenLine size={14} color="#fff" />
                                            </div>
                                            <div className={styles.historyContent}>
                                                <div className={styles.historyTop}>
                                                    <strong className={styles.historyTitle}>{o.numero}</strong>
                                                    <span className={styles.historyDate}>{o.dateEmission}</span>
                                                </div>
                                                <p className={styles.historyDesc}>
                                                    {o.instructions}
                                                    {o.lignes?.map((l, j) => (
                                                        <span key={j}><br/>— {l.medicament} {l.dosage} : {l.posologie} ({l.duree})</span>
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className={styles.rightCol}>

                        {/* Documents partagés */}
                        <div className={styles.sideCard}>
                            <div className={styles.sideCardHeader}>
                                <h3 className={styles.sideCardTitle}>Documents partagés</h3>
                                <Lock size={13} color="#9CA3AF" />
                            </div>
                            <p className={styles.sideCardSub}>Le patient contrôle les documents visibles</p>
                            {sharedDocs.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Aucun document.</p>}
                            {sharedDocs.map((d, i) => (
                                <div key={i} className={styles.sharedDocRow}>
                                    {d.status === 'shared' ? (
                                        <CheckCircle2 size={15} color="#22C55E" />
                                    ) : (
                                        <Circle size={15} color="#D1D5DB" />
                                    )}
                                    <div className={styles.sharedDocInfo}>
                                        <span className={styles.sharedDocName}>{d.name}</span>
                                        <span className={styles.sharedDocMeta}>{d.meta}</span>
                                    </div>
                                    {d.status === 'shared' && (
                                        <span className={styles.sharedBadge}>PARTAGÉ</span>
                                    )}
                                    {d.status === 'hidden' && (
                                        <span className={styles.hiddenBadge}>MASQUÉ</span>
                                    )}
                                </div>
                            ))}
                            <button className={styles.seeAllLink} onClick={() => onPatientOverview && onPatientOverview()}>Voir tous les documents →</button>
                        </div>

                        {/* Outils de consultation */}
                        <div className={styles.sideCard}>
                            <h3 className={styles.sideCardTitle}>Outils de consultation</h3>
                            <div className={styles.toolsGrid}>
                                <button className={styles.toolBtn} onClick={() => setShowNoteForm(!showNoteForm)}>
                                    <Mic size={18} />
                                    <span>Enregistrer note</span>
                                </button>
                                <button className={`${styles.toolBtn} ${styles.toolBtnPrimary}`} onClick={() => downloadCompteRenduPdf(patientId)}>
                                    <FileText size={18} />
                                    <span>Générer compte-rendu</span>
                                </button>
                            </div>
                            {showNoteForm && (
                                <div style={{ marginTop: 10 }}>
                                    <textarea
                                        value={noteText}
                                        onChange={e => setNoteText(e.target.value)}
                                        placeholder="Saisissez vos observations cliniques..."
                                        style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: '0.85rem', resize: 'vertical' }}
                                    />
                                    <button
                                        onClick={async () => {
                                            if (!noteText.trim()) return
                                            setNoteSaving(true)
                                            const result = await savePatientNote(patientId, noteText)
                                            setNoteSaving(false)
                                            if (result.success) {
                                                alert('Note enregistrée avec succès !')
                                                setNoteText('')
                                                setShowNoteForm(false)
                                                fetchMedecinPatientDetail(patientId).then(r => { if (r.success) setPatient(r.data) })
                                            }
                                        }}
                                        disabled={noteSaving}
                                        style={{ marginTop: 6, padding: '6px 16px', background: '#0EA5B0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}
                                    >
                                        {noteSaving ? 'Enregistrement...' : 'Sauvegarder la note'}
                                    </button>
                                </div>
                            )}
                            <button className={styles.btnSign} onClick={() => setShowModal(true)}>Réviser & Signer</button>
                        </div>

                        {/* Documents récents */}
                        <div className={styles.sideCard}>
                            <div className={styles.sideCardHeader}>
                                <h3 className={styles.sideCardTitle}>Documents récents</h3>
                            </div>
                            {recentDocs.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Aucun document récent.</p>}
                            {recentDocs.map((d, i) => (
                                <div key={i} className={styles.recentDocRow}>
                                    <span className={styles.recentDocIcon}>{d.icon}</span>
                                    <div className={styles.recentDocInfo}>
                                        <span className={styles.recentDocName}>{d.name}</span>
                                        <span className={styles.recentDocMeta}>{d.meta}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <SendReportModal
                    onClose={() => setShowModal(false)}
                    onConfirm={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
