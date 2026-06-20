from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routers import auth, posts, resources, admin, public, reports

from app.database.database import db

# MongoDB doesn't require explicit table creation, it creates collections on the fly
# or you can pre-create them here if needed.
if db is not None:
    print("Successfully connected to MongoDB")

# Create app
app = FastAPI(
    title="MindHaven API",
    description="Mental Health Awareness & Support Platform",
    version="0.1.0"
)

# CORS middleware
# When using wildcard "*", credentials must be False per CORS spec.
# When using specific origins, credentials can be True.
_allow_credentials = "*" not in CORS_ORIGINS

# Always include the deployed frontend URL
_origins = CORS_ORIGINS if "*" not in CORS_ORIGINS else [
    "https://mindheaven-frontend.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(resources.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(public.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "MindHaven API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
