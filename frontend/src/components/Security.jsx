import styles from './Security.module.css'
import { useLanguage } from '../hooks/useLanguage'

export default function Security() {
    const { t } = useLanguage()

    const badges = [
        {
            icon: '🏥',
            title: t('security.hds') || 'Hébergement certifié HDS',
            sub: t('security.hds_sub') || 'Données hébergées en France',
        },
        {
            icon: '🔐',
            title: t('security.encryption') || 'Chiffrement de bout en bout',
            sub: 'AES-256 + TLS 1.3',
        },
        {
            icon: '🇪🇺',
            title: t('security.gdpr') || 'Conforme RGPD',
            sub: t('security.gdpr_sub') || "Droit à l'oubli & portabilité",
        },
        {
            icon: '🔒',
            title: t('security.prosante') || 'ProSanté Connect',
            sub: t('security.prosante_sub') || 'Authentification médecins certifiée',
        },
    ]

    return (
        <section className={styles.section} id="security">
            <div className={styles.visual}>
                {badges.map((b, i) => (
                    <div key={i} className={`${styles.badge} fade-in`} style={{ transitionDelay: `${i * 0.1}s` }}>
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
                <div className={`${styles.eyebrow} fade-in`}>{t('security.label') || 'Sécurité'}</div>
                <h2 className={`${styles.title} fade-in`} style={{ transitionDelay: '0.08s' }}>{t('security.title') || 'Votre santé mérite la meilleure protection.'}</h2>
                <p className={`${styles.sub} fade-in`} style={{ transitionDelay: '0.16s' }}>
                    {t('security.subtitle') || 'SantéClaire respecte les standards les plus stricts de sécurité des données de santé. Vos informations n\'appartiennent qu\'à vous.'}
                </p>
                <p className={`${styles.body} fade-in`} style={{ transitionDelay: '0.24s' }}>
                    {t('security.description') || 'Toutes les données sont hébergées exclusivement en France sur des infrastructures certifiées HDS (Hébergeur de Données de Santé). L\'accès à vos documents est tracé, auditable et révocable à tout moment.'}
                </p>
            </div>
        </section>
    )
}
