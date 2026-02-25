import styles from './TrustBar.module.css'

const items = [
    { icon: '🔒', label: 'Hébergement certifié HDS' },
    { icon: '🇪🇺', label: 'Conforme RGPD' },
    { icon: '🔐', label: 'Chiffrement bout en bout' },
    { icon: '🏥', label: 'Certifié ProSanté Connect' },
    { icon: '⚡', label: 'Disponible 24h/7j' },
]

export default function TrustBar() {
    return (
        <div className={styles.trustBar}>
            {items.map((item, i) => (
                <div key={i} className={styles.trustItem}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}
