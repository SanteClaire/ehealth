import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, Paperclip, FileText, ChevronRight, MessageCircle } from 'lucide-react';
import styles from './PatientChatbot.module.css';

// Messages mockups pour simuler une conversation
const initialMessages = [
    {
        id: 1,
        sender: 'bot',
        text: "Bonjour ! Je suis l'assistant SantéClaire. Je suis là pour vous aider à comprendre vos documents médicaux et à préparer votre prochaine consultation. Comment puis-je vous aider aujourd'hui ?",
        time: '14:30',
        suggestions: ["Comprendre mes derniers résultats d'analyse", "Préparer ma consultation avec le Dr. Dupont", "Classer mes nouveaux documents"]
    }
];

export default function PatientChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Drag personnalisé
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0 });
    const messagesEndRef = useRef(null);

    const handleMouseDown = (e) => {
        if (isOpen) return; // Pas de drag quand c'est ouvert
        dragRef.current.isDragging = true;
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.lastX = position.x;
        dragRef.current.lastY = position.y;
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!dragRef.current.isDragging) return;
        setIsDragging(true);

        let deltaX = e.clientX - dragRef.current.startX;
        let deltaY = e.clientY - dragRef.current.startY;

        let newX = dragRef.current.lastX + deltaX;
        let newY = dragRef.current.lastY + deltaY;

        // Dimensions du bouton/chat
        const rect = dragRef.current.element.getBoundingClientRect();

        // Limites de l'écran (on calcule par rapport à la position initiale "bottom: 2rem, right: 2rem" du CSS)
        // newX = 0 et newY = 0 correspond à la position par défaut (en bas à droite).
        // On empêche de sortir de l'affichage.
        const maxLeft = - (window.innerWidth - rect.width - 32); // -32px car 2rem = 32px de marge à droite
        const maxTop = - (window.innerHeight - rect.height - 32);

        if (newX < maxLeft) newX = maxLeft;
        if (newX > 32) newX = 32; // Autoriser un peu de marge vers la droite
        if (newY < maxTop) newY = maxTop;
        if (newY > 32) newY = 32;

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        dragRef.current.isDragging = false;
        setTimeout(() => setIsDragging(false), 50);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const openChat = () => {
        if (!isOpen && !isDragging) {
            setIsOpen(true);
            setPosition({ x: 0, y: 0 }); // Réinitialiser au coin en bas à droite
        }
    };

    // Auto-scroll vers le dernier message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text) => {
        if (!text.trim()) return;

        const newUserMsg = {
            id: Date.now(),
            sender: 'user',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulation de la réponse de l'IA (délai)
        setTimeout(() => {
            const aiResponse = generateAIResponse(text);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000); // Entre 1.5s et 2.5s
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(inputValue);
        }
    };

    const handleSuggestionClick = (suggestionText) => {
        handleSend(suggestionText);
    };

    // Logique très basique pour simuler une IA "intelligente" selon les mots clés
    const generateAIResponse = (userText) => {
        const text = userText.toLowerCase();
        let responseText = "Je comprends. Pouvez-vous m'en dire plus pour que je puisse mieux vous orienter ?";
        let attachedDoc = null;

        if (text.includes("analyse") || text.includes("résultat") || text.includes("sang")) {
            responseText = "J'ai analysé votre dernier bilan sanguin ('Bilan_Sanguin_Octobre.pdf'). Les niveaux de cholestérol LDL sont légèrement au-dessus de la normale (1.6 g/L contre < 1.1 g/L suggéré), mais le reste (glycémie, fer, etc.) est parfait. Il serait bien d'en discuter avec le Dr. Dupont lors de votre prochain rendez-vous.";
            attachedDoc = { name: 'Bilan_Sanguin_Octobre.pdf', type: 'Analyser' };
        } else if (text.includes("préparer") || text.includes("consultation") || text.includes("rendez-vous")) {
            responseText = "Très bien. Pour le rendez-vous de suivi avec le Dr. Dupont, je suggère de préparer les questions suivantes par rapport à vos récents symptômes :\n\n- Faut-il ajuster le dosage de mon traitement pour la tension ?\n- Que signifient les légers pics de fatigue en fin de journée ?\n\nVoulez-vous que j'ajoute ces points dans une note partagée avec le médecin pour la consultation ?";
        } else if (text.includes("classer") || text.includes("trier")) {
            responseText = "Je peux examiner les documents non classés dans votre espace de stockage. J'ai détecté 2 nouvelles ordonnances et 1 compte-rendu d'imagerie. Souhaitez-vous que je les range automatiquement dans les dossiers correspondants ?";
        } else if (text.includes("oui") || text.includes("d'accord") || text.includes("merci")) {
            responseText = "C'est noté ! Je m'en occupe tout de suite. Y a-t-il autre chose avec quoi je puisse vous aider ?";
        }

        return {
            id: Date.now() + 1,
            sender: 'bot',
            text: responseText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachment: attachedDoc
        };
    };

    // Wrapper avec Drag custom
    return (
        <div
            ref={(el) => { if (el) dragRef.current.element = el; }} // pour obtenir les dimensions
            className={`${styles.chatbotContainer} ${isOpen ? styles.open : styles.closed}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseDown={handleMouseDown}
            onClick={openChat}
        >

            {/* Bouton quand fermé */}
            <div className={`${styles.btnContent} ${isOpen ? styles.hidden : ''}`}>
                <span style={{ fontSize: '32px', display: 'flex', userSelect: 'none' }}>👨‍⚕️</span>
            </div>

            {/* Contenu du Chat */}
            <div className={`${styles.chatContent} ${!isOpen ? styles.hidden : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.botIconWrapper}>
                            <Bot size={22} color="#fff" />
                        </div>
                        <div>
                            <h2 className={styles.title}>Assistant Médico-IA</h2>
                            <p className={styles.subtitle}>SantéClaire • Toujours à votre écoute</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} aria-label="Fermer le chat">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>

                    {/* Date Divider (Mock) */}
                    <div className={styles.dateDivider}>Aujourd'hui</div>

                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.messageRowUser : styles.messageRowBot}`}>

                            {msg.sender === 'bot' && (
                                <div className={styles.avatarBot}><Bot size={16} color="#fff" /></div>
                            )}

                            <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                                {/* Gérer les sauts de ligne dans le texte de l'IA */}
                                {msg.text.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        {i !== msg.text.split('\n').length - 1 && <br />}
                                    </span>
                                ))}

                                {/* Pièce jointe optionnelle (Document IA) */}
                                {msg.attachment && (
                                    <div className={styles.attachmentCard}>
                                        <FileText size={18} className={styles.attachmentIcon} />
                                        <div className={styles.attachmentInfo}>
                                            <span className={styles.attachmentName}>{msg.attachment.name}</span>
                                            <span className={styles.attachmentAction}>{msg.attachment.type}</span>
                                        </div>
                                    </div>
                                )}

                                <span className={`${styles.messageTime} ${msg.sender === 'user' ? styles.timeUser : styles.timeBot}`}>
                                    {msg.time}
                                </span>
                            </div>

                            {msg.sender === 'user' && (
                                <div className={styles.avatarUser}><User size={16} color="#fff" /></div>
                            )}
                        </div>
                    ))}

                    {/* Suggestions (affichées uniquement si c'est le dernier message et qu'il vient du bot) */}
                    {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].suggestions && !isTyping && (
                        <div className={styles.suggestionsContainer}>
                            {messages[messages.length - 1].suggestions.map((sug, i) => (
                                <button key={i} className={styles.suggestionBtn} onClick={() => handleSuggestionClick(sug)}>
                                    {sug}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Indicateur de frappe */}
                    {isTyping && (
                        <div className={`${styles.messageRow} ${styles.messageRowBot}`}>
                            <div className={styles.avatarBot}><Bot size={16} color="#fff" /></div>
                            <div className={`${styles.messageBubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
                                <span className={styles.typingDot}></span>
                                <span className={styles.typingDot}></span>
                                <span className={styles.typingDot}></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <button className={styles.attachBtn} title="Joindre un document">
                        <Paperclip size={20} />
                    </button>
                    <div className={styles.inputWrapper}>
                        <textarea
                            className={styles.textInput}
                            placeholder="Posez-moi votre question ou décrivez votre besoin..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                    </div>
                    <button
                        className={`${styles.sendBtn} ${inputValue.trim() ? styles.sendBtnActive : ''}`}
                        onClick={() => handleSend(inputValue)}
                        disabled={!inputValue.trim()}
                        title="Envoyer"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div> {/* fin chatContent */}
        </div>
    );
}
