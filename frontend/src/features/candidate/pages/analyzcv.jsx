import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Copy, Edit, RefreshCw, Download, CheckCircle, XCircle, AlertTriangle,
    Upload, FileText, Loader
} from 'lucide-react';
import "../components/HomepageCandidates.css";
import "./analyzcv.css";
import CandidateNavbar from '../components/CandidateNavbar';

const CVAnalyzer = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // State management
    const [selectedFile, setSelectedFile] = useState(null);
    const [targetJob, setTargetJob] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Vui lòng chọn file PDF');
                setSelectedFile(null);
            }
        }
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Vui lòng chọn file PDF');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Open file picker
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // Clear selected file
    const clearFile = () => {
        setSelectedFile(null);
        setAnalysisResult(null);
        setResumeText('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Analyze CV - Call API
    const analyzeCV = async () => {
        if (!selectedFile) {
            setError('Vui lòng chọn file CV');
            return;
        }
        if (!targetJob.trim()) {
            setError('Vui lòng nhập vị trí công việc mục tiêu');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('targetjob', targetJob);

            const response = await fetch('http://127.0.0.1:8000/api/cv/analyzer/', {
                method: 'POST',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
                // Set resume text if available
                if (data.resume_text || data.cv_text) {
                    setResumeText(data.resume_text || data.cv_text);
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.error || errorData.detail || 'Lỗi phân tích CV. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('CV Analysis Error:', err);
            setError('Lỗi kết nối. Vui lòng kiểm tra server và thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // Copy text to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(resumeText);
    };

    // Calculate score display
    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const score = analysisResult?.score || 0;
    const strengths = analysisResult?.strengths || [];
    const weaknesses = analysisResult?.weaknesses || [];
    const suggestions = analysisResult?.suggestions || [];
    const skills = analysisResult?.skills || [];

    return (
        <div className="hp-container analyzer-page">
            <CandidateNavbar />

            <main className="analyzer-main-content">
                <div className="analyzer-container">
                    {/* Breadcrumb */}
                    <nav className="analyzer-breadcrumb">
                        <span onClick={() => navigate('/homepage')} className="breadcrumb-link">Home</span>
                        <span className="breadcrumb-sep">/</span>
                        <span onClick={() => navigate('/chatbot')} className="breadcrumb-link">AI Assistant</span>
                        <span className="breadcrumb-sep">/</span>
                        <span className="breadcrumb-current">CV Analyzer</span>
                    </nav>

                    {/* Title Section */}
                    <div className="analyzer-page-header">
                        <div className="title-row">
                            <h1>CV Analysis</h1>
                            {analysisResult && <span className="status-badge live">Analyzed</span>}
                        </div>
                        <p className="subtitle">Upload your CV and get AI-powered feedback on ATS score, keyword matches, and suggestions.</p>
                    </div>

                    <div className="analyzer-grid">
                        {/* Left Column: Input Fields */}
                        <div className="analyzer-col-left">
                            <section className="analyzer-input-card">
                                {/* PDF Upload Section */}
                                <div className="card-header">
                                    <div className="header-text">
                                        <h3>Upload CV (PDF)</h3>
                                        <p>Hỗ trợ file PDF lớn hơn 20MB</p>
                                    </div>
                                    {selectedFile && (
                                        <button className="btn-text" onClick={clearFile}>Xóa file</button>
                                    )}
                                </div>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                />

                                {/* Drop zone */}
                                <div
                                    className={`upload-dropzone ${selectedFile ? 'has-file' : ''}`}
                                    onClick={openFilePicker}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    {selectedFile ? (
                                        <div className="file-selected">
                                            <FileText size={40} color="#4b49ac" />
                                            <div className="file-info">
                                                <p className="file-name">{selectedFile.name}</p>
                                                <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-prompt">
                                            <Upload size={40} color="#9ca3af" />
                                            <p>Kéo thả file PDF vào đây hoặc click để chọn</p>
                                            <span className="upload-hint">Hỗ trợ file PDF không giới hạn dung lượng</span>
                                        </div>
                                    )}
                                </div>

                                <div className="divider"></div>

                                {/* Target Job Input */}
                                <div className="card-header">
                                    <div className="header-text">
                                        <h3>Target Job / Job Description</h3>
                                        <p>Nhập vị trí công việc hoặc paste JD để so sánh</p>
                                    </div>
                                    <button className="btn-text" onClick={() => setTargetJob('')}>Clear</button>
                                </div>
                                <textarea
                                    className="jd-textarea"
                                    placeholder="Ví dụ: Senior Python Developer, Product Manager, hoặc paste toàn bộ Job Description..."
                                    value={targetJob}
                                    onChange={(e) => setTargetJob(e.target.value)}
                                />

                                {/* Error message */}
                                {error && (
                                    <div className="error-message">
                                        <AlertTriangle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Analyze Button */}
                                <div className="btn-row">
                                    <button
                                        className="btn-update btn-analyze"
                                        onClick={analyzeCV}
                                        disabled={isLoading || !selectedFile}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader size={18} className="spin" />
                                                Đang phân tích...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw size={18} />
                                                Analyze CV
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Resume Text Display (if available from API) */}
                                {resumeText && (
                                    <>
                                        <div className="divider"></div>
                                        <div className="card-header">
                                            <div className="header-text">
                                                <h3>Resume Text</h3>
                                                <p>Extracted text from your uploaded CV</p>
                                            </div>
                                            <div className="icon-group">
                                                <button className="btn-icon" title="Copy" onClick={copyToClipboard}>
                                                    <Copy size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            className="resume-textarea"
                                            value={resumeText}
                                            readOnly
                                        />
                                    </>
                                )}
                            </section>

                            {/* Success Stories */}
                            <div className="stories-section">
                                <h3 className="section-title"><CheckCircle size={20} color="#22c55e" /> Success Stories</h3>
                                <div className="story-grid">
                                    <div className="story-card">
                                        <p className="quote">"I increased my interview rate by 3x after fixing errors ResumeAI found!"</p>
                                        <div className="user-info">
                                            <div className="user-avatar"></div>
                                            <div>
                                                <p className="user-name">Sarah J.</p>
                                                <p className="user-role">Product Manager @ TechFlow</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="story-card">
                                        <p className="quote">"The keyword analysis was a game changer. I finally got past the bots."</p>
                                        <div className="user-info">
                                            <div className="user-avatar"></div>
                                            <div>
                                                <p className="user-name">David L.</p>
                                                <p className="user-role">Software Engineer @ CloudSys</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Results Summary */}
                        <aside className="analyzer-col-right">
                            <div className="results-card sticky-card">
                                <div className="card-header-small">
                                    <h3>Results Summary</h3>
                                    <button className="btn-download"><Download size={16} /> PDF</button>
                                </div>

                                {/* ATS Score */}
                                <div className="ats-score-box">
                                    <div className="score-circle">
                                        <svg viewBox="0 0 36 36" className="circular-chart">
                                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            <path
                                                className="circle"
                                                style={{ stroke: getScoreColor(score) }}
                                                strokeDasharray={`${score}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                        <div className="score-text" style={{ color: getScoreColor(score) }}>{score}%</div>
                                    </div>
                                    <div className="score-label">
                                        <h4>ATS Score</h4>
                                        <p>
                                            {!analysisResult
                                                ? 'Upload CV và phân tích để xem điểm.'
                                                : score >= 80
                                                    ? 'Tuyệt vời! CV của bạn rất phù hợp.'
                                                    : score >= 60
                                                        ? 'Khá tốt! Có thể cải thiện thêm.'
                                                        : 'Cần cải thiện để tăng cơ hội.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Strengths */}
                                {strengths.length > 0 && (
                                    <div className="keyword-section">
                                        <div className="label-row">
                                            <h4>💪 Điểm mạnh</h4>
                                        </div>
                                        <div className="keyword-group">
                                            <div className="tag-cloud">
                                                {strengths.map((item, index) => (
                                                    <span key={index} className="tag match">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Weaknesses */}
                                {weaknesses.length > 0 && (
                                    <div className="keyword-section">
                                        <div className="label-row">
                                            <h4>⚠️ Cần cải thiện</h4>
                                        </div>
                                        <div className="keyword-group">
                                            <div className="tag-cloud">
                                                {weaknesses.map((item, index) => (
                                                    <span key={index} className="tag miss">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Skills Detected */}
                                {skills.length > 0 && (
                                    <div className="keyword-section">
                                        <div className="label-row">
                                            <h4>🛠️ Skills Detected</h4>
                                            <span>{skills.length} found</span>
                                        </div>
                                        <div className="keyword-group">
                                            <div className="tag-cloud">
                                                {skills.map((skill, index) => (
                                                    <span key={index} className="tag match">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="divider"></div>

                                {/* Suggestions */}
                                {suggestions.length > 0 && (
                                    <div className="formatting-section">
                                        <h4>💡 Suggestions</h4>
                                        {suggestions.map((suggestion, index) => (
                                            <div key={index} className="format-item success">
                                                <div className="format-icon"><CheckCircle size={18} /></div>
                                                <div className="format-text">
                                                    <p className="f-desc">{suggestion}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Default state when no analysis */}
                                {!analysisResult && (
                                    <div className="formatting-section">
                                        <h4>Formatting Check</h4>
                                        <div className="format-item">
                                            <div className="format-icon"><AlertTriangle size={18} color="#9ca3af" /></div>
                                            <div className="format-text">
                                                <p className="f-title">Chưa có dữ liệu</p>
                                                <p className="f-desc">Upload CV và click Analyze để xem kết quả.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CVAnalyzer;