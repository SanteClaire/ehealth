import { useState } from 'react'
import {
    LayoutDashboard, Users, Calendar, MessageSquare, BarChart2,
    Settings, LogOut, Search, MoreVertical, Edit, Phone,
    Video, Paperclip, Send, Smile, User
} from 'lucide-react'
import styles from './DoctorMessagesPage.module.css'
import logo from '../assets/logo2.png'

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'dashboard' },
    { icon: Users, label: 'Mes Patients', id: 'patients' },
    { icon: Calendar, label: 'Planning', id: 'planning' },
    { icon: MessageSquare, label: 'Messages', id: 'messages', active: true },
    { icon: BarChart2, label: 'Rapports', id: 'reports' },
]

const conversations = [
    { id: 1, name: 'Dr. Sarah Miller', unread: 2, time: '10:45', preview: 'Avez-vous pu voir les derniers résultats de...', type: 'doctor', avatar: 'SM', color: '#8B5CF6' },
    { id: 2, name: 'Jean Dupont', unread: 0, time: 'Hier', preview: 'Merci pour le compte-rendu, je passe à la ph...', type: 'patient', avatar: 'JD', color: '#10B981' },
    { id: 3, name: 'Dr. Claude Bernard', unread: 0, time: 'Hier', preview: 'Je valide la prescription pour...', type: 'doctor', avatar: 'CB', color: '#3B82F6' },
    { id: 4, name: 'Alerte Système', unread: 1, time: 'Lun', preview: 'Rappel : votre certification arrive à échéance...', type: 'system', avatar: '⚙️', color: '#EF4444' },
]

const messages = [
    { id: 1, sender: 'them', text: 'Bonjour, avez-vous pu voir les derniers résultats de biochimie de notre patient commun, Mr Leblanc ?', time: '10:42' },
    { id: 2, sender: 'me', text: 'Bonjour Sarah. Oui, je viens de les recevoir. J\'allais justement vous écrire.', time: '10:44' },
    { id: 3, sender: 'them', text: 'Avez-vous remarqué la légère hausse de créatinine ? Pensez-vous qu\'on doive ajuster le dosage ?', time: '10:45' },
]

export default function DoctorMessagesPage({ onNavigate, onLogout }) {
    const [activeConv, setActiveConv] = useState(1)

    return (
        <div className={styles.layout}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brand}>
                        <img src={logo} alt="SantéClaire" className={styles.logo} />
                        <span className={styles.brandSub}>ESPACE MÉDECIN</span>
                    </div>
                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate && onNavigate(item.id)}
                                    className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>
                <div className={styles.sidebarBottom}>
                    <button className={styles.navItem} onClick={() => onNavigate && onNavigate('settings')}>
                        <Settings size={18} /> Paramètres
                    </button>
                    <button className={styles.logoutBtn} onClick={onLogout}>
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main content (Split view) ── */}
            <main className={styles.main}>

                {/* ── Chat List (Left) ── */}
                <div className={styles.chatList}>
                    <div className={styles.listHeader}>
                        <h2>Messages</h2>
                        <button className={styles.btnNew}><Edit size={16} /></button>
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
