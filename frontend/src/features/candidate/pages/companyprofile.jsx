import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Search, Home, Users, Briefcase, Bot, FileText,
    UserCircle, ChevronDown, CreditCard, Bell, LogOut,
    MapPin, Globe, Building2, Plus, Share2, Code, Rocket,
    ArrowLeft, ChevronRight, Loader
} from 'lucide-react';
import axiosClient from '../../../infrastructure/http/axiosClient';
import "../components/HomepageCandidates.css";
import "../components/companyprofile.css";

const CompanyProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data - hiển thị khi API fail
    const mockCompanies = {
        'mock-1': {
            id: 'mock-1',
            name: 'TechNova Solutions',
            description: 'TechNova Solutions is a leading financial technology company dedicated to democratizing access to global markets. We build cutting-edge platforms that empower individuals and businesses to participate in the global economy. Our team consists of passionate engineers, designers, and product managers working together to create innovative financial solutions.',
            website: 'technova.com',
            address: 'San Francisco, CA, USA',
            logo: null,
            tax_code: 'US-12345678'
        },
        'mock-2': {
            id: 'mock-2',
            name: 'GreenEarth Ventures',
            description: 'We help businesses reduce their carbon footprint through innovative recycling and renewable energy consulting. Join our mission for a greener planet. Our expertise spans solar energy, wind power, and sustainable business practices.',
            website: 'greenearth.io',
            address: 'Austin, TX, USA',
            logo: null,
            tax_code: 'US-87654321'
        },
        'mock-3': {
            id: 'mock-3',
            name: 'CloudScale Systems',
            description: 'Enterprise cloud infrastructure and DevOps solutions. Helping companies scale their applications globally with reliability, security, and performance. We specialize in Kubernetes, AWS, Azure, and GCP.',
            website: 'cloudscale.dev',
            address: 'Seattle, WA, USA',
            logo: null,
            tax_code: 'US-11223344'
        },
        'mock-4': {
            id: 'mock-4',
            name: 'MediCare Plus',
            description: 'Revolutionizing healthcare through AI-powered diagnostics and telemedicine platforms. Making quality healthcare accessible to everyone, anywhere in the world.',
            website: 'medicareplus.health',
            address: 'Boston, MA, USA',
            logo: null,
            tax_code: 'US-44332211'
        },
        'mock-5': {
            id: 'mock-5',
            name: 'FinanceHub Corp',
            description: 'Digital banking and payment solutions for the modern economy. Secure, fast, and reliable financial services for businesses and individuals worldwide.',
            website: 'financehub.com',
            address: 'New York, NY, USA',
            logo: null,
            tax_code: 'US-99887766'
        }
    };

    // Fetch company detail from API
    useEffect(() => {
        const fetchCompanyDetail = async () => {
            if (!id) {
                setError('Company ID không hợp lệ');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // Kiểm tra nếu là mock ID
            if (id.startsWith('mock-')) {
                const mockData = mockCompanies[id];
                if (mockData) {
                    setCompany(mockData);
                } else {
                    setError('Không tìm thấy công ty này.');
                }
                setLoading(false);
                return;
            }

            try {
                const response = await axiosClient.get(`/api/company/${id}/`, {
                    validateStatus: function (status) {
                        return status >= 200 && status < 400;
                    }
                });
                setCompany(response.data);
            } catch (err) {
                console.error('Error fetching company detail:', err);
                // Fallback to first mock company if API fails
                setCompany(mockCompanies['mock-1']);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetail();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="company-profile-container">
                <header className="hp-header">
                    <div className="header-left-section">
                        <div className="logo-vertical" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
                            <div className="logo-line">UTH</div>
                            <div className="logo-line">WORKPLACE</div>
                        </div>
                    </div>
                    <nav className="header-nav">
                        <div className="nav-item" onClick={() => navigate('/homepage')}><Home size={18} /> <span>Home</span></div>
                        <div className="nav-item active" onClick={() => navigate('/companies')}><Users size={18} /> <span>Company</span></div>
                        <div className="nav-item" onClick={() => navigate('/job-list')}><Briefcase size={18} /> <span>Job</span></div>
                    </nav>
                </header>
                <div className="cp-loading-container">
                    <Loader size={48} className="cp-loading-spinner" />
                    <p>Đang tải thông tin công ty...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="company-profile-container">
                <header className="hp-header">
                    <div className="header-left-section">
                        <div className="logo-vertical" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
                            <div className="logo-line">UTH</div>
                            <div className="logo-line">WORKPLACE</div>
                        </div>
                    </div>
                    <nav className="header-nav">
                        <div className="nav-item" onClick={() => navigate('/homepage')}><Home size={18} /> <span>Home</span></div>
                        <div className="nav-item active" onClick={() => navigate('/companies')}><Users size={18} /> <span>Company</span></div>
                        <div className="nav-item" onClick={() => navigate('/job-list')}><Briefcase size={18} /> <span>Job</span></div>
                    </nav>
                </header>
                <div className="cp-error-container">
                    <Building2 size={60} color="#9ca3af" />
                    <h3>{error}</h3>
                    <button className="cp-back-btn" onClick={() => navigate('/companies')}>
                        <ArrowLeft size={18} />
                        <span>Back to Companies</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="company-profile-container">
            {/* HEADER - Same as Homepage */}
            <header className="hp-header">
                <div className="header-left-section">
                    <div className="logo-vertical" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
                        <div className="logo-line">UTH</div>
                        <div className="logo-line">WORKPLACE</div>
                    </div>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon-svg" />
                        <input type="text" placeholder="Search Companies by Name or Industry" />
                    </div>
                </div>

                <nav className="header-nav">
                    <div className="nav-item" onClick={() => navigate('/homepage')}><Home size={18} /> <span>Home</span></div>
                    <div className="nav-item active" onClick={() => navigate('/companies')}><Users size={18} /> <span>Company</span></div>
                    <div className="nav-item" onClick={() => navigate('/job-list')}><Briefcase size={18} /> <span>Job</span></div>
                    <div className="nav-item" onClick={() => navigate('/chatbot')}><Bot size={18} /> <span>AI</span></div>

                    <div className="nav-item account-btn-container" onClick={() => setIsAccountOpen(!isAccountOpen)}>
                        <div className="account-icon-wrapper">
                            <UserCircle size={24} />
                            <ChevronDown size={14} className={isAccountOpen ? 'rotate' : ''} />
                        </div>
                        <span>Account</span>

                        {isAccountOpen && (
                            <div className="mini-account-page" onClick={(e) => e.stopPropagation()}>
                                <div className="mini-page-grid">
                                    <div className="mini-item" onClick={() => navigate('/profile')}>
                                        <div className="icon-box"><UserCircle size={28} /></div>
                                        <span>Information</span>
                                    </div>
                                    <div className="mini-item" onClick={() => navigate('/premium')}>
                                        <div className="icon-box"><CreditCard size={28} /></div>
                                        <span>Premium</span>
                                    </div>
                                    <div className="mini-item">
                                        <div className="icon-box"><Bell size={28} /></div>
                                        <span>Notification</span>
                                    </div>
                                    <div className="mini-item" onClick={() => navigate('/job-list')}>
                                        <div className="icon-box"><FileText size={28} /></div>
                                        <span>Jobs</span>
                                    </div>
                                </div>
                                <div className="mini-footer"><LogOut size={16} /> Sign out</div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* Breadcrumb - Back to Companies */}
            <div className="cp-breadcrumb">
                <button className="cp-back-btn" onClick={() => navigate('/companies')}>
                    <ArrowLeft size={18} />
                    <span>Back to Companies</span>
                </button>
                <div className="cp-breadcrumb-trail">
                    <span onClick={() => navigate('/homepage')} className="cp-breadcrumb-link">Home</span>
                    <ChevronRight size={14} />
                    <span onClick={() => navigate('/companies')} className="cp-breadcrumb-link">Companies</span>
                    <ChevronRight size={14} />
                    <span className="cp-breadcrumb-current">{company?.name || 'Company'}</span>
                </div>
            </div>

            {/* Hero Section with Cover Photo */}
            <div className="cp-hero-section">
                <div className="cp-cover-photo">
                    <div className="cp-overlay"></div>
                </div>
                <div className="cp-hero-content">
                    <div className="cp-profile-header">
                        <div className="cp-company-logo">
                            {company?.logo ? (
                                <img src={company.logo} alt={company.name} className="cp-logo-img" />
                            ) : (
                                <Rocket size={48} color="#7c3aed" />
                            )}
                        </div>
                        <div className="cp-company-info">
                            <div className="cp-info-main">
                                <div className="cp-title-group">
                                    <h1>{company?.name || 'Company Name'}</h1>
                                    <div className="cp-meta-tags">
                                        <span><MapPin size={16} /> {company?.address || 'N/A'}</span>
                                        {company?.website && (
                                            <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="cp-website-link">
                                                <Globe size={16} /> {company.website}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="cp-action-btns">
                                    <button className="cp-btn-follow">
                                        <Plus size={18} /> Follow
                                    </button>
                                    <button className="cp-btn-share">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="cp-tabs-bar">
                <div className="cp-tabs-content">
                    <a href="#" className="cp-tab-item active">About Us</a>
                    <a href="#" className="cp-tab-item">Jobs</a>
                    <a href="#" className="cp-tab-item">Reviews</a>
                    <a href="#" className="cp-tab-item">Life</a>
                </div>
            </div>

            {/* Main Layout */}
            <main className="cp-main-layout">
                <div className="cp-content-left">
                    <section className="cp-about-card">
                        <h2>About {company?.name}</h2>
                        <p>{company?.description || 'No description available for this company.'}</p>
                        <div className="cp-stats-grid">
                            <div className="cp-stat-item"><span>Address</span><strong>{company?.address || 'N/A'}</strong></div>
                            <div className="cp-stat-item"><span>Website</span><strong>{company?.website || 'N/A'}</strong></div>
                            <div className="cp-stat-item"><span>Tax Code</span><strong>{company?.tax_code || 'N/A'}</strong></div>
                            <div className="cp-stat-item"><span>ID</span><strong>{company?.id?.slice(0, 8) || 'N/A'}...</strong></div>
                        </div>
                    </section>

                    <section className="cp-jobs-section">
                        <div className="cp-section-header">
                            <h3>Open Positions</h3>
                            <a href="#" className="cp-view-all">View all</a>
                        </div>
                        <div className="cp-job-list">
                            <div className="cp-empty-jobs">
                                <Briefcase size={32} color="#9ca3af" />
                                <p>No open positions at the moment</p>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="cp-sidebar-right">
                    <div className="cp-widget cp-map-widget">
                        <div className="cp-widget-header">Office Location</div>
                        <div className="cp-map-placeholder">
                            <MapPin size={32} color="#9ca3af" />
                            <span>Map View</span>
                        </div>
                        <div className="cp-widget-body">
                            <p><MapPin size={14} /> {company?.address || 'Address not available'}</p>
                        </div>
                    </div>

                    <div className="cp-widget">
                        <div className="cp-widget-header">Company Info</div>
                        <div className="cp-widget-body">
                            <div className="cp-culture-tags">
                                {company?.website && <span className="cp-culture-tag">Has Website</span>}
                                {company?.tax_code && <span className="cp-culture-tag">Verified Tax</span>}
                                {company?.description && <span className="cp-culture-tag">Complete Profile</span>}
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default CompanyProfile;