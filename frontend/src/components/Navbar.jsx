import { useRef } from 'react'
import { useNavScroll } from '../hooks/useNavScroll'
import styles from './Navbar.module.css'
import logo from '../assets/logo3.png'

export default function Navbar({ onOpenModal, onLogin }) {
    const navRef = useRef(null)
    useNavScroll(navRef)

    return (
        <nav ref={navRef} className={styles.nav}>
            <a href="#" className={styles.logo}>
                <img src={logo} alt="SantéClaire logo" className={styles.logoImg} />
            </a>

            <ul className={styles.navLinks}>
                <li><a href="#how">Fonctionnalités</a></li>
                <li><a href="#features">Services</a></li>
                <li><a href="#security">Sécurité</a></li>
                <li><a href="#about">À propos</a></li>
            </ul>

            <div className={styles.navCta}>
                <a href="#" className={styles.btnOutline} onClick={(e) => { e.preventDefault(); onLogin && onLogin(); }}>Se connecter</a>
                <button className={styles.btnPrimary} onClick={onOpenModal}>
                    Créer un compte
                </button>
            </div>
        </nav>
    )
}
