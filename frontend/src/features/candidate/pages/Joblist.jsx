import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Bookmark, MessageCircle, ChevronLeft, ChevronRight, ChevronDown,
    ArrowRight, Briefcase, LogOut, MoreHorizontal, Bell, FileText, User
} from 'lucide-react';
import CandidateNavbar from '../components/CandidateNavbar';
import axiosClient from '../../../infrastructure/http/axiosClient';
import '../components/HomepageCandidates.css';
import '../components/Joblist.css';

const JobBrowsing = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [allJobs, setAllJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        salaryRange: '',
        customSalaryMin: '',
        customSalaryMax: ''
    });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [originalJobs, setOriginalJobs] = useState([]); // Store original jobs for filtering
    const [customInputs, setCustomInputs] = useState({
        location: '',
        category: ''
    });

    // Filter options
    const locationOptions = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Remote', 'Hybrid'];
    const categoryOptions = ['IT', 'Marketing', 'Sales', 'Design', 'Finance', 'HR'];
    const salaryRanges = [
        { label: 'Dưới $20k', min: 0, max: 20000 },
        { label: '$20k - $40k', min: 20000, max: 40000 },
        { label: '$40k - $60k', min: 40000, max: 60000 },
        { label: 'Trên $60k', min: 60000, max: null }
    ];

    // Format salary từ số thành string hiển thị
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Negotiable';
        const formatNum = (num) => {
            if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
            return `$${num}`;
        };
        if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
        if (min) return `From ${formatNum(min)}`;
        return `Up to ${formatNum(max)}`;
    };

    // Fetch all jobs once on mount
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axiosClient.get('/search/job/');
                const formattedJobs = response.data.map(job => ({
                    id: job.id,
                    role: job.title,
                    company: job.company || 'Unknown Company',
                    location: job.location || 'Remote',
                    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'C')}&background=6366f1&color=fff&size=100`,
                    tags: job.skill || [],
                    salary: formatSalary(job.salary_min, job.salary_max),
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                    description: job.description,
                    category: job.category || ''
                }));
                setOriginalJobs(formattedJobs);
                setAllJobs(formattedJobs);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Không thể tải danh sách công việc. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Apply filters whenever filter state changes
    useEffect(() => {
        let filtered = [...originalJobs];

        // Filter by search term (title)
        if (searchTerm.trim()) {
            filtered = filtered.filter(job =>
                job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by category (match against job title since API doesn't return category field)
        if (filters.category) {
            const categoryLower = filters.category.toLowerCase();
            filtered = filtered.filter(job => {
                // Check if job title contains the category keyword
                const titleMatch = job.role.toLowerCase().includes(categoryLower);
                // Check exact tag match (case insensitive)
                const tagMatch = job.tags.some(tag => tag.toLowerCase() === categoryLower);
                return titleMatch || tagMatch;
            });
        }

        // Filter by location
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by salary range (preset or custom)
        if (filters.salaryRange) {
            const range = salaryRanges.find(r => r.label === filters.salaryRange);
            if (range) {
                filtered = filtered.filter(job => {
                    const jobMin = job.salary_min || 0;
                    const jobMax = job.salary_max || Infinity;
                    if (range.max === null) {
                        return jobMin >= range.min;
                    }
                    return jobMin >= range.min && jobMax <= range.max;
                });
            }
        } else if (filters.customSalaryMin || filters.customSalaryMax) {
            const minSalary = filters.customSalaryMin ? parseFloat(filters.customSalaryMin) * 1000 : 0;
            const maxSalary = filters.customSalaryMax ? parseFloat(filters.customSalaryMax) * 1000 : Infinity;
            filtered = filtered.filter(job => {
                const jobMin = job.salary_min || 0;
                const jobMax = job.salary_max || Infinity;
                return jobMax >= minSalary && jobMin <= maxSalary;
            });
        }

        setAllJobs(filtered);
        setCurrentPage(1);
    }, [searchTerm, filters, originalJobs]);

    // Handle filter change
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setActiveDropdown(null);
    };

    // Handle custom input apply
    const applyCustomFilter = (filterName) => {
        if (customInputs[filterName]?.trim()) {
            setFilters(prev => ({ ...prev, [filterName]: customInputs[filterName].trim() }));
        }
        setActiveDropdown(null);
    };

    // Handle custom salary apply
    const applyCustomSalary = () => {
        setFilters(prev => ({
            ...prev,
            salaryRange: '',
            customSalaryMin: customInputs.salaryMin || '',
            customSalaryMax: customInputs.salaryMax || ''
        }));
        setActiveDropdown(null);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({ location: '', category: '', salaryRange: '', customSalaryMin: '', customSalaryMax: '' });
        setCustomInputs({ location: '', category: '', salaryMin: '', salaryMax: '' });
    };

    // Check if has any active filter
    const hasActiveFilters = searchTerm || filters.location || filters.category || filters.salaryRange || filters.customSalaryMin || filters.customSalaryMax;

    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allJobs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentJobs = allJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Xử lý Dark Mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    return (
        <div className="hp-container">
            <CandidateNavbar />
            <div className="bg-mesh">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="layout-wrapper" style={{ height: 'calc(100vh - 80px)' }}>

                <aside className="sidebar glass-panel">
                    <div className="sidebar-top">
                        <nav className="nav-menu">
                            <p className="menu-label">Menu</p>
                            <a href="#" className="nav-link active">
                                <Search size={22} className="filled" />
                                Find Jobs
                            </a>

                            <div className="sidebar-profile-section" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'var(--surface-white)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div className="user-profile-top" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: "url('https://i.pravatar.cc/150?img=32')", backgroundSize: 'cover' }}></div>
                                    <div className="user-info">
                                        <p className="user-name" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Alex Morgan</p>
                                        <p className="user-role" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Product Designer</p>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="sidebar-bottom">
                        <div className="divider"></div>
                        <button className="logout-btn" style={{ width: '100%', padding: '10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <LogOut size={20} />
                            <span>Log out</span>
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    <header className="top-header">
                        <div className="header-inner">
                            <div className="header-top">
                                <div className="header-title">
                                    <h1>Explore {allJobs.length}+ Opportunities</h1>
                                </div>
                                <label className="search-bar">
                                    <Search size={20} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by job title, skill, or keyword"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="filters-row">
                                <button
                                    className={`filter-chip ${!hasActiveFilters ? 'active' : ''}`}
                                    onClick={clearAllFilters}
                                >
                                    All Jobs
                                </button>

                                {/* Category Dropdown */}
                                <div className="filter-dropdown-wrapper">
                                    <button
                                        className={`filter-chip ${filters.category ? 'active' : ''}`}
                                        onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                    >
                                        {filters.category || 'Category'} <ChevronDown size={16} />
                                    </button>
                                    {activeDropdown === 'category' && (
                                        <div className="filter-dropdown">
                                            <div className="dropdown-input-wrapper">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập category..."
                                                    value={customInputs.category}
                                                    onChange={(e) => setCustomInputs(prev => ({ ...prev, category: e.target.value }))}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button className="apply-btn" onClick={() => applyCustomFilter('category')}>Áp dụng</button>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            {categoryOptions.map(opt => (
                                                <div key={opt} className={`dropdown-item ${filters.category === opt ? 'selected' : ''}`} onClick={() => handleFilterChange('category', opt)}>
                                                    {opt}
                                                </div>
                                            ))}
                                            {filters.category && (
                                                <div className="dropdown-item clear" onClick={() => handleFilterChange('category', '')}>
                                                    Clear
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Location Dropdown */}
                                <div className="filter-dropdown-wrapper">
                                    <button
                                        className={`filter-chip ${filters.location ? 'active' : ''}`}
                                        onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                                    >
                                        {filters.location || 'Location'} <ChevronDown size={16} />
                                    </button>
                                    {activeDropdown === 'location' && (
                                        <div className="filter-dropdown">
                                            <div className="dropdown-input-wrapper">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập địa điểm..."
                                                    value={customInputs.location}
                                                    onChange={(e) => setCustomInputs(prev => ({ ...prev, location: e.target.value }))}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button className="apply-btn" onClick={() => applyCustomFilter('location')}>Áp dụng</button>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            {locationOptions.map(opt => (
                                                <div key={opt} className={`dropdown-item ${filters.location === opt ? 'selected' : ''}`} onClick={() => handleFilterChange('location', opt)}>
                                                    {opt}
                                                </div>
                                            ))}
                                            {filters.location && (
                                                <div className="dropdown-item clear" onClick={() => handleFilterChange('location', '')}>
                                                    Clear
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Salary Range Dropdown */}
                                <div className="filter-dropdown-wrapper">
                                    <button
                                        className={`filter-chip ${filters.salaryRange || filters.customSalaryMin || filters.customSalaryMax ? 'active' : ''}`}
                                        onClick={() => setActiveDropdown(activeDropdown === 'salary' ? null : 'salary')}
                                    >
                                        {filters.salaryRange || (filters.customSalaryMin || filters.customSalaryMax ? `$${filters.customSalaryMin || '0'}k - $${filters.customSalaryMax || '∞'}k` : 'Salary Range')} <ChevronDown size={16} />
                                    </button>
                                    {activeDropdown === 'salary' && (
                                        <div className="filter-dropdown salary-dropdown">
                                            <div className="dropdown-salary-wrapper">
                                                <span className="salary-label">Nhập mức lương (nghìn $):</span>
                                                <div className="salary-inputs">
                                                    <input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={customInputs.salaryMin || ''}
                                                        onChange={(e) => setCustomInputs(prev => ({ ...prev, salaryMin: e.target.value }))}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={customInputs.salaryMax || ''}
                                                        onChange={(e) => setCustomInputs(prev => ({ ...prev, salaryMax: e.target.value }))}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <button className="apply-btn" onClick={applyCustomSalary}>Áp dụng</button>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            {salaryRanges.map(range => (
                                                <div key={range.label} className={`dropdown-item ${filters.salaryRange === range.label ? 'selected' : ''}`} onClick={() => handleFilterChange('salaryRange', range.label)}>
                                                    {range.label}
                                                </div>
                                            ))}
                                            {(filters.salaryRange || filters.customSalaryMin || filters.customSalaryMax) && (
                                                <div className="dropdown-item clear" onClick={() => {
                                                    setFilters(prev => ({ ...prev, salaryRange: '', customSalaryMin: '', customSalaryMax: '' }));
                                                    setCustomInputs(prev => ({ ...prev, salaryMin: '', salaryMax: '' }));
                                                    setActiveDropdown(null);
                                                }}>
                                                    Clear
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="filter-divider"></div>
                                <button
                                    className="clear-filter"
                                    onClick={clearAllFilters}
                                    style={{ opacity: hasActiveFilters ? 1 : 0.5 }}
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="content-scroll">
                        <div className="jobs-container">
                            {isLoading && (
                                <div className="loading-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div className="loading-spinner" style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                                    <p style={{ color: 'var(--text-secondary)' }}>Đang tải danh sách công việc...</p>
                                </div>
                            )}
                            {error && (
                                <div className="error-state" style={{ textAlign: 'center', padding: '60px 20px', color: '#dc2626' }}>
                                    <p>{error}</p>
                                    <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Thử lại</button>
                                </div>
                            )}
                            {!isLoading && !error && allJobs.length === 0 && (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Chưa có công việc nào được đăng.</p>
                                </div>
                            )}
                            {!isLoading && !error && allJobs.length > 0 && (
                                <div className="jobs-grid">
                                    {currentJobs.map((job) => (
                                        <div key={job.id} className="job-card group">
                                            <div className="card-hover-line"></div>
                                            <div className="card-header">
                                                <div className="company-logo-box">
                                                    {job.isAiLogo ? (
                                                        <div className="ai-logo">AI</div>
                                                    ) : (
                                                        <img src={job.logo} alt={`${job.company} Logo`} />
                                                    )}
                                                </div>
                                                <button className="bookmark-btn">
                                                    <Bookmark size={20} />
                                                </button>
                                            </div>

                                            <div className="card-body">
                                                <h3>{job.role}</h3>
                                                <p className="company-location">{job.company} • {job.location}</p>
                                                <div className="tags-list">
                                                    {job.tags.map((tag, index) => (
                                                        <span key={index} className="tag">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="card-footer">
                                                <p className="salary">{job.salary} <span>/ year</span></p>
                                                <button
                                                    className="details-btn"
                                                    onClick={() => navigate(`/view-job/${job.id}`)}
                                                >
                                                    Details <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pagination-wrapper">
                                <nav className="pagination">
                                    <button
                                        className="page-btn icon-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="page-numbers">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="page-btn icon-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </nav>
                            </div>
                            <div className="pagination-info">
                                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, allJobs.length)} of {allJobs.length} results
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobBrowsing;