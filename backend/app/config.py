import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./mindhaven.db"
)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DEBUG = os.getenv("DEBUG", "True") == "True"

# CORS Configuration
# In production, set CORS_ORIGINS env var to your frontend URL (comma-separated)
_cors_origins_env = os.getenv("CORS_ORIGINS", "")
if _cors_origins_env:
    CORS_ORIGINS = [origin.strip() for origin in _cors_origins_env.split(",") if origin.strip()]
else:
    # Allow all origins during development
    CORS_ORIGINS = ["*"]
