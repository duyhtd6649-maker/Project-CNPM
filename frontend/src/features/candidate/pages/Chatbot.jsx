import React from 'react';
import '../components/Chatbot.css';
import CandidateNavbar from '../components/CandidateNavbar';

const Chatbot = () => {
    const handleInput = (e) => {
        e.target.style.height = '';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
        <div className="chatbot-page-container">
            <CandidateNavbar />

            <div className="chatbot-main-layout">
                <aside className="chatbot-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">History</h2>
                        <button className="icon-btn" title="Start new chat">
                            <span className="material-icons-outlined">add_comment</span>
                        </button>
                    </div>
                    <div className="sidebar-search">
                        <div className="search-input-wrapper">
                            <span className="material-icons-outlined search-icon">search</span>
                            <input
                                className="search-input"
                                placeholder="Search conversations..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="history-list custom-scrollbar">
                        <div className="history-section-title">Today</div>
                        <button className="history-item active">
                            <div className="history-icon">
                                <span className="material-icons-outlined">chat_bubble_outline</span>
                            </div>
                            <div className="history-info">
                                <h3 className="history-title">CV Optimization</h3>
                                <p className="history-preview">I can analyze your current summary...</p>
                            </div>
                        </button>
                        <button className="history-item">
                            <div className="history-icon">
                                <span className="material-icons-outlined">chat_bubble_outline</span>
                            </div>
                            <div className="history-info">
                                <h3 className="history-title">Interview Prep: Java</h3>
                                <p className="history-preview">What are the common questions for...</p>
                            </div>
                        </button>
                        <div className="history-section-title">Yesterday</div>
                        <button className="history-item">
                            <div className="history-icon">
                                <span className="material-icons-outlined">chat_bubble_outline</span>
                            </div>
                            <div className="history-info">
                                <h3 className="history-title">Salary Trends 2024</h3>
                                <p className="history-preview">Can you show me the graph for...</p>
                            </div>
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
                                <span className="material-icons-round">smart_toy</span>
                                <div className="status-dot"></div>
                            </div>
                            <div>
                                <h1 className="bot-name">LinPJ</h1>
                                <span className="bot-role">UTH AI Assistant</span>
                            </div>
                        </div>
                        <div className="chat-header-actions">
                            <button className="icon-btn" title="Clear Chat">
                                <span className="material-icons-outlined">delete_outline</span>
                            </button>
                            <button className="icon-btn" title="Export">
                                <span className="material-icons-outlined">download</span>
                            </button>
                            <button className="icon-btn" title="More options">
                                <span className="material-icons-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages custom-scrollbar">
                        <div className="time-divider">
                            <span>Today, 9:41 AM</span>
                        </div>
                        <div className="message-row ai">
                            <div className="avatar-small">
                                <span className="material-icons-round">smart_toy</span>
                            </div>
                            <div className="message-content-wrapper">
                                <span className="sender-name">LinPJ</span>
                                <div className="message-bubble ai-bubble">
                                    <p>Hello! I'm LinPJ, your personal career assistant at UTH. 👋</p>
                                    <p className="mt-2">I can help you with:</p>
                                    <ul className="message-list">
                                        <li>Reviewing your CV and Cover Letter</li>
                                        <li>Mock interviews for specific job roles</li>
                                        <li>Searching for jobs matching your skills</li>
                                    </ul>
                                    <p className="mt-2">How can I assist you today?</p>
                                </div>
                            </div>
                        </div>
                        <div className="message-row user">
                            <div className="message-content-wrapper end">
                                <div className="message-bubble user-bubble">
                                    <p>Can you help me improve my CV summary? I'm applying for a Frontend Developer role.</p>
                                </div>
                                <span className="read-receipt">Read 9:43 AM</span>
                            </div>
                            <div className="avatar-small user-avatar">
                                <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzYWTJfajfpZ9kytsjNGkD5qmtx-S1MYbhWVkN0Cv5iUhvqKkbZS2mmuCGS7JLXJ3pslm4lFTGwz039ewINB9YiZap4hmWuLj_Nx-ApGwbD7O3auqT9EHXAqn17tdV-dnmnAK3n6MnlCgaKpPkXf9ujy9BwYVFYCGYLLhOAs_1Yr931aATyP4swdffPn1XfK9xVLVDjXleokShhKO0Dx1b4v3pP1olzwa7SDYa4tGfIZ7BQUKymdBlVR0a7g-eATIq8tVFOcrFu1xG" />
                            </div>
                        </div>
                        <div className="message-row ai">
                            <div className="avatar-small">
                                <span className="material-icons-round">smart_toy</span>
                            </div>
                            <div className="message-content-wrapper">
                                <span className="sender-name">LinPJ</span>
                                <div className="message-bubble ai-bubble">
                                    <p>Certainly! To create a compelling summary for a Frontend Developer role, we should focus on your key technologies (like React, Vue, or Angular), your experience level, and a notable achievement.</p>
                                    <p className="mt-3">Please paste your current summary below, or upload your CV PDF, and I'll suggest improvements tailored to the UTH job market standards.</p>
                                </div>
                                <div className="suggestion-chips">
                                    <button className="chip">Upload CV</button>
                                    <button className="chip">Use a Template</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat-input-area">
                        <div className="input-container">
                            <textarea
                                className="chat-textarea"
                                onInput={handleInput}
                                placeholder="Message LinPJ..."
                                rows="1"
                            ></textarea>
                            <div className="input-actions-row">
                                <div className="left-actions">
                                    <button className="icon-btn-small" title="Upload file">
                                        <span className="material-icons-outlined">attach_file</span>
                                    </button>
                                    <button className="icon-btn-small" title="Voice input">
                                        <span className="material-icons-outlined">mic_none</span>
                                    </button>
                                    <button className="icon-btn-small" title="Insert Emoji">
                                        <span className="material-icons-outlined">sentiment_satisfied</span>
                                    </button>
                                </div>
                                <div className="right-actions">
                                    <span className="enter-hint">Press Enter to send</span>
                                    <button className="send-btn">
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