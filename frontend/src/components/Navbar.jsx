import { useRef } from 'react'
import { useNavScroll } from '../hooks/useNavScroll'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import { LogoFull } from './LogoSVG'
import styles from './Navbar.module.css'

export default function Navbar({ onOpenModal, onLogin }) {
    const navRef = useRef(null)
    const { t } = useLanguage()
    useNavScroll(navRef)

    return (
        <nav ref={navRef} className={styles.nav}>
            <LogoFull height={38} />

            <ul className={styles.navLinks}>
                <li><a href="#features">{t('nav.features')}</a></li>
                <li><a href="#security">{t('nav.security')}</a></li>
                <li><a href="#how">{t('nav.how')}</a></li>
                <li><a href="#about">{t('nav.about')}</a></li>
            </ul>

            <div className={styles.navCta}>
                <LanguageSwitcher />
                <a href="#" className={styles.btnOutline} onClick={(e) => { e.preventDefault(); onLogin && onLogin(); }}>{t('nav.login')}</a>
                <button className={styles.btnPrimary} onClick={onOpenModal}>
                    {t('nav.signup')}
                </button>
            </div>
        </nav>
    )
}
