import styles from './Security.module.css'

const badges = [
    {
        icon: '🏥',
        title: 'Hébergement certifié HDS',
        sub: 'Données hébergées en France',
    },
    {
        icon: '🔐',
        title: 'Chiffrement de bout en bout',
        sub: 'AES-256 + TLS 1.3',
    },
    {
        icon: '🇪🇺',
        title: 'Conforme RGPD',
        sub: "Droit à l'oubli & portabilité",
    },
    {
        icon: '🔒',
        title: 'ProSanté Connect',
        sub: 'Authentification médecins certifiée',
    },
]

export default function Security() {
    return (
        <section className={styles.section} id="security">
            <div className={styles.visual}>
                {badges.map((b, i) => (
                    <div key={i} className={styles.badge}>
                        <div className={styles.badgeIcon}>{b.icon}</div>
                        <div className={styles.badgeText}>
                            <div className={styles.badgeTitle}>{b.title}</div>
                            <div className={styles.badgeSub}>{b.sub}</div>
                        </div>
                        <div className={styles.badgeCheck}>✓</div>
                    </div>
                ))}
            </div>
            <div className={styles.content}>
                <div className={styles.eyebrow}>Sécurité</div>
                <h2 className={styles.title}>Votre santé mérite la meilleure protection.</h2>
                <p className={styles.sub}>
                    SantéClaire respecte les standards les plus stricts de sécurité des données de santé. Vos informations n'appartiennent qu'à vous.
                </p>
                <p className={styles.body}>
                    Toutes les données sont hébergées exclusivement en France sur des infrastructures certifiées HDS (Hébergeur de Données de Santé). L'accès à vos documents est tracé, auditable et révocable à tout moment.
                </p>
            </div>
        </section>
    )
}
