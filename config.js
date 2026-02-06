// API Configuration
// Change this URL to update API endpoint across entire application
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api/v1'
        : 'https://api.aiclinix.online/api/v1',
    
    SITE_NAME: 'AIClinix',
    SITE_TAGLINE: 'Compare Medicine Prices Across Pakistan',
    
    // Pagination
    ITEMS_PER_PAGE: 24,
    
    // Search debounce delay
    SEARCH_DEBOUNCE: 300,
    
    // Image placeholder
    IMAGE_PLACEHOLDER: '/assets/medicine-placeholder.png',
    
    // Disclaimer
    DISCLAIMER: 'Prices are for information only. We do not sell medicines. Consult healthcare professionals before taking any medication.',
};

// Make it globally available
window.CONFIG = CONFIG;
