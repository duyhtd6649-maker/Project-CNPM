import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/HomepageCandidates.css';
import '../components/Chatbot.css';
import CandidateNavbar from '../components/CandidateNavbar';

const Chatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: `Hello! I'm LinPJ, your personal career assistant at UTH. 👋

I can help you with:
• Reviewing your CV and Cover Letter (upload PDF file)
• Mock interviews for specific job roles
• Searching for jobs matching your skills
• Career advice and guidance

How can I assist you today?`
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInput = (e) => {
        e.target.style.height = '';
        e.target.style.height = e.target.scrollHeight + 'px';
        setInputValue(e.target.value);
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Accept PDF and common document formats
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (allowedTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                setSelectedFile(file);
            } else {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: '⚠️ Please upload a PDF or Word document (.pdf, .doc, .docx)'
                }]);
            }
        }
    };

    // Remove selected file
    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open file picker
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const sendMessage = async () => {
        if ((!inputValue.trim() && !selectedFile) || isLoading) return;

        const userMessage = inputValue.trim();
        const fileToSend = selectedFile;
        setInputValue('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = '';
        }

        // Add user message to chat
        const userContent = fileToSend
            ? `${userMessage ? userMessage + '\n\n' : ''}📎 Attached: ${fileToSend.name}`
            : userMessage;
        setMessages(prev => [...prev, { role: 'user', content: userContent }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('access_token');

            // If file is attached, use CV analyzer API
            if (fileToSend) {
                const formData = new FormData();
                formData.append('file', fileToSend);
                formData.append('targetjob', userMessage || 'General Career');

                const response = await fetch('http://127.0.0.1:8000/api/cv/analyzer/', {
                    method: 'POST',
                    headers: {
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();

                    // Format CV analysis response
                    let aiResponse = '📄 **CV Analysis Complete!**\n\n';

                    if (data.score !== undefined) {
                        aiResponse += `🎯 **Overall Score:** ${data.score}/100\n\n`;
                    }

                    if (data.strengths && data.strengths.length > 0) {
                        aiResponse += '💪 **Strengths:**\n' + data.strengths.map(s => `• ${s}`).join('\n') + '\n\n';
                    }

                    if (data.weaknesses && data.weaknesses.length > 0) {
                        aiResponse += '⚠️ **Areas to Improve:**\n' + data.weaknesses.map(w => `• ${w}`).join('\n') + '\n\n';
                    }

                    if (data.suggestions && data.suggestions.length > 0) {
                        aiResponse += '💡 **Suggestions:**\n' + data.suggestions.map(s => `• ${s}`).join('\n') + '\n\n';
                    }

                    if (data.skills && data.skills.length > 0) {
                        aiResponse += '🛠️ **Skills Detected:**\n' + data.skills.map(s => `• ${s}`).join('\n');
                    }

                    // If no structured data, show raw response
                    if (aiResponse === '📄 **CV Analysis Complete!**\n\n') {
                        aiResponse = '📄 **CV Analysis Result:**\n\n' + (typeof data === 'string' ? data : JSON.stringify(data, null, 2));
                    }

                    setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        content: `❌ Error analyzing CV. Please try again.\n\nError: ${errorData.error || errorData.detail || response.statusText}`
                    }]);
                }
            } else {
                // Regular chat message - use career coach API
                const response = await fetch('http://127.0.0.1:8000/api/ai/career/coach', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify({ question: userMessage })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Format AI response
                    let aiResponse = '';

                    if (data.overview && data.overview.length > 0) {
                        aiResponse += '📋 **Overview:**\n' + data.overview.join('\n') + '\n\n';
                    }

                    if (data.expectedCareer && data.expectedCareer.length > 0) {
                        aiResponse += '🎯 **Career Paths:**\n' + data.expectedCareer.map(c => `• ${c}`).join('\n') + '\n\n';
                    }

                    if (data.skills && data.skills.length > 0) {
                        aiResponse += '💡 **Key Skills:**\n' + data.skills.map(s => `• ${s}`).join('\n') + '\n\n';
                    }

                    if (data.learningPaths && data.learningPaths.length > 0) {
                        aiResponse += '📚 **Learning Paths:**\n' + data.learningPaths.map(l => `• ${l}`).join('\n');
                    }

                    // If no structured data, use raw response
                    if (!aiResponse.trim()) {
                        aiResponse = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                    }

                    setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        content: `❌ Sorry, there was an error processing your request. Please try again.\n\nError: ${errorData.detail || response.statusText}`
                    }]);
                }
            }
        } catch (error) {
            console.error('Chatbot API Error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `❌ Connection error. Please check if the server is running and try again.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([{
            role: 'ai',
            content: `Chat cleared! 🧹\n\nHow can I assist you today?`
        }]);
    };

    return (
        <div className="hp-container">
            <CandidateNavbar />

            <div className="chatbot-main-layout">
                <aside className="chatbot-sidebar">
                    <div className="sidebar-analyze-nav">
                        <button className="analyze-cv-circle-btn" onClick={() => navigate('/analyze-cv')}>
                            <div className="circle-icon-2">2</div>
                            <span className="analyze-text">Analyze CV</span>
                        </button>
                    </div>
                    <div className="sidebar-footer">
                        <button className="settings-btn">
                            <span className="material-icons-outlined">settings</span>
                            Settings
                        </button>
                    </div>
                </aside>

                <section className="chatbot-area">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="bot-avatar-header">
                                <img src="/assets/chatbot-avatar.jpg" alt="LinPJ" className="bot-avatar-img" />
                                <div className="status-dot"></div>
                            </div>
                            <div>
                                <h1 className="bot-name">LinPJ</h1>
                                <span className="bot-role">UTH AI Career Coach</span>
                            </div>
                        </div>
                        <div className="chat-header-actions">
                            <button className="icon-btn" title="Clear Chat" onClick={clearChat}>
                                <span className="material-icons-outlined">delete_outline</span>
                            </button>
                            <button className="icon-btn" title="Export">
                                <span className="material-icons-outlined">download</span>
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-row ${msg.role}`}>
                                {msg.role === 'ai' ? (
                                    <>
                                        <div className="avatar-small">
                                            <img src="/assets/chatbot-avatar.jpg" alt="LinPJ" className="bot-avatar-img" />
                                        </div>
                                        <div className="message-content-wrapper">
                                            <span className="sender-name">LinPJ</span>
                                            <div className="message-bubble ai-bubble">
                                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="message-content-wrapper end">
                                            <div className="message-bubble user-bubble">
                                                <p>{msg.content}</p>
                                            </div>
                                        </div>
                                        <div className="avatar-small user-avatar">
                                            <span className="material-icons-round">person</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message-row ai">
                                <div className="avatar-small">
                                    <img src="/assets/chatbot-avatar.jpg" alt="LinPJ" className="bot-avatar-img" />
                                </div>
                                <div className="message-content-wrapper">
                                    <span className="sender-name">LinPJ</span>
                                    <div className="message-bubble ai-bubble typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx"
                            style={{ display: 'none' }}
                        />

                        {/* Selected file preview */}
                        {selectedFile && (
                            <div className="selected-file-preview" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '8px 8px 0 0',
                                borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
                            }}>
                                <span className="material-icons-outlined" style={{ color: '#6366f1', fontSize: '20px' }}>description</span>
                                <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-main)' }}>{selectedFile.name}</span>
                                <button
                                    onClick={removeSelectedFile}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#dc2626'
                                    }}
                                    title="Remove file"
                                >
                                    <span className="material-icons-outlined" style={{ fontSize: '18px' }}>close</span>
                                </button>
                            </div>
                        )}

                        <div className="input-container" style={{ borderRadius: selectedFile ? '0 0 12px 12px' : '12px' }}>
                            <textarea
                                ref={textareaRef}
                                className="chat-textarea"
                                onInput={handleInput}
                                onKeyPress={handleKeyPress}
                                placeholder={selectedFile ? "Add a message (optional) or describe target job..." : "Ask me about careers, CV tips, interview prep..."}
                                rows="1"
                                value={inputValue}
                                disabled={isLoading}
                            ></textarea>
                            <div className="input-actions-row">
                                <div className="left-actions">
                                    <button
                                        className="icon-btn-small"
                                        title="Upload CV (PDF, DOC)"
                                        onClick={openFilePicker}
                                        style={{ color: selectedFile ? '#6366f1' : undefined }}
                                    >
                                        <span className="material-icons-outlined">attach_file</span>
                                    </button>
                                </div>
                                <div className="right-actions">
                                    <span className="enter-hint">Press Enter to send</span>
                                    <button
                                        className="send-btn"
                                        onClick={sendMessage}
                                        disabled={isLoading || (!inputValue.trim() && !selectedFile)}
                                    >
                                        <span className="material-icons-round">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="disclaimer">
                            <p>LinPJ can make mistakes. Consider checking important information.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Chatbot;