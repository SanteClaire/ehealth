import { useState, useEffect, useRef } from 'react'
import {
    Pause, MicOff, Shield, Cloud, Save,
    Sparkles, PenLine, Check, Circle, Bell, Settings,
    CheckCircle2
} from 'lucide-react'
import styles from './DoctorConsultationPage.module.css'
import logo from '../assets/logo2.png'
import SendReportModal from './SendReportModal'

const initialMessages = [
    { id: 1, from: 'doctor', name: 'DR. SMITH', time: '12:42', text: 'Bonjour Jean. Comment vous sentez-vous depuis notre dernier ajustement de traitement ?' },
    { id: 2, from: 'patient', name: 'JEAN DUPONT', time: '12:43', text: 'Mieux, je crois. Les maux de tête ont diminué, mais j\'ai des vertiges en me levant le matin.' },
    { id: 3, from: 'doctor', name: 'DR. SMITH', time: '12:44', text: 'Je vois. Les vertiges peuvent être un effet secondaire courant. Avez-vous des douleurs thoraciques associées ?' },
    { id: 4, from: 'patient', name: 'JEAN DUPONT', time: '12:45', text: 'Non, pas de douleur. Juste une légère oppression.' },
]

const clinicalFindings = [
    { id: 1, label: 'Céphalées en régression', checked: true },
    { id: 2, label: 'Vertiges matinaux (possible hypotension orthostatique)', checked: true },
    { id: 3, label: 'Oppression thoracique légère (sans douleur aiguë)', checked: false },
]

const treatmentPlan = [
    { id: 1, label: 'Réalisation d\'un ECG de repos', checked: false, badge: 'EN ATTENTE' },
    { id: 2, label: 'Renouvellement ordonnance', checked: true, badge: null },
]

export default function DoctorConsultationPage({ onEnd }) {
    const [seconds, setSeconds] = useState(12 * 60 + 45)
    const [recording, setRecording] = useState(true)
    const [micOn, setMicOn] = useState(true)
    const [findings, setFindings] = useState(clinicalFindings)
    const [plan, setPlan] = useState(treatmentPlan)
    const [showModal, setShowModal] = useState(false)
    const chatEndRef = useRef(null)

    /* Live timer */
    useEffect(() => {
        if (!recording) return
        const t = setInterval(() => setSeconds(s => s + 1), 1000)
        return () => clearInterval(t)
    }, [recording])

    const fmt = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    const toggleFinding = (id) =>
        setFindings(f => f.map(x => x.id === id ? { ...x, checked: !x.checked } : x))

    const togglePlan = (id) =>
        setPlan(p => p.map(x => x.id === id ? { ...x, checked: !x.checked } : x))

    return (
        <div className={styles.page}>

            {/* ── Top navbar ── */}
            <header className={styles.navbar}>
                <div className={styles.navLeft}>
                    <img src={logo} alt="SantéClaire" className={styles.navLogo} />
                    <div className={styles.navDivider} />
                    <div>
                        <div className={styles.navPatientName}>Jean Dupont</div>
                        <div className={styles.navPatientMeta}>65 ans • ID: #88234</div>
                    </div>
                </div>

                <div className={styles.navCenter}>
                    <span className={styles.liveChip}>
                        <span className={styles.liveDot} />
                        CONSULTATION EN DIRECT
                    </span>
                </div>

                <div className={styles.navRight}>
                    <button className={styles.navIcon}><Bell size={18} /></button>
                    <button className={styles.navIcon}><Settings size={18} /></button>
                    <div className={styles.doctorInfo}>
                        <div>
                            <div className={styles.doctorName}>Dr. Smith</div>
                            <div className={styles.doctorRole}>Cardiologue</div>
                        </div>
                        <div className={styles.doctorAvatar}>DS</div>
                    </div>
                </div>
            </header>

            {/* ── Two panels ── */}
            <div className={styles.panels}>

                {/* ── Left: Transcription ── */}
                <div className={styles.panelLeft}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitle}>
                            Transcription en direct
                            <span className={styles.timerBadge}>{fmt(seconds)}</span>
                        </div>
                        <button className={styles.btnSaveAudio}>
                            <Save size={14} /> Sauvegarder l'audio
                        </button>
                    </div>

                    <div className={styles.chat}>
                        {initialMessages.map((m) => (
                            <div key={m.id} className={`${styles.msgRow} ${m.from === 'patient' ? styles.msgRowRight : ''}`}>
                                {m.from === 'doctor' ? (
                                    <>
                                        <div className={styles.msgBlock}>
                                            <div className={styles.msgMeta}>
                                                <span className={styles.msgSenderDoc}>{m.name}</span>
                                                <span className={styles.msgTime}>{m.time}</span>
                                            </div>
                                            <div className={`${styles.bubble} ${styles.bubbleDoc}`}>{m.text}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.msgBlock}>
                                        <div className={`${styles.msgMeta} ${styles.msgMetaRight}`}>
                                            <span className={styles.msgTime}>{m.time}</span>
                                            <span className={styles.msgSenderPat}>{m.name}</span>
                                        </div>
                                        <div className={`${styles.bubble} ${styles.bubblePat}`}>{m.text}</div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {recording && (
                            <div className={styles.transcribing}>
                                <span className={styles.transcribingDots} />
                                … Transcription en cours...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* ── Right: AI brouillon ── */}
                <div className={styles.panelRight}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitle}>
                            <Sparkles size={16} className={styles.sparkle} />
                            <em>Brouillon IA du compte rendu</em>
                        </div>
                        <div className={styles.panelActions}>
                            <button className={styles.btnModify}>Modifier</button>
                            <button className={styles.btnSign} onClick={() => setShowModal(true)}>Finaliser &amp; Signer</button>
                        </div>
                    </div>

                    <div className={styles.reportCard}>
                        <div className={styles.reportCardHeader}>
                            <h2 className={styles.reportTitle}>Note de Consultation Clinique</h2>
                            <p className={styles.reportMeta}>GÉNÉRÉ LE : 24 OCT 2023 • 10:30</p>
                        </div>

                        {/* Motif */}
                        <div className={styles.reportSection}>
                            <div className={styles.sectionLabel}>MOTIF DE CONSULTATION</div>
                            <blockquote className={styles.blockquote}>
                                Suivi post-ajustement thérapeutique pour hypertension. Signalement de maux de tête en diminution mais apparition de vertiges orthostatiques.
                            </blockquote>
                        </div>

                        {/* Constatations */}
                        <div className={styles.reportSection}>
                            <div className={styles.sectionLabel}>CONSTATATIONS CLINIQUES</div>
                            {findings.map((f) => (
                                <label key={f.id} className={styles.checkRow} onClick={() => toggleFinding(f.id)}>
                                    {f.checked
                                        ? <CheckCircle2 size={17} color="#22C55E" />
                                        : <Circle size={17} color="#D1D5DB" />
                                    }
                                    <span className={styles.checkLabel}>{f.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Diagnostic */}
                        <div className={styles.reportSection}>
                            <div className={styles.sectionLabel}>DIAGNOSTIC &amp; ÉVALUATION</div>
                            <div className={styles.aiAnalysis}>
                                <Sparkles size={14} className={styles.sparkleAi} />
                                <p className={styles.aiText}>
                                    L'IA analyse la transcription… Les symptômes suggèrent une réaction attendue au traitement bêta-bloquant. Surveillance de la tension artérielle recommandée.
                                </p>
                            </div>
                        </div>

                        {/* Plan */}
                        <div className={styles.reportSection}>
                            <div className={styles.sectionLabel}>PLAN DE TRAITEMENT</div>
                            {plan.map((p) => (
                                <label key={p.id} className={styles.checkRow} onClick={() => togglePlan(p.id)}>
                                    <div className={`${styles.planCheck} ${p.checked ? styles.planChecked : ''}`}>
                                        {p.checked && <Check size={11} color="#fff" strokeWidth={3} />}
                                    </div>
                                    <span className={`${styles.checkLabel} ${p.checked ? styles.checkLabelDone : ''}`}>{p.label}</span>
                                    {p.badge && <span className={styles.pendingBadge}>{p.badge}</span>}
                                    {p.checked && <Check size={14} color="#22C55E" className={styles.doneCheck} />}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className={styles.bottomBar}>
                <div className={styles.bottomLeft}>
                    <button
                        className={`${styles.bottomBtn} ${!recording ? styles.bottomBtnActive : ''}`}
                        onClick={() => setRecording(r => !r)}
                    >
                        <Pause size={15} />
                        {recording ? 'Pause enregistrement' : 'Reprendre'}
                    </button>
                    <button
                        className={`${styles.bottomBtnDanger} ${!micOn ? styles.bottomBtnDangerActive : ''}`}
                        onClick={() => setMicOn(m => !m)}
                    >
                        <MicOff size={15} />
                        {micOn ? 'Couper micro médecin' : 'Activer micro'}
                    </button>
                </div>

                <div className={styles.bottomRight}>
                    <span className={styles.bottomBadge}>
                        <Shield size={13} /> Session conforme HDS
                    </span>
                    <span className={styles.bottomBadge}>
                        <Cloud size={13} /> Sauvegarde automatique
                    </span>
                    <button className={styles.btnEndConsult} onClick={onEnd}>
                        Terminer la consultation
                    </button>
                </div>
            </div>

            {showModal && (
                <SendReportModal
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {
                        setShowModal(false)
                        if (onEnd) onEnd()
                    }}
                />
            )}
        </div>
    )
}
