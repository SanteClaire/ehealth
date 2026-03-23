import { useState, useRef } from 'react'
import {
    LayoutDashboard, FileText, Users, MessageCircle, Settings,
    LogOut, Send, Upload, Scan, Share2, AlertCircle, Shield, PhoneCall,
    Search, Bell, Plus, Info, Lock, Mic,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './PatientChatbotPage.module.css'
import logo from '../assets/logo.png'

const frequentTopics = [
    { icon: '📋', titleKey: 'chatbot.prepareAppointment' },
    { icon: '💊', titleKey: 'chatbot.understandPrescription' },
    { icon: '📊', titleKey: 'chatbot.understandResults' },
    { icon: '❓', titleKey: 'chatbot.generalQuestion' },
]

const CLINIC_TEL = 'tel:+33123456789'

export default function PatientChatbotPage({ user, onLogout, onNavigate, onBack }) {
    const { t, language } = useLanguage()
    const fileInputRef = useRef(null)
    const userName = user?.firstName || 'Patient'
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Patient'
    const userInitials = user ? `${(user.firstName?.[0] || '')}${(user.lastName?.[0] || '')}`.toUpperCase() : 'P'
    const [messages, setMessages] = useState([
        {
            id: 1,
            author: 'bot',
            timestamp: 'SantéClaire AI',
            text: `Bonjour ${userName}, je suis votre assistant médical IA. Je peux vous aider à comprendre vos documents médicaux, ordonnances, ou répondre à vos questions de santé. Comment puis-je vous aider ?`,
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef(null)

    const appendUserMessage = (text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const newMessage = {
            id: Date.now(),
            author: 'user',
            timestamp: 'Sent • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            text: trimmed,
        }
        setMessages((prev) => [...prev, newMessage])
        setInputValue('')
    }

    const handleSendMessage = () => {
        appendUserMessage(inputValue)
    }

    const handleQuickAction = (presetKey) => {
        const presets = {
            rdv: t('chatbot.restartWithRdv'),
            rx: t('chatbot.myPrescriptions'),
            lab: t('chatbot.myResults'),
        }
        appendUserMessage(presets[presetKey] || '')
    }

    const handleTopicClick = (titleKey) => {
        setInputValue(t(titleKey))
    }

    const handleChatFiles = (e) => {
        const files = e.target.files
        if (files?.length) {
            const names = [...files].map((f) => f.name).join(', ')
            appendUserMessage(`${t('chatbot.uploadContext')} : ${names}`)
        }
        e.target.value = ''
    }

    const startVoiceInput = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            alert(t('chatbot.voiceNotSupported'))
            return
        }

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition()
            recognition.interimResults = false
            recognition.maxAlternatives = 1
            recognition.continuous = false

            recognition.onresult = (event) => {
                const transcript = event?.results?.[0]?.[0]?.transcript
                if (transcript) setInputValue(transcript)
            }

            recognition.onend = () => setIsListening(false)
            recognition.onerror = () => setIsListening(false)

            recognitionRef.current = recognition
        }

        try {
            recognitionRef.current.lang = language === 'en' ? 'en-US' : 'fr-FR'
            recognitionRef.current.start()
            setIsListening(true)
        } catch (e) {
            // Peut arriver si start est appelé alors qu'une session est déjà active
            setIsListening(false)
        }
    }

    const stopVoiceInput = () => {
        try {
            recognitionRef.current?.stop()
        } catch (_) {
            // ignore
        }
        setIsListening(false)
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), id: 'dashboard' },
        { icon: FileText, label: t('sidebar.documents'), id: 'documents' },
        { icon: Users, label: t('sidebar.family'), id: 'famille' },
        { icon: MessageCircle, label: t('sidebar.ai'), id: 'ia', active: true },
        { icon: Settings, label: t('sidebar.settings'), id: 'settings' },
    ]

    return (
        <div className={styles.layout}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brand}>
                        <img src={logo} alt="SantéClaire" className={styles.logo} />
                    </div>

                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.label}
                                    className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                                    onClick={() => onNavigate && onNavigate(item.id)}
                                >
                                    <Icon size={17} className={styles.navIcon} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className={styles.sidebarBottom}>
                    <button className={styles.btnLogout} onClick={onLogout}>
                        <LogOut size={16} /> {t('sidebar.logout')}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className={styles.main}>
                {/* ── Topbar ── */}
                <header className={styles.topbar}>
                    <div className={styles.searchWrap}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            className={styles.search}
                            type="text"
                            placeholder={t('chatbot.searchPlaceholder')}
                        />
                    </div>
                    <div className={styles.topRight}>
                        <LanguageSwitcher />
                        <button className={styles.iconBtn}>
                            <Bell size={17} />
                        </button>
                        <button
                            type="button"
                            className={styles.profileBlock}
                            onClick={() => onNavigate && onNavigate('profil')}
                            aria-label={t('sidebar.profile')}
                        >
                            <span className={styles.profileName}>{userFullName}</span>
                            <div className={styles.profileAvatar}>{userInitials}</div>
                        </button>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className={styles.content}>
                    {/* Chat Header */}
                    <div className={styles.chatHeader}>
                        <div>
                            <h2 className={styles.chatTitle}>{t('chatbot.title')}</h2>
                            <span className={styles.badge}>{t('chatbot.activeAnalysis')}</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={styles.messagesArea}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`${styles.messageGroup} ${styles[`msg_${msg.author}`]}`}>
                            {msg.author === 'bot' && (
                                <div className={styles.botIcon}>
                                    AI
                                </div>
                            )}
                            {msg.author === 'user' && (
                                <div className={styles.userIcon}>👤</div>
                            )}

                            <div className={styles.messageContent}>
                                <div className={styles.timestamp}>{msg.timestamp}</div>
                                <div className={styles.message}>
                                    <p>{msg.text}</p>
                                    {msg.details && (
                                        <div className={styles.details}>
                                            <div className={styles.detailItem}>
                                                <strong>📌 {msg.details.medication}</strong>
                                                <div className={styles.detailRow}>
                                                    <span>📋 Dosage:</span> {msg.details.dosage}
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span>⏰ Timing:</span> {msg.details.timing}
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span>⚠️ Interaction:</span> {msg.details.interaction}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {msg.disclaimer && (
                                        <div className={styles.disclaimer}>
                                            <AlertCircle size={16} />
                                            <div>
                                                <strong>MEDICAL DISCLAIMER</strong>
                                                <p>This information is provided for general guidance only and is based on your records. Always follow your doctor's specific advice. If you experience dizziness or a persistent dry cough, contact Dr. Martin's office immediately.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div className={styles.quickActions}>
                    <button type="button" className={styles.quickBtn} onClick={() => handleQuickAction('rdv')}>
                        📋 {t('chatbot.restartWithRdv')}
                    </button>
                    <button type="button" className={styles.quickBtn} onClick={() => handleQuickAction('rx')}>
                        💊 {t('chatbot.myPrescriptions')}
                    </button>
                    <button type="button" className={styles.quickBtn} onClick={() => handleQuickAction('lab')}>
                        📊 {t('chatbot.myResults')}
                    </button>
                </div>

                {/* Input area */}
                <div className={styles.inputArea}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,application/pdf"
                        multiple
                        className={styles.visuallyHidden}
                        aria-hidden
                        tabIndex={-1}
                        onChange={handleChatFiles}
                    />
                    <div className={styles.inputRow}>
                        <button
                            type="button"
                            className={styles.inputBtn}
                            aria-label={t('chatbot.attachFile')}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} />
                        </button>
                        <button
                            type="button"
                            className={styles.inputBtn}
                            aria-label={t('chatbot.scanDocument')}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Scan size={16} />
                        </button>
                        <button
                            type="button"
                            className={`${styles.inputBtn} ${isListening ? styles.micBtnActive : ''}`}
                            aria-label={t('chatbot.voiceInput')}
                            onClick={() => (isListening ? stopVoiceInput() : startVoiceInput())}
                        >
                            <Mic size={16} />
                        </button>
                        <input
                            type="text"
                            placeholder={t('chatbot.searchPlaceholder')}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className={styles.input}
                        />
                        <button
                            className={styles.sendBtn}
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className={styles.securityFooter}>
                        <Shield size={12} /> {t('chatbot.encrypted')} &nbsp; • &nbsp; <Shield size={12} /> {t('chatbot.hipaa')}
                    </div>
                </div>
            </div>
        </div>

            {/* ── Right Panel ── */}
            <aside className={styles.rightPanel}>
                {/* Frequent Topics */}
                <div className={styles.section}>
                    <h3 className={styles.rightTitle}>{t('chatbot.frequentTopics')}</h3>
                    <p className={styles.rightSubtitle}>{t('chatbot.howCanIHelp')}</p>
                    <div className={styles.topicsList}>
                        {frequentTopics.map((topic, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={styles.topicBtn}
                                onClick={() => handleTopicClick(topic.titleKey)}
                            >
                                <span className={styles.topicIcon}>{topic.icon}</span>
                                <span className={styles.topicText}>{t(topic.titleKey)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Help */}
                <div className={styles.section}>
                    <div className={styles.helpCard}>
                        <PhoneCall size={24} />
                        <h3>{t('chatbot.needUrgentHelp')}</h3>
                        <p>{t('chatbot.urgentHelpDesc')}</p>
                        <a className={styles.btnContact} href={CLINIC_TEL}>
                            {t('chatbot.contactClinic')}
                        </a>
                    </div>
                </div>
            </aside>
        </div>
    )
}
