import styles from './Hero.module.css'

export default function Hero({ onOpenModal }) {
    return (
        <section className={styles.hero}>
            {/* LEFT */}
            <div className={styles.heroLeft}>
                <div className={styles.heroBadge}>
                    <div className={styles.badgeDot}></div>
                    Plateforme certifiée HDS — Conforme RGPD
                </div>

                <h1 className={styles.heroTitle}>
                    Vos documents<br />médicaux,<br />
                    <span className={styles.highlight}>enfin simples.</span>
                </h1>

                <p className={styles.heroSub}>
                    SantéClaire connecte patients et médecins autour d'un dossier médical unique, partagé en toute confiance, accessible en un clic lors de vos consultations.
                </p>

                <div className={styles.heroActions}>
                    <button className={styles.btnHeroPrimary} onClick={onOpenModal}>
                        Créer mon compte gratuit →
                    </button>
                    <a href="#how" className={styles.btnHeroSecondary}>
                        Voir comment ça marche
                    </a>
                </div>

                <div className={styles.heroStats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>12k+</span>
                        <span className={styles.statLabel}>Patients actifs</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>850+</span>
                        <span className={styles.statLabel}>Médecins certifiés</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>99.9%</span>
                        <span className={styles.statLabel}>Disponibilité</span>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className={styles.heroRight}>
                <div className={styles.heroCardStack}>
                    <div className={styles.cardShadow2}></div>
                    <div className={styles.cardShadow1}></div>

                    <div className={styles.heroCardMain}>
                        {/* Card Header */}
                        <div className={styles.cardHeader}>
                            <div className={styles.cardHeaderAvatar}>🩺</div>
                            <div className={styles.cardHeaderInfo}>
                                <div className={styles.cardHeaderName}>Dr. Sarah Smith</div>
                                <div className={styles.cardHeaderSub}>Consultation — Jean Dupont</div>
                            </div>
                            <div className={styles.cardTimer}>34:12 ⏱</div>
                        </div>

                        {/* Card Body */}
                        <div className={styles.cardBody}>
                            <div className={styles.cardSectionLabel}>Résumé IA des antécédents</div>
                            <div className={styles.cardAiBox}>
                                <div className={styles.cardAiTitle}>✦ Analyse IA</div>
                                <div className={styles.cardAiText}>
                                    Diabète type 2 suivi depuis 10 ans. Hypertension stable sous Lisinopril. Pas de douleur thoracique aiguë.
                                </div>
                            </div>
                            <div className={styles.cardSectionLabel}>Documents partagés</div>
                            <div className={styles.cardDocs}>
                                <div className={styles.cardDoc}>
                                    <div className={`${styles.docIcon} ${styles.lab}`}>🧪</div>
                                    <div className={styles.docInfo}>
                                        <div className={styles.docName}>Bilan sanguin complet</div>
                                        <div className={styles.docMeta}>Laboratoire • 12 Oct 2023</div>
                                    </div>
                                    <div className={`${styles.docBadge} ${styles.shared}`}>Partagé</div>
                                </div>
                                <div className={styles.cardDoc}>
                                    <div className={`${styles.docIcon} ${styles.img}`}>🩻</div>
                                    <div className={styles.docInfo}>
                                        <div className={styles.docName}>Radio hanche gauche</div>
                                        <div className={styles.docMeta}>Imagerie • 24 Sep 2023</div>
                                    </div>
                                    <div className={`${styles.docBadge} ${styles.shared}`}>Partagé</div>
                                </div>
                                <div className={styles.cardDoc} style={{ opacity: 0.5 }}>
                                    <div className={`${styles.docIcon} ${styles.ord}`}>📋</div>
                                    <div className={styles.docInfo}>
                                        <div className={styles.docName}>Compte-rendu psy</div>
                                        <div className={styles.docMeta}>Spécialiste • Sep 2023</div>
                                    </div>
                                    <div className={`${styles.docBadge} ${styles.private}`}>🔒 Privé</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating notification */}
                    <div className={styles.heroNotif}>
                        <div className={styles.notifIcon}>✅</div>
                        <div className={styles.notifText}>
                            <div className={styles.notifTitle}>Compte rendu envoyé</div>
                            <div className={styles.notifSub}>Jean Dupont a été notifié</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
