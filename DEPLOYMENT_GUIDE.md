# 🚀 AIClinix - Complete Deployment Guide

## 📦 Package Contents

This package includes a **complete full-stack application** with:

### Backend (FastAPI - Python)
- ✅ REST API with 20+ endpoints
- ✅ SQLite database with 5 tables
- ✅ Multi-source web scraper (Dvago, Dawaai, Servaid)
- ✅ Automated daily scheduling
- ✅ Fuzzy search with typo tolerance
- ✅ CSV export functionality
- ✅ Rule-based chat query agent

### Frontend (React)
- ✅ Single Page Application (SPA)
- ✅ Dvago-inspired design (medical theme)
- ✅ Responsive mobile-first design
- ✅ Search with autocomplete
- ✅ Advanced filtering
- ✅ Medicine detail pages
- ✅ SEO optimized

### Configuration
- ✅ Flat file structure (as required)
- ✅ Single config.js for API URL
- ✅ Railway.app deployment ready
- ✅ Environment variables setup
- ✅ robots.txt and sitemap.xml

---

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Initialize Database
```bash
python setup.py
```

### 3. Start the Application
```bash
# Use the full-stack app (serves both API and frontend)
python app_fullstack.py

# Or use original backend-only
python app.py
```

### 4. Access the Application
- **Frontend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **API**: http://localhost:8000/api/v1

---

## 📁 File Structure Overview

```
aiclinix/
│
├── Backend Files (Python/FastAPI)
│   ├── app.py                      # Backend-only API
│   ├── app_fullstack.py            # Full-stack (API + Frontend)
│   ├── database.py                 # Database configuration
│   ├── models.py                   # Database models
│   ├── crud.py                     # Database operations
│   ├── api_medicines.py            # Medicine endpoints
│   ├── api_companies.py            # Company endpoints
│   ├── api_diseases.py             # Disease endpoints
│   ├── api_search.py               # Search endpoints
│   ├── api_chat_query.py           # Chat query agent
│   ├── scraper.py                  # Main scraper
│   ├── scraper_sources.py          # Scraper configurations
│   ├── scraper_sources_enhanced.py # Enhanced Dvago scraper
│   ├── scraper_utils.py            # Scraper utilities
│   └── scheduler.py                # Daily scheduling
│
├── Frontend Files (React)
│   ├── index.html                  # Entry point
│   ├── App.jsx                     # Main React app
│   ├── config.js                   # API configuration
│   └── styles.css                  # Complete styling
│
├── SEO Files
│   ├── robots.txt                  # SEO crawler rules
│   └── sitemap.xml                 # Sitemap
│
├── Configuration
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variables
│   ├── railway.toml                # Railway deployment
│   ├── .gitignore                  # Git ignore
│   ├── setup.py                    # Setup script
│   └── test_api.py                 # API tests
│
└── Directories
    ├── data/                       # Database & CSV files
    ├── logs/                       # Scraper logs
    └── assets/                     # Images/icons
```

---

## 🔧 Configuration

### API URL Configuration (IMPORTANT!)

**All API calls are configured in ONE place: `config.js`**

```javascript
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api/v1'
        : 'https://api.aiclinix.online/api/v1',
    // ... other config
};
```

**To change API URL:** Just edit `config.js` - it updates the entire application!

### Environment Variables

Create a `.env` file:
```env
DATABASE_URL=sqlite:///./data/aiclinix.db
PORT=8000
SCRAPER_SCHEDULE_HOUR=8
SCRAPER_TIMEZONE=Asia/Karachi
LOG_LEVEL=INFO
```

---

## 🚢 Deployment Options

### Option 1: Railway.app (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect to Railway.app
   - Railway auto-detects Python

2. **Environment Variables**
   - Add on Railway dashboard
   - `PORT` (auto-set by Railway)
   - `DATABASE_URL` (optional, defaults to SQLite)

3. **Deploy**
   ```bash
   git push origin main
   # Railway auto-deploys
   ```

4. **Custom Domain**
   - Add `aiclinix.online` in Railway settings
   - Update DNS records

### Option 2: Manual VPS Deployment

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/aiclinix.git
cd aiclinix

# Install dependencies
pip install -r requirements.txt

# Initialize database
python setup.py

# Run with systemd
sudo nano /etc/systemd/system/aiclinix.service

# Add this content:
[Unit]
Description=AIClinix Full Stack Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/aiclinix
ExecStart=/usr/bin/python3 /var/www/aiclinix/app_fullstack.py
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable aiclinix
sudo systemctl start aiclinix
sudo systemctl status aiclinix
```

### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python setup.py

EXPOSE 8000

CMD ["python", "app_fullstack.py"]
```

Deploy:
```bash
docker build -t aiclinix .
docker run -p 8000:8000 aiclinix
```

---

## 🕷️ Scraping

### Manual Scraping
```bash
# Run scraper immediately
python scraper.py

# Run specific source
python -c "from scraper import run_scraper; run_scraper('dvago')"
```

### Automated Scraping
- Automatically runs daily at **8:00 AM Pakistan Time**
- Configured in `scheduler.py`
- Logs saved in `logs/` directory
- CSV exported to `data/` directory

### Monitoring Scraper
```bash
# Check logs
tail -f logs/scraper.log

# Check latest CSV
ls -la data/medicine_prices_*.csv
```

---

## 🎨 Frontend Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary-teal: #0d9488;    /* Change main color */
    --primary-blue: #0ea5e9;    /* Change secondary */
    --primary-dark: #0f766e;    /* Change dark variant */
}
```

### Change Site Name
Edit `config.js`:
```javascript
const CONFIG = {
    SITE_NAME: 'YourName',
    SITE_TAGLINE: 'Your Tagline',
};
```

### Add Custom Pages
Add routes in `App.jsx`:
```javascript
<Route path="/your-page" element={<YourComponent />} />
```

---

## 🔍 SEO Optimization

### Update Sitemap
The `sitemap.xml` should be dynamically generated. Create script:

```python
# generate_sitemap.py
from database import SessionLocal
from models import Medicine

db = SessionLocal()
medicines = db.query(Medicine).all()

sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for medicine in medicines:
    sitemap += f'''  <url>
    <loc>https://www.aiclinix.online/medicine/{medicine.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n'''

sitemap += '</urlset>'

with open('sitemap.xml', 'w') as f:
    f.write(sitemap)

print("Sitemap generated!")
```

Run daily:
```bash
python generate_sitemap.py
```

### Meta Tags
Each page should have unique meta tags. Implement using `react-helmet`:

```bash
npm install react-helmet
```

---

## 🧪 Testing

### Test API Endpoints
```bash
python test_api.py
```

### Manual Testing
```bash
# Health check
curl http://localhost:8000/health

# Get medicines
curl http://localhost:8000/api/v1/medicines?page=1&page_size=10

# Search
curl "http://localhost:8000/api/v1/search?q=panadol"

# Chat query
curl -X POST http://localhost:8000/api/v1/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the price of Panadol?"}'
```

---

## 📊 Monitoring & Analytics

### Check Statistics
Visit: `/api/v1/stats`

Returns:
```json
{
  "total_medicines": 1250,
  "total_companies": 45,
  "total_diseases": 32,
  "total_searches": 5432,
  "last_scrape": {
    "date": "2024-02-06T08:00:00",
    "status": "success",
    "records": 1250
  }
}
```

### Database Queries
```python
from database import SessionLocal
from models import Medicine, Company, Disease

db = SessionLocal()

# Get medicine count
medicine_count = db.query(Medicine).count()
print(f"Total medicines: {medicine_count}")

# Get top companies
from sqlalchemy import func
top_companies = db.query(
    Medicine.company, 
    func.count(Medicine.id)
).group_by(Medicine.company).limit(10).all()

for company, count in top_companies:
    print(f"{company}: {count} medicines")
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use
```bash
# Find process
lsof -ti:8000

# Kill process
kill -9 $(lsof -ti:8000)

# Or change port
PORT=8001 python app_fullstack.py
```

### Issue: Database Locked
```bash
# Remove database
rm data/aiclinix.db

# Reinitialize
python setup.py
```

### Issue: Scraper Not Working
```bash
# Check logs
cat logs/scraper.log

# Test individual scraper
python -c "from scraper_sources_enhanced import DvagoScraperEnhanced; scraper = DvagoScraperEnhanced(); data = scraper.scrape(); print(len(data))"
```

### Issue: Frontend Not Loading
```bash
# Check if files exist
ls -la index.html App.jsx styles.css config.js

# Test API separately
curl http://localhost:8000/api/v1/medicines

# Check browser console for errors
```

---

## 🔒 Security Checklist

- ✅ No hardcoded secrets
- ✅ Environment variables for config
- ✅ CORS properly configured
- ✅ No user authentication (as required)
- ✅ Rate limiting on scraper
- ✅ HTTPS enforced in production
- ✅ Medical disclaimers present

---

## 📈 Performance Optimization

### Database Indexing
Already implemented in `models.py`:
- Indexed fields: `medicine_name`, `company`, `disease`, `category`
- Compound indexes for common queries

### API Caching
Add caching with Redis (optional):
```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
```

### Frontend Optimization
- ✅ Images lazy loaded
- ✅ Debounced search
- ✅ Pagination implemented
- ✅ Minimal dependencies

---

## 📝 Maintenance Tasks

### Daily
- ✅ Scraper runs automatically (8 AM PKT)
- Check logs: `tail -f logs/scraper.log`

### Weekly
- Review scraper success rate
- Check database size: `du -sh data/aiclinix.db`
- Monitor API response times

### Monthly
- Backup database: `cp data/aiclinix.db backups/aiclinix_$(date +%Y%m%d).db`
- Update dependencies: `pip install -r requirements.txt --upgrade`
- Review and update scrapers if websites change

---

## 🎓 Advanced Features (Future)

### Add More Scrapers
1. Create new scraper class in `scraper_sources_enhanced.py`
2. Add to `SCRAPER_REGISTRY`
3. Test with `python scraper.py`

### Add User Accounts
1. Install `fastapi-users`
2. Add authentication endpoints
3. Update frontend with login/signup

### Add AI Chat (GPT)
Replace rule-based agent in `api_chat_query.py`:
```python
import openai

def handle_query_with_ai(query: str, medicines: List):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a medicine price assistant."},
            {"role": "user", "content": query}
        ]
    )
    return response.choices[0].message.content
```

---

## 📞 Support & Resources

### Documentation
- **API Docs**: http://localhost:8000/docs
- **README**: See `README.md`
- **Quick Start**: See `QUICKSTART.md`

### Common Commands
```bash
# Start app
python app_fullstack.py

# Run scraper
python scraper.py

# Test API
python test_api.py

# Initialize DB
python setup.py

# Generate sitemap
python generate_sitemap.py
```

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] Update `config.js` with production API URL
- [ ] Set environment variables on hosting platform
- [ ] Test all API endpoints
- [ ] Run scraper manually once
- [ ] Verify database has data
- [ ] Test frontend on mobile devices
- [ ] Check SEO meta tags
- [ ] Verify robots.txt and sitemap.xml
- [ ] Add Google Analytics (optional)
- [ ] Set up monitoring/alerts
- [ ] Test with different browsers
- [ ] Verify disclaimers are visible
- [ ] Check page load times (<2.5s)
- [ ] Verify no console errors
- [ ] Test search functionality
- [ ] Test filters
- [ ] Test pagination

---

## 🎉 Launch Steps

1. **Deploy Backend**
   ```bash
   git push origin main  # Railway auto-deploys
   ```

2. **Verify Deployment**
   - Visit https://your-domain.com
   - Check https://your-domain.com/health
   - Test API at https://your-domain.com/api/v1/medicines

3. **Configure Domain**
   - Point DNS to Railway/VPS
   - Enable HTTPS
   - Test with custom domain

4. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools
   - Submit sitemap

5. **Apply for Google AdSense**
   - Ensure all legal pages exist
   - Have disclaimers on all pages
   - Wait for approval (can take weeks)

---

## 🏆 Success Metrics

Track these KPIs:
- Daily active medicines in database
- Search queries per day
- Most searched medicines
- Scraper success rate
- API response times
- Page load speeds
- Mobile usage %

---

**Built with ❤️ for Pakistan's Healthcare Transparency**

**Version**: 1.0.0  
**Last Updated**: February 6, 2026  
**Status**: ✅ Production Ready
