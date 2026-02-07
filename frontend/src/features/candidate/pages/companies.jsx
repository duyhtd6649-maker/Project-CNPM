import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Home, Users, Briefcase, Bot, FileText,
    UserCircle, ChevronDown, CreditCard, Bell, LogOut,
    Star, MapPin, Building2, ChevronLeft, ChevronRight, Loader, Settings
} from 'lucide-react';
import axiosClient from '../../../infrastructure/http/axiosClient';
import "../components/HomepageCandidates.css";
import "../components/companies.css";

const JobDirectory = () => {
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [allCompanies, setAllCompanies] = useState([]); // Data gốc từ API hoặc mock
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [addressFilter, setAddressFilter] = useState('');
    const [sortBy, setSortBy] = useState('recommended'); // Sort option
    const [companySizeFilter, setCompanySizeFilter] = useState([]);
    const [industryFilter, setIndustryFilter] = useState([]);

    const notifications = [
        { id: 1, type: 'Admin', user: 'System Admin', msg: 'Your account security settings have been updated successfully.', time: '12/26/2026 4:04 PM' },
        { id: 2, type: 'Recruiter', user: 'Techcombank HR', msg: 'We have received your application for Senior Frontend Developer position.', time: '12/27/2026 9:15 AM' },
        { id: 3, type: 'Recruiter', user: 'FPT Software', msg: 'Invitation to interview: Monday at 2:00 PM via Google Meet.', time: '12/28/2026 10:30 AM' }
    ];

    const filteredNotifications = notifications.filter(item => {
        if (activeTab === 'All') return true;
        return item.type === activeTab;
    });

    const [openFilters, setOpenFilters] = useState({
        location: true,
        companySize: true,
        industry: false,
        benefits: false
    });

    const toggleFilter = (filter) => {
        setOpenFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };

    // Mock data - hiển thị khi API fail hoặc trả về empty
    const mockCompanies = [
        {
            id: 'mock-1',
            name: 'TechNova Solutions',
            description: 'TechNova Solutions is a leading financial technology company dedicated to democratizing access to global markets. We build cutting-edge platforms that empower individuals and businesses.',
            website: 'technova.com',
            address: 'San Francisco, CA',
            logo: null,
            tax_code: 'US-12345678'
        },
        {
            id: 'mock-2',
            name: 'GreenEarth Ventures',
            description: 'We help businesses reduce their carbon footprint through innovative recycling and renewable energy consulting. Join our mission for a greener planet.',
            website: 'greenearth.io',
            address: 'Austin, TX',
            logo: null,
            tax_code: 'US-87654321'
        },
        {
            id: 'mock-3',
            name: 'CloudScale Systems',
            description: 'Enterprise cloud infrastructure and DevOps solutions. Helping companies scale their applications globally with reliability and security.',
            website: 'cloudscale.dev',
            address: 'Seattle, WA',
            logo: null,
            tax_code: 'US-11223344'
        },
        {
            id: 'mock-4',
            name: 'MediCare Plus',
            description: 'Revolutionizing healthcare through AI-powered diagnostics and telemedicine platforms. Making quality healthcare accessible to everyone.',
            website: 'medicareplus.health',
            address: 'Boston, MA',
            logo: null,
            tax_code: 'US-44332211'
        },
        {
            id: 'mock-5',
            name: 'FinanceHub Corp',
            description: 'Digital banking and payment solutions for the modern economy. Secure, fast, and reliable financial services for businesses and individuals.',
            website: 'financehub.com',
            address: 'New York, NY',
            logo: null,
            tax_code: 'US-99887766'
        }
    ];

    // Fetch companies from API
    const fetchCompanies = async (name = '', address = '') => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (name) params.append('name', name);
            if (address) params.append('address', address);

            const response = await axiosClient.get(`/search/company/?${params.toString()}`, {
                validateStatus: function (status) {
                    // Accept both 200 and 302 status codes as valid
                    return status >= 200 && status < 400;
                }
            });

            // Nếu API trả về data, sử dụng nó; nếu empty, sử dụng mock data
            const apiData = response.data || [];
            console.log('API Response - Companies loaded:', apiData.length);
            console.log('Companies data:', apiData);
            setAllCompanies(apiData.length > 0 ? apiData : mockCompanies);
        } catch (err) {
            console.error('Error fetching companies:', err);
            // Khi API fail, sử dụng mock data thay vì hiển thị error
            setAllCompanies(mockCompanies);
            setError(null); // Không hiện error, hiện mock data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Filter companies by search query (name) and address
    const companies = React.useMemo(() => {
        let filtered = [...allCompanies];

        // Filter by company name
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(company =>
                company.name.toLowerCase().includes(query)
            );
        }

        // Filter by address
        if (addressFilter.trim()) {
            filtered = filtered.filter(company =>
                company.address && company.address.toLowerCase().includes(addressFilter.toLowerCase())
            );
        }

        return filtered;
    }, [allCompanies, searchQuery, addressFilter]);

    // Handle search on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Search đã được handle bởi useMemo, enter chỉ để blur
        }
    };

    // Handle search button click
    const handleSearch = () => {
        // Search is already handled by useMemo based on searchQuery state
        // This function is kept for the search button onClick
    };

    // Featured companies (lấy 3 công ty đầu tiên làm featured)
    const featuredCompanies = companies.slice(0, 3);

    return (
        <div className="companies-page-container">
            {/* HEADER - Same as Homepage */}
            <header className="hp-header">
                <div className="header-left-section">
                    <div className="logo-vertical" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
                        <div className="logo-line">UTH</div>
                        <div className="logo-line">WORKPLACE</div>
                    </div>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon-svg" />
                        <input
                            type="text"
                            placeholder="Search Companies by Name or Industry"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                                    <div className="mini-item" onClick={() => { setIsNotifyOpen(true); setIsAccountOpen(false); }}>
                                        <div className="icon-box"><Bell size={28} /></div>
                                        <span>Notification</span>
                                    </div>
                                    <div className="mini-item" onClick={() => navigate('/job-list')}>
                                        <div className="icon-box"><FileText size={28} /></div>
                                        <span>Jobs</span>
                                    </div>
                                </div>
                                <div className="mini-footer" onClick={() => navigate('/login')}><LogOut size={16} /> Sign out</div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* NOTIFICATION BOX */}
            {isNotifyOpen && (
                <div className="notification-overlay" onClick={() => setIsNotifyOpen(false)}>
                    <div className="notification-box" onClick={(e) => e.stopPropagation()}>
                        <div className="notify-header">
                            <div className="header-title"><span>Inbox</span> <ChevronDown size={14} /></div>
                        </div>
                        <div className="notify-tabs">
                            {['All', 'Admin', 'Recruiter'].map(tab => (
                                <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
                            ))}
                        </div>
                        <div className="notify-content">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(item => (
                                    <div key={item.id} className="notify-item">
                                        <div className="notify-avatar"><UserCircle size={32} color={item.type === 'Admin' ? '#4b49ac' : '#666'} /></div>
                                        <div className="notify-info">
                                            <div className="notify-user">{item.user} <span className={`type-tag-small ${item.type.toLowerCase()}`}>{item.type}</span></div>
                                            <div className="notify-msg">{item.msg}</div>
                                            <div className="notify-time">{item.time}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-notify">No notifications in {activeTab}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hero / Search Section */}
            <div className="companies-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Find your next workplace</h1>
                    <p className="hero-subtitle">Discover detailed company profiles, employee reviews, and open positions.</p>

                    <div className="hero-search-container">
                        <div className="hero-search-box">
                            <Search size={20} className="hero-search-icon" />
                            <input
                                type="text"
                                placeholder="Search by company name"
                                className="hero-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="hero-search-btn" onClick={handleSearch}>Search</button>
                        </div>
                        <div className="popular-searches">
                            <span>Popular:</span>
                            <a href="#" className="popular-link" onClick={(e) => { e.preventDefault(); setSearchQuery('Tech'); handleSearch(); }}>Tech</a>
                            <a href="#" className="popular-link" onClick={(e) => { e.preventDefault(); setSearchQuery('Finance'); handleSearch(); }}>Finance</a>
                            <a href="#" className="popular-link" onClick={(e) => { e.preventDefault(); setSearchQuery('Healthcare'); handleSearch(); }}>Healthcare</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="companies-main">
                {/* Simple Company Search Sidebar */}
                <aside className="companies-sidebar">
                    <div className="filters-header">
                        <h3>Tìm kiếm</h3>
                    </div>

                    {/* Company Name Search */}
                    <div className="filter-group">
                        <label className="filter-label">Tên công ty</label>
                        <div className="filter-search-input">
                            <Search size={18} className="search-input-icon" />
                            <input
                                type="text"
                                placeholder="Nhập tên công ty..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location Search */}
                    <div className="filter-group">
                        <label className="filter-label">Địa điểm</label>
                        <div className="filter-search-input">
                            <MapPin size={18} className="search-input-icon" />
                            <input
                                type="text"
                                placeholder="Nhập địa điểm (VD: TP.HCM)..."
                                value={addressFilter}
                                onChange={(e) => setAddressFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {(searchQuery || addressFilter) && (
                        <button
                            className="clear-search-btn"
                            onClick={() => { setSearchQuery(''); setAddressFilter(''); }}
                        >
                            Xóa tìm kiếm
                        </button>
                    )}

                    {/* Quick Stats */}
                    <div className="filter-group">
                        <p className="search-result-count">
                            Hiển thị <strong>{companies.length}</strong> công ty
                        </p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="companies-content">
                    {/* Loading State */}
                    {loading && (
                        <div className="loading-container">
                            <Loader size={40} className="loading-spinner" />
                            <p>Đang tải danh sách công ty...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            <button className="retry-btn" onClick={() => fetchCompanies()}>Thử lại</button>
                        </div>
                    )}

                    {/* No Data State */}
                    {!loading && !error && companies.length === 0 && (
                        <div className="empty-container">
                            <Building2 size={60} color="#9ca3af" />
                            <h3>Không tìm thấy công ty nào</h3>
                            <p>Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
                        </div>
                    )}

                    {/* Data Loaded */}
                    {!loading && !error && companies.length > 0 && (
                        <>
                            {/* Featured Companies */}
                            {featuredCompanies.length > 0 && (
                                <section className="featured-section">
                                    <div className="featured-header">
                                        <h2>Featured Top Companies</h2>
                                        <a href="#" className="view-all-link">View all featured</a>
                                    </div>
                                    <div className="featured-grid">
                                        {featuredCompanies.map((company, index) => (
                                            <div key={company.id} className="featured-card" onClick={() => navigate(`/company-profile/${company.id}`)}>
                                                <div className="featured-badge">Featured</div>
                                                <div className="featured-logo" style={{ background: ['#7c3aed', '#ec4899', '#22c55e'][index % 3] }}>
                                                    {company.logo ? (
                                                        <img src={company.logo} alt={company.name} className="featured-logo-img" />
                                                    ) : (
                                                        <Building2 size={24} color="white" />
                                                    )}
                                                </div>
                                                <h3 className="featured-name">{company.name}</h3>
                                                <p className="featured-industry">{company.address || 'N/A'}</p>
                                                <p className="featured-desc">{company.description || 'No description available.'}</p>
                                                <button className="follow-btn">View Details</button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Company List */}
                            <section className="companies-list-section">
                                <div className="list-header">
                                    <h2>{companies.length} Companies</h2>
                                    <div className="sort-dropdown">
                                        <span>Sort by:</span>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                            <option value="recommended">Recommended</option>
                                            <option value="newest">Newest</option>
                                            <option value="name-asc">Name A-Z</option>
                                            <option value="name-desc">Name Z-A</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="companies-grid">
                                    {companies.map(company => (
                                        <div key={company.id} className="company-card" onClick={() => navigate(`/company-profile/${company.id}`)} style={{ cursor: 'pointer' }}>
                                            <div className="company-logo-wrapper">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} className="company-logo-img" />
                                                ) : (
                                                    <span className="company-logo-emoji">🏢</span>
                                                )}
                                            </div>
                                            <div className="company-info">
                                                <h3 className="company-name">{company.name}</h3>
                                                <div className="company-meta">
                                                    <span><MapPin size={14} /> {company.address || 'Chưa cập nhật địa điểm'}</span>
                                                </div>
                                                <p className="company-desc">{company.description || 'Chưa có mô tả về công ty này.'}</p>

                                                <button className="view-profile-btn">Xem hồ sơ</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default JobDirectory;