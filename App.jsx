const { useState, useEffect } = React;
const { BrowserRouter, Routes, Route, useNavigate, useParams, Link } = ReactRouterDOM;

// ==========================================
// Header Component
// ==========================================
function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.length > 1) {
            const timeoutId = setTimeout(() => {
                fetchSuggestions(searchQuery);
            }, CONFIG.SEARCH_DEBOUNCE);
            return () => clearTimeout(timeoutId);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/medicines/search/autocomplete?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSuggestions(data.suggestions || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (medicine) => {
        navigate(`/medicine/${medicine.id}`);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    return (
        <header className="header">
            <div className="header-top">
                <div className="container">
                    <div className="header-top-content">
                        <span>📞 24/7 Medicine Price Information</span>
                        <span>🚚 Compare Prices Across Pakistan</span>
                    </div>
                </div>
            </div>
            <div className="header-main">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <span>💊</span>
                            <span>{CONFIG.SITE_NAME}</span>
                        </Link>

                        <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            ☰
                        </button>

                        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/companies" className="nav-link">Companies</Link>
                            <Link to="/diseases" className="nav-link">Diseases</Link>
                            <Link to="/about" className="nav-link">About</Link>
                            <Link to="/contact" className="nav-link">Contact</Link>
                        </nav>

                        <div className="search-container">
                            <form onSubmit={handleSearch}>
                                <div className="search-input-wrapper">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search medicines..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    />
                                </div>
                            </form>

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="search-suggestions">
                                    {suggestions.map((medicine) => (
                                        <div
                                            key={medicine.id}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(medicine)}
                                        >
                                            <img
                                                src={medicine.image_url || CONFIG.IMAGE_PLACEHOLDER}
                                                alt={medicine.name}
                                                className="suggestion-image"
                                                onError={(e) => e.target.src = CONFIG.IMAGE_PLACEHOLDER}
                                            />
                                            <div className="suggestion-details">
                                                <div className="suggestion-name">{medicine.name}</div>
                                                <div className="suggestion-meta">
                                                    {medicine.company && <span>{medicine.company}</span>}
                                                </div>
                                            </div>
                                            {medicine.price && (
                                                <div className="suggestion-price">PKR {medicine.price}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

// ==========================================
// Footer Component
// ==========================================
function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>{CONFIG.SITE_NAME}</h3>
                        <p>{CONFIG.SITE_TAGLINE}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
                            {CONFIG.DISCLAIMER}
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/companies" className="footer-link">Companies</Link></li>
                            <li><Link to="/diseases" className="footer-link">Diseases</Link></li>
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <ul className="footer-links">
                            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
                            <li><Link to="/disclaimer" className="footer-link">Disclaimer</Link></li>
                            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Information</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Data Sources</a></li>
                            <li><a href="#" className="footer-link">How It Works</a></li>
                            <li><a href="#" className="footer-link">FAQ</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 {CONFIG.SITE_NAME}. All rights reserved. Information purposes only.</p>
                </div>
            </div>
        </footer>
    );
}

// ==========================================
// Medicine Card Component
// ==========================================
function MedicineCard({ medicine }) {
    const navigate = useNavigate();

    return (
        <div className="medicine-card" onClick={() => navigate(`/medicine/${medicine.id}`)}>
            <div className="medicine-image-container">
                <img
                    src={medicine.image_url || CONFIG.IMAGE_PLACEHOLDER}
                    alt={medicine.medicine_name}
                    className="medicine-image"
                    onError={(e) => e.target.src = CONFIG.IMAGE_PLACEHOLDER}
                />
                <span className={`availability-badge ${medicine.availability?.toLowerCase().includes('stock') ? '' : 'out-of-stock'}`}>
                    {medicine.availability || 'Check Availability'}
                </span>
            </div>
            <div className="medicine-content">
                <h3 className="medicine-name">{medicine.medicine_name}</h3>
                {medicine.company && (
                    <p className="medicine-company">{medicine.company}</p>
                )}
                <div className="medicine-meta">
                    {medicine.category && <span className="meta-tag">{medicine.category}</span>}
                    {medicine.strength && <span className="meta-tag">{medicine.strength}</span>}
                </div>
                <div className="medicine-price">
                    <div className="price-label">Price</div>
                    <div className="price-value">
                        PKR {medicine.min_price || 'N/A'}
                    </div>
                    {medicine.max_price && medicine.min_price !== medicine.max_price && (
                        <div className="price-range">Range: PKR {medicine.min_price} - {medicine.max_price}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// Home Page Component
// ==========================================
function HomePage() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        company: '',
        disease: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchMedicines();
    }, [page, filters]);

    const fetchStats = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                page_size: CONFIG.ITEMS_PER_PAGE,
                ...(filters.company && { company: filters.company }),
                ...(filters.disease && { disease: filters.disease }),
                ...(filters.category && { category: filters.category }),
                ...(filters.minPrice && { min_price: filters.minPrice }),
                ...(filters.maxPrice && { max_price: filters.maxPrice })
            });

            const response = await fetch(`${CONFIG.API_BASE_URL}/medicines?${params}`);
            const data = await response.json();
            setMedicines(data.medicines || []);
            setTotalPages(Math.ceil(data.total / CONFIG.ITEMS_PER_PAGE));
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({
            company: '',
            disease: '',
            category: '',
            minPrice: '',
            maxPrice: ''
        });
        setPage(1);
    };

    return (
        <>
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">Compare Medicine Prices Across Pakistan</h1>
                    <p className="hero-subtitle">Find the best prices for your medicines from trusted pharmacies</p>
                    
                    {stats.total_medicines && (
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">{stats.total_medicines}+</div>
                                <div className="stat-label">Medicines</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{stats.total_companies}+</div>
                                <div className="stat-label">Companies</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">Daily</div>
                                <div className="stat-label">Price Updates</div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="filters-section">
                <div className="container">
                    <div className="filters-container">
                        <div className="filter-group">
                            <label className="filter-label">Company:</label>
                            <input
                                type="text"
                                className="filter-select"
                                placeholder="Filter by company"
                                value={filters.company}
                                onChange={(e) => handleFilterChange('company', e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Disease:</label>
                            <input
                                type="text"
                                className="filter-select"
                                placeholder="Filter by disease"
                                value={filters.disease}
                                onChange={(e) => handleFilterChange('disease', e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Price Range:</label>
                            <div className="price-range-inputs">
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="filter-button clear-filters" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </section>

            <section className="medicines-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">All Medicines</h2>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <>
                            <div className="medicines-grid">
                                {medicines.map(medicine => (
                                    <MedicineCard key={medicine.id} medicine={medicine} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="page-button"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </button>
                                    <span className="page-button active">{page} of {totalPages}</span>
                                    <button
                                        className="page-button"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

// ==========================================
// Medicine Detail Page Component
// ==========================================
function MedicineDetailPage() {
    const { id } = useParams();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedicineDetail();
    }, [id]);

    const fetchMedicineDetail = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/medicines/${id}`);
            const data = await response.json();
            setMedicine(data);
        } catch (error) {
            console.error('Error fetching medicine detail:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!medicine) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Medicine not found</div>;
    }

    return (
        <section className="medicine-detail">
            <div className="container">
                <div className="detail-container">
                    <div className="detail-header">
                        <div className="detail-image-section">
                            <img
                                src={medicine.image_url || CONFIG.IMAGE_PLACEHOLDER}
                                alt={medicine.medicine_name}
                                className="detail-image"
                                onError={(e) => e.target.src = CONFIG.IMAGE_PLACEHOLDER}
                            />
                        </div>
                        <div className="detail-info">
                            <h1 className="detail-title">{medicine.medicine_name}</h1>
                            {medicine.company && (
                                <p className="detail-company">By {medicine.company}</p>
                            )}
                            <div className="detail-tags">
                                {medicine.category && <span className="detail-tag">{medicine.category}</span>}
                                {medicine.disease && <span className="detail-tag">{medicine.disease}</span>}
                                {medicine.strength && <span className="detail-tag">{medicine.strength}</span>}
                                {medicine.pack_size && <span className="detail-tag">{medicine.pack_size}</span>}
                            </div>
                            <div className="detail-price-section">
                                <div className="detail-price-main">PKR {medicine.min_price || 'N/A'}</div>
                                {medicine.max_price && medicine.min_price !== medicine.max_price && (
                                    <div className="detail-price-range">
                                        Price Range: PKR {medicine.min_price} - PKR {medicine.max_price}
                                    </div>
                                )}
                                <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                                    <strong>Availability:</strong> {medicine.availability || 'Check with pharmacy'}
                                </div>
                            </div>
                            <div className="detail-disclaimer">
                                <strong>⚠️ Important Notice:</strong> {CONFIG.DISCLAIMER}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ==========================================
// Search Results Page
// ==========================================
function SearchPage() {
    const [searchParams] = React.useState(new URLSearchParams(window.location.search));
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const fetchSearchResults = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="medicines-section">
            <div className="container">
                <h2 className="section-title">Search Results for "{query}"</h2>
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="medicines-grid">
                        {results.map(medicine => (
                            <MedicineCard key={medicine.id} medicine={medicine} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h3>No medicines found</h3>
                        <p>Try searching with different keywords</p>
                    </div>
                )}
            </div>
        </section>
    );
}

// ==========================================
// Static Pages (Placeholders)
// ==========================================
function AboutPage() {
    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <h1>About Us</h1>
            <p>Information about AIClinix platform...</p>
        </div>
    );
}

function ContactPage() {
    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <h1>Contact Us</h1>
            <p>Contact information...</p>
        </div>
    );
}

// ==========================================
// Main App Component
// ==========================================
function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/medicine/:id" element={<MedicineDetailPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/companies" element={<div className="container" style={{padding:'3rem 0'}}><h1>Companies</h1></div>} />
                        <Route path="/diseases" element={<div className="container" style={{padding:'3rem 0'}}><h1>Diseases</h1></div>} />
                        <Route path="/privacy" element={<div className="container" style={{padding:'3rem 0'}}><h1>Privacy Policy</h1></div>} />
                        <Route path="/terms" element={<div className="container" style={{padding:'3rem 0'}}><h1>Terms & Conditions</h1></div>} />
                        <Route path="/disclaimer" element={<div className="container" style={{padding:'3rem 0'}}><h1>Disclaimer</h1></div>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
