import styles from './Footer.module.css'
import logo2 from '../assets/logo.png'
import { useLanguage } from '../hooks/useLanguage'

const SUPPORT_EMAIL = 'mailto:support@santeclaire.fr'

export default function Footer() {
    const { t } = useLanguage()

    const produit = [
        { key: 'footer.features', label: t('footer.features'), href: '#features' },
        { key: 'footer.patientSpace', label: t('footer.patientSpace'), href: '#about' },
        { key: 'footer.doctorSpace', label: t('footer.doctorSpace'), href: '#about' },
        { key: 'footer.security', label: t('footer.security'), href: '#security' },
        { key: 'footer.pricing', label: t('footer.pricing'), href: '#cta' },
    ]
    const entreprise = [
        { key: 'footer.about', label: t('footer.about'), href: '#about' },
        { key: 'footer.blog', label: t('footer.blog'), href: '#features' },
        { key: 'footer.press', label: t('footer.press'), href: '#about' },
        { key: 'footer.careers', label: t('footer.careers'), href: '#cta' },
        { key: 'footer.contact', label: t('footer.contact'), href: SUPPORT_EMAIL },
    ]
    const legal = [
        { key: 'footer.terms', label: t('footer.terms'), href: '#cta' },
        { key: 'footer.privacy', label: t('footer.privacy'), href: '#security' },
        { key: 'footer.legalNotice', label: t('footer.legalNotice'), href: '#about' },
        { key: 'footer.gdpr', label: t('footer.gdpr'), href: '#security' },
    ]

    return (
        <footer className={styles.footer}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <img src={logo2} alt="SantéClaire logo" className={styles.logoImg} />
                    </div>
                    <p className={styles.desc}>{t('footer.desc')}</p>
                </div>

                <div>
                    <div className={styles.colTitle}>{t('footer.product')}</div>
                    <ul className={styles.links}>
                        {produit.map((l) => (
                            <li key={l.key}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className={styles.colTitle}>{t('footer.company')}</div>
                    <ul className={styles.links}>
                        {entreprise.map((l) => (
                            <li key={l.key}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className={styles.colTitle}>{t('footer.legal')}</div>
                    <ul className={styles.links}>
                        {legal.map((l) => (
                            <li key={l.key}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.bottom}>
                <span className={styles.copy}>© 2024 SantéClaire — {t('footer.rights')}</span>
                <div className={styles.security}>
                    <div className={styles.secItem}>🔒 {t('footer.hds')}</div>
                    <div className={styles.secItem}>🇪🇺 {t('footer.gdpr')}</div>
                    <div className={styles.secItem}>🔐 {t('footer.encrypted')}</div>
                </div>
            </div>
        </footer>
    )
}
