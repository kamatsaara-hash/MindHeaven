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

# CORS Configuration - Allow all origins during development
CORS_ORIGINS = ["*"]

# For production, use specific origins:
# CORS_ORIGINS = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]
