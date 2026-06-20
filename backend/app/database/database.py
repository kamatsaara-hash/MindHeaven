from pymongo import MongoClient
from pymongo.database import Database
import os
from dotenv import load_dotenv
from typing import cast

load_dotenv()

# MongoDB connection URI - MUST be set via environment variable in production
MONGO_URI = os.getenv("DATABASE_URL", "")

if not MONGO_URI:
    print("WARNING: DATABASE_URL environment variable not set. MongoDB connection will fail.")
    MONGO_URI = "mongodb://localhost:27017/mindhaven"

# Fallback to Atlas MongoDB URI if DATABASE_URL is set to a SQL database (like postgresql or sqlite)
if MONGO_URI.startswith("postgresql://") or MONGO_URI.startswith("sqlite://"):
    print("WARNING: DATABASE_URL appears to be a SQL connection string, not MongoDB. Please set a valid MongoDB URI.")

try:
    client = MongoClient(MONGO_URI)
    _db = client.get_database("mindhaven")  # Using 'mindhaven' as the database name
except Exception as e:
    print("Error connecting to MongoDB:", e)
    _db = None

db = cast(Database, _db)

# We can provide a dependency for FastAPI if needed, though for PyMongo global db is often fine.
def get_db():
    try:
        yield db
    finally:
        pass
