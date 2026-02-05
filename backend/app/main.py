"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import blends, health, score_scales, taste_histories, auth, monthly_coffees, recommendations, analysis_results, analytics

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    description="MyCoffee.AI Backend API",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development only - allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(blends.router, prefix="/api/blends", tags=["blends"])
app.include_router(score_scales.router, prefix="/api/score-scales", tags=["score-scales"])
app.include_router(taste_histories.router, prefix="/api/taste-histories", tags=["taste-histories"])
app.include_router(monthly_coffees.router, prefix="/api/monthly-coffees", tags=["monthly-coffees"])
app.include_router(recommendations.router, prefix="/api", tags=["recommendations"])
app.include_router(analysis_results.router, prefix="/api", tags=["analysis-results"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to MyCoffee.AI API",
        "version": "0.1.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
    )
