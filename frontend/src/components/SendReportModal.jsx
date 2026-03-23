import { useState } from 'react'
import { CircleDot, Circle } from 'lucide-react'
import styles from './SendReportModal.module.css'

export default function SendReportModal({ onClose, onConfirm }) {
    const [option, setOption] = useState('patient')
    const [certified, setCertified] = useState(false)

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* Header Icon & Text */}
                <div className={styles.header}>
                    <div className={styles.iconCircle}>
                        <span className={styles.emoji}>📤</span>
                    </div>
                    <h2 className={styles.title}>Envoyer le compte rendu au patient</h2>
                    <p className={styles.subtitle}>Patient : Jean Dupont (ID: 4829)</p>
                </div>

                {/* Document Preview */}
                <div className={styles.section}>
                    <div className={styles.sectionLabel}>APERÇU DOCUMENT</div>
                    <div className={styles.docBox}>
                        <p className={styles.docTitle}>Note de consultation clinique — 24 Oct 2023</p>
                        <p className={styles.docDesc}>Motif : Suivi hypertension arterielle...</p>
                        <button className={styles.seeDoc}>[Voir le document complet →]</button>
                    </div>
                </div>

                {/* Send Options */}
                <div className={styles.section}>
                    <div className={styles.sectionLabel}>OPTIONS D'ENVOI</div>

                    <div
                        className={`${styles.optionRow} ${option === 'patient' ? styles.optionActive : ''}`}
                        onClick={() => setOption('patient')}
                    >
                        {option === 'patient'
                            ? <CircleDot size={18} className={styles.radioActive} />
                            : <Circle size={18} className={styles.radioInactive} />
                        }
                        <span className={styles.optionText}>Le patient uniquement (recommandé)</span>
                    </div>

                    <div
                        className={`${styles.optionRow} ${option === 'all' ? styles.optionActive : ''}`}
                        onClick={() => setOption('all')}
                    >
                        {option === 'all'
                            ? <CircleDot size={18} className={styles.radioActive} />
                            : <Circle size={18} className={styles.radioInactive} />
                        }
                        <span className={styles.optionText}>Le patient + médecins autorisés</span>
                    </div>
                </div>

                {/* Certification Checkbox */}
                <label className={styles.certifLabel}>
                    <div className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={certified}
                            onChange={(e) => setCertified(e.target.checked)}
                        />
                    </div>
                    <span className={styles.certifText}>
                        Je certifie que ce compte rendu est exact et validé par mes soins.
                    </span>
                </label>

                {/* Warning Alert */}
                <div className={styles.warningAlert}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <span className={styles.warningText}>
                        Cette action est irréversible. Le patient sera notifié par email.
                    </span>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={certified ? styles.btnConfirmActive : styles.btnConfirmDisabled}
                        onClick={() => { if (certified && onConfirm) onConfirm() }}
                        disabled={!certified}
                    >
                        Confirmer l'envoi
                    </button>
                    <div className={styles.secondaryActions}>
                        <button className={styles.btnDraft} onClick={onClose}>
                            Sauvegarder en<br />brouillon
                        </button>
                        <button className={styles.btnCancel} onClick={onClose}>
                            Annuler
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
