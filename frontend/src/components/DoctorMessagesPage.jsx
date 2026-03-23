import { useState } from 'react'
import {
    Search, MoreVertical, Edit, Phone,
    Video, Paperclip, Send, Smile,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
import DoctorSidebar from './DoctorSidebar'
import styles from './DoctorMessagesPage.module.css'

export default function DoctorMessagesPage({ user, onNavigate, onLogout }) {
    const { t } = useLanguage()
    const conversations = []
    const messages = []
    const [activeConv, setActiveConv] = useState(null)

    return (
        <div className={styles.layout}>
            <DoctorSidebar activeId="messages" onNavigate={onNavigate} onLogout={onLogout} />

            {/* ── Main content (Split view) ── */}
            <main className={styles.main}>

                {/* ── Chat List (Left) ── */}
                <div className={styles.chatList}>
                    <div className={styles.listHeader}>
                        <h2>{t('doctor.messages')}</h2>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <LanguageSwitcher />
                            <button className={styles.btnNew}><Edit size={16} /></button>
                        </div>
                    </div>

                    <div className={styles.searchBox}>
                        <Search size={16} color="#9CA3AF" />
                        <input type="text" placeholder="Rechercher une conversation..." className={styles.searchInput} />
                    </div>

                    <div className={styles.listTabs}>
                        <button className={`${styles.listTab} ${styles.listTabActive}`}>Tous</button>
                        <button className={styles.listTab}>Non lus (3)</button>
                        <button className={styles.listTab}>Cercle de Soins</button>
                    </div>

                    <div className={styles.convList}>
                        {conversations.map(c => (
                            <div
                                key={c.id}
                                className={`${styles.convItem} ${c.id === activeConv ? styles.convActive : ''}`}
                                onClick={() => setActiveConv(c.id)}
                            >
                                <div className={styles.avatarWrap}>
                                    <div className={styles.avatar} style={{ background: c.color }}>
                                        {c.avatar}
                                    </div>
                                    {c.unread > 0 && <span className={styles.unreadDot} />}
                                </div>
                                <div className={styles.convContent}>
                                    <div className={styles.convTop}>
                                        <span className={`${styles.convName} ${c.unread > 0 ? styles.convNameUnread : ''}`}>{c.name}</span>
                                        <span className={styles.convTime}>{c.time}</span>
                                    </div>
                                    <p className={`${styles.convPreview} ${c.unread > 0 ? styles.convPreviewUnread : ''}`}>{c.preview}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Chat Area (Right) ── */}
                <div className={styles.chatArea}>

                    {/* Chat Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.chatHeaderLeft}>
                            <div className={styles.chatHeaderAvatar} style={{ background: '#8B5CF6' }}>SM</div>
                            <div>
                                <h3 className={styles.chatHeaderName}>Dr. Sarah Miller</h3>
                                <p className={styles.chatHeaderStatus}>En ligne • Cardiologue</p>
                            </div>
                        </div>
                        <div className={styles.chatHeaderActions}>
                            <button className={styles.actionBtn}><Phone size={18} /></button>
                            <button className={styles.actionBtn}><Video size={18} /></button>
                            <div className={styles.divider} />
                            <button className={styles.actionBtn}><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages Window */}
                    <div className={styles.msgWindow}>
                        <div className={styles.dateDivider}>Aujourd'hui</div>

                        {messages.map(m => (
                            <div key={m.id} className={`${styles.msgRow} ${m.sender === 'me' ? styles.msgRowMe : ''}`}>
                                {m.sender === 'them' && <div className={styles.msgAvatar} style={{ background: '#8B5CF6' }}>SM</div>}
                                <div className={`${styles.msgBubble} ${m.sender === 'me' ? styles.msgBubbleMe : styles.msgBubbleThem}`}>
                                    <p className={styles.msgText}>{m.text}</p>
                                    <span className={`${styles.msgTimeIndicator} ${m.sender === 'me' ? styles.msgTimeMe : ''}`}>{m.time}</span>
                                </div>
                            </div>
                        ))}

                        <div className={styles.typingIndicator}>
                            Sarah est en train d'écrire<span className={styles.dots}>...</span>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className={styles.inputArea}>
                        <button className={styles.attachBtn}><Paperclip size={20} /></button>
                        <div className={styles.inputWrapper}>
                            <input type="text" placeholder="Écrivez votre message..." className={styles.textInput} />
                            <button className={styles.smileBtn}><Smile size={20} /></button>
                        </div>
                        <button className={styles.sendBtn}><Send size={18} /></button>
                    </div>

                </div>

            </main>
        </div>
    )
}
