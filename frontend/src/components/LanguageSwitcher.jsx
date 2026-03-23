import { useLanguage } from '../hooks/useLanguage'
import { Globe, ChevronDown } from 'lucide-react'
import styles from './LanguageSwitcher.module.css'
import { useState } from 'react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ]

  return (
    <div className={styles.switcher}>
      <div className={styles.dropdown}>
        <button 
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Globe size={16} />
          <span>{languages.find(l => l.code === language)?.name}</span>
          <ChevronDown size={14} className={isOpen ? styles.open : ''} />
        </button>
        
        {isOpen && (
          <div className={styles.menu}>
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`${styles.item} ${language === lang.code ? styles.active : ''}`}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
