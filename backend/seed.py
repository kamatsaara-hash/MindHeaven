"""Seed data for MindHaven database"""
import sys
import os

# Add the current directory to sys.path so we can import from seed_mongo
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from seed_mongo import seed_database

if __name__ == "__main__":
    seed_database()
