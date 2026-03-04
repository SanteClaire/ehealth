import { useState, useEffect } from 'react'
import {
    Sparkles, Camera, Download, Heart, ExternalLink,
    FileText, Bell, Search, Mic, ClipboardList,
    PenLine, Plus, Share2, AlertTriangle, Clock
} from 'lucide-react'
import styles from './DoctorPatientOverviewPage.module.css'
import logo from '../assets/logo2.png'

const navLinks = [
    { label: 'Tableau de bord', id: 'dashboard' },
    { label: 'Mes Patients', id: 'patients' },
    { label: 'Planning', id: 'planning' },
    { label: 'Paramètres', id: 'settings' }
]

const docCards = [
    {
        id: 1,
        date: 'SEPT 2023',
        title: 'Comprehensive Blood Panel',
        desc: 'Lipid profile, HbA1c, and Metabolic panel. All values within expected range for age.',
        tags: [{ label: 'Partagé', type: 'green' }, { label: 'Valeurs normales', type: 'teal' }],
        values: [{ key: 'LDL:', val: '98 mg/dL' }, { key: 'HbA1c:', val: '5.1%' }],
        action: null,
        masked: false,
        sideIcon: 'download',
    },
    {
        id: 2,
        date: 'OCT 2023',
        title: 'Chest X-Ray (Anterior/Lateral)',
        desc: 'Radiology Department - City Hospital. Observation of mild cardiomegaly consistent with history.',
        tags: [{ label: 'Partagé', type: 'green' }, { label: 'Résumé IA', type: 'purple' }],
        values: [],
        action: { label: 'Voir l\'image', icon: 'external' },
        masked: false,
        sideIcon: 'camera',
    },
    {
        id: 3,
        date: 'JULY 2023',
        title: 'Cardiology Specialist Consultation',
        desc: 'Dr. Aris - Follow-up on hypertension. Medication adjusted to Lisinopril 10mg daily.',
        tags: [{ label: 'Masqué par le patient', type: 'gray' }],
        values: [],
        action: { label: 'Voir les notes', icon: 'file' },
        masked: true,
        sideIcon: 'heart',
    },
]

const aiPoints = [
    {
        title: 'Hypertension chronique:',
        text: 'Currently managed with Lisinopril (10mg). Recent blood pressure readings indicate stable control (average 128/82 mmHg).',
    },
    {
        title: 'Chirurgie récente:',
        text: 'Recovering from elective right knee arthroplasty (August 2023). Patient reports improving mobility but occasional localized stiffness.',
    },
    {
        title: 'Allergies & Contre-indications:',
        text: 'No known drug allergies (NKDA). Last preventative screening (Colonoscopy) was within guidelines in 2021.',
    },
]

export default function DoctorPatientOverviewPage({ onBack, onLogout, onNavigate }) {
    const [seconds, setSeconds] = useState(34 * 60 + 12)

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
        <div className={styles.page}>

            {/* ── Navbar ── */}
            <header className={styles.navbar}>
                <div className={styles.navLeft}>
                    <img src={logo} alt="SantéClaire" className={styles.navLogo} />
                    <nav className={styles.navLinks}>
                        {navLinks.map(l => (
                            <button
                                key={l.id}
                                onClick={() => onNavigate && onNavigate(l.id)}
                                className={`${styles.navLink} ${l.id === 'dashboard' ? styles.navActive : ''}`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className={styles.navRight}>
                    <div className={styles.searchBox}>
                        <Search size={13} className={styles.searchIcon} />
                        <input className={styles.searchInput} placeholder="Search patient..." />
                    </div>
                    <button className={styles.bellBtn}><Bell size={18} /></button>
                    <div className={styles.doctorBlock}>
                        <div>
                            <div className={styles.doctorName}>Dr. Smith</div>
                            <div className={styles.doctorRole}>General Practitioner</div>
                        </div>
                        <div className={styles.doctorAvat}>DS</div>
                    </div>
                </div>
            </header>

            {/* ── Patient header ── */}
            <div className={styles.patientHeader}>
                <div className={styles.patientLeft}>
                    <div className={styles.avatarWrap}>
                        <div className={styles.patientAvat}>JD</div>
                        <span className={styles.onlineDot} />
                    </div>
                    <div>
                        <div className={styles.patientNameRow}>
                            <span className={styles.patientName}>Jean Dupont</span>
                            <span className={styles.consultBadge}>CONSULTATION ACTIVE</span>
                        </div>
                        <div className={styles.patientMeta}>
                            <span>🗓 65 Years Old</span>
                            <span>🩸 Type A+ (Positive)</span>
                            <span>♂ Male</span>
                            <span>📍 Paris, FR</span>
                        </div>
                    </div>
                </div>
                <div className={styles.patientActions}>
                    <button className={styles.btnUrgence}>
                        <AlertTriangle size={14} /> Infos urgence
                    </button>
                    <button className={styles.btnHistory} onClick={onBack}>
                        <ClipboardList size={14} /> Historique complet
                    </button>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className={styles.mainGrid}>

                {/* ── Left: Dossier cards ── */}
                <div className={styles.dossierPanel}>
                    <div className={styles.dossierHeader}>
                        <div className={styles.dossierTitle}>
                            <FileText size={16} />
                            <span>Dossier médical &amp; Historique</span>
                        </div>
                        <div className={styles.dossierSub}>
                            Certains documents peuvent être masqués par le patient conformément au RGPD.
                        </div>
                        <div className={styles.dossierActions}>
                            <button className={styles.iconBtn}><Share2 size={15} /></button>
                            <button className={styles.iconBtn}><Plus size={15} /></button>
                        </div>
                    </div>

                    <div className={styles.cardsList}>
                        {docCards.map((doc, idx) => (
                            <div key={doc.id} className={styles.cardRow}>
                                {/* Side icon */}
                                <div className={styles.cardSide}>
                                    {doc.sideIcon === 'camera' && <button className={styles.sideBtn}><Camera size={15} /></button>}
                                    {doc.sideIcon === 'download' && <button className={styles.sideBtn}><Download size={15} /></button>}
                                    {doc.sideIcon === 'heart' && <button className={`${styles.sideBtn} ${styles.sideBtnHeart}`}><Heart size={15} /></button>}
                                </div>

                                {/* Card */}
                                <div className={`${styles.docCard} ${doc.masked ? styles.docCardMasked : ''}`}>
                                    <div className={styles.cardTop}>
                                        <span className={styles.cardDate}>{doc.date}</span>
                                        <div className={styles.cardTags}>
                                            {doc.tags.map((tag, i) => (
                                                <span key={i} className={`${styles.cardTag} ${styles[`tag_${tag.type}`]}`}>
                                                    {tag.type === 'green' && '✓ '}
                                                    {tag.type === 'purple' && '✦ '}
                                                    {tag.type === 'gray' && '🔒 '}
                                                    {tag.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className={styles.cardTitle}>{doc.title}</h3>
                                    <p className={styles.cardDesc}>{doc.desc}</p>
                                    {doc.values.length > 0 && (
                                        <div className={styles.cardValues}>
                                            {doc.values.map((v, i) => (
                                                <span key={i} className={styles.cardValue}>
                                                    <strong>{v.key}</strong> {v.val}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {doc.action && (
                                        <button className={styles.cardAction}>
                                            {doc.action.label}
                                            {doc.action.icon === 'external' && <ExternalLink size={12} />}
                                            {doc.action.icon === 'file' && <FileText size={12} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: AI + Tools ── */}
                <div className={styles.rightPanel}>

                    {/* AI Summary */}
                    <div className={styles.aiCard}>
                        <div className={styles.aiCardHeader}>
                            <div className={styles.aiTitle}>
                                <Sparkles size={15} className={styles.sparkle} />
                                Résumé généré par l'IA
                            </div>
                            <span className={styles.aiTimeBadge}>Mis à jour il y a 2 min</span>
                        </div>
                        <ul className={styles.aiList}>
                            {aiPoints.map((p, i) => (
                                <li key={i} className={styles.aiPoint}>
                                    <span className={styles.aiDot} />
                                    <p className={styles.aiText}>
                                        <strong className={styles.aiPointTitle}>{p.title}</strong> {p.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Consultation tools */}
                    <div className={styles.toolsCard}>
                        <div className={styles.toolsTitle}>
                            <span className={styles.toolsIcon}>⚙</span>
                            Outils de consultation
                        </div>
                        <div className={styles.toolsGrid}>
                            <button className={styles.toolBtn}>
                                <Mic size={22} className={styles.toolBtnIcon} />
                                <span>Enregistrer note vocale</span>
                            </button>
                            <button className={styles.toolBtn}>
                                <ClipboardList size={22} className={styles.toolBtnIcon} />
                                <span>Générer le compte rendu</span>
                            </button>
                        </div>

                        <div className={styles.draftBox}>
                            <div className={styles.draftHeader}>
                                <span className={styles.draftLabel}>BROUILLON EN COURS</span>
                                <span className={styles.draftDot} />
                            </div>
                            <p className={styles.draftText}>
                                "Patient presents today for routine follow-up. Vital signs are normal. Knee mobility has increased 15%..."
                            </p>
                        </div>

                        <div className={styles.signRow}>
                            <button className={styles.btnSign}>Réviser &amp; Signer</button>
                            <button className={styles.btnEdit}><PenLine size={15} /></button>
                        </div>
                    </div>

                    {/* Accès temporaire */}
                    <div className={styles.accessCard}>
                        <div className={styles.accessLeft}>
                            <Clock size={22} className={styles.clockIcon} />
                        </div>
                        <div className={styles.accessCenter}>
                            <div className={styles.accessLabel}>ACCÈS TEMPORAIRE</div>
                            <div className={styles.accessTimer}>
                                <span>{time.m}:{time.s}</span>
                                <span className={styles.accessTimerSub}> restant</span>
                            </div>
                            <div className={styles.accessBar}>
                                <div
                                    className={styles.accessBarFill}
                                    style={{ width: `${Math.min(100, (seconds / (35 * 60)) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <button className={styles.prolongBtn}>Prolonger la session</button>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className={styles.bottomBar}>
                <button className={styles.bottomExport}>
                    <Share2 size={13} /> EXPORTER LE DOSSIER
                </button>
                <button className={styles.bottomEnd} onClick={onLogout}>
                    🔒 TERMINER LA SESSION CHIFFRÉE
                </button>
            </div>

            {/* ── FAB ── */}
            <button className={styles.fab}><Plus size={22} /></button>

        </div>
    )
}
