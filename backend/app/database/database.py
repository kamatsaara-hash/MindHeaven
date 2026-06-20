from pymongo import MongoClient
from pymongo.database import Database
import os
from dotenv import load_dotenv
from typing import cast

load_dotenv()

# The MongoDB URI provided by the user
MONGO_URI = os.getenv("DATABASE_URL", "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority")

# Fallback to Atlas MongoDB URI if DATABASE_URL is set to a SQL database (like postgresql or sqlite)
if MONGO_URI.startswith("postgresql://") or MONGO_URI.startswith("sqlite://"):
    MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"

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
