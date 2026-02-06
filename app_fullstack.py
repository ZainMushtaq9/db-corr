no"""
AIClinix - Main FastAPI Application
Serves both API and Frontend (React)
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from contextlib import asynccontextmanager
import uvicorn
import os

# Import API routers
from api_medicines import router as medicines_router
from api_companies import router as companies_router
from api_diseases import router as diseases_router
from api_search import router as search_router
from api_chat_query import router as chat_router

# Import scheduler
from scheduler import start_scheduler, stop_scheduler

# Import database
from database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting AIClinix API...")
    init_db()
    start_scheduler()
    yield
    # Shutdown
    print("🛑 Shutting down AIClinix API...")
    stop_scheduler()


# Initialize FastAPI app
app = FastAPI(
    title="AIClinix API",
    description="Medicine Price & Availability Information Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(medicines_router, prefix="/api/v1", tags=["Medicines"])
app.include_router(companies_router, prefix="/api/v1", tags=["Companies"])
app.include_router(diseases_router, prefix="/api/v1", tags=["Diseases"])
app.include_router(search_router, prefix="/api/v1", tags=["Search"])
app.include_router(chat_router, prefix="/api/v1", tags=["Chat Query"])


# Serve static files
@app.get("/config.js")
async def serve_config():
    """Serve config.js"""
    return FileResponse("config.js", media_type="application/javascript")


@app.get("/App.jsx")
async def serve_app():
    """Serve App.jsx"""
    return FileResponse("App.jsx", media_type="text/babel")


@app.get("/styles.css")
async def serve_styles():
    """Serve styles.css"""
    return FileResponse("styles.css", media_type="text/css")


@app.get("/robots.txt")
async def serve_robots():
    """Serve robots.txt"""
    return FileResponse("robots.txt", media_type="text/plain")


@app.get("/sitemap.xml")
async def serve_sitemap():
    """Serve sitemap.xml"""
    return FileResponse("sitemap.xml", media_type="application/xml")


# Serve assets if directory exists
if os.path.exists("assets"):
    app.mount("/assets", StaticFiles(directory="assets"), name="assets")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/v1/stats")
async def get_stats():
    """Get platform statistics"""
    from crud import get_statistics
    from database import SessionLocal
    
    db = SessionLocal()
    try:
        stats = get_statistics(db)
        return stats
    finally:
        db.close()


# Catch-all route for React Router (SPA)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """
    Serve frontend for all non-API routes
    This enables React Router to work properly
    """
    # If requesting a specific file that doesn't exist, return 404
    if "." in full_path and not full_path.endswith(".html"):
        return {"error": "File not found"}, 404
    
    # Serve index.html for all other routes (React Router will handle)
    return FileResponse("index.html")


if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        reload=False
    )
