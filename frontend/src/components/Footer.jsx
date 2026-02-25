import styles from './Footer.module.css'
import logo2 from '../assets/logo3.png'

const produit = ['Fonctionnalités', 'Espace Patient', 'Espace Médecin', 'Sécurité', 'Tarifs']
const entreprise = ['À propos', 'Blog', 'Presse', 'Carrières', 'Contact']
const legal = ['CGU', 'Confidentialité', 'Mentions légales', 'RGPD']

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <img src={logo2} alt="SantéClaire logo" className={styles.logoImg} />
                    </div>
                    <p className={styles.desc}>
                        La plateforme qui connecte patients et médecins autour d'un dossier médical sécurisé et partagé.
                    </p>
                </div>

                <div>
                    <div className={styles.colTitle}>Produit</div>
                    <ul className={styles.links}>
                        {produit.map((l) => <li key={l}><a href="#">{l}</a></li>)}
                    </ul>
                </div>

                <div>
                    <div className={styles.colTitle}>Entreprise</div>
                    <ul className={styles.links}>
                        {entreprise.map((l) => <li key={l}><a href="#">{l}</a></li>)}
                    </ul>
                </div>

                <div>
                    <div className={styles.colTitle}>Légal</div>
                    <ul className={styles.links}>
                        {legal.map((l) => <li key={l}><a href="#">{l}</a></li>)}
                    </ul>
                </div>
            </div>

            <div className={styles.bottom}>
                <span className={styles.copy}>© 2024 SantéClaire — Tous droits réservés</span>
                <div className={styles.security}>
                    <div className={styles.secItem}>🔒 HDS Certifié</div>
                    <div className={styles.secItem}>🇪🇺 RGPD</div>
                    <div className={styles.secItem}>🔐 Chiffré</div>
                </div>
            </div>
        </footer>
    )
}
