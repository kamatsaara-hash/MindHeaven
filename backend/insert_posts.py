import os
import uuid
from datetime import datetime
from pymongo import MongoClient

# Use the exact Mongo URI from the user
MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client.mindhaven

# Create a dummy user to be the author
dummy_user_id = str(uuid.uuid4())
db.users.insert_one({
    "id": dummy_user_id,
    "email": "dummy@example.com",
    "nickname": "MindfulJourney",
    "hashed_password": "dummy",
    "is_anonymous": False,
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
})

# Posts to insert
posts = [
    {
        "id": str(uuid.uuid4()),
        "user_id": dummy_user_id,
        "content": "I've been feeling extremely burned out from my classes lately. Just wanted to vent. Does anyone else feel like they are drowning in assignments?",
        "category_id": "academic",
        "likes_count": 5,
        "comments_count": 0,
        "is_reported": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "user_id": dummy_user_id,
        "content": "Reminder to drink some water and take a 5 minute stretch break today! Self care is not selfish.",
        "category_id": "selfcare",
        "likes_count": 12,
        "comments_count": 0,
        "is_reported": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "user_id": dummy_user_id,
        "content": "My social anxiety was really bad today, but I managed to go out and get a coffee anyway. Small victories!",
        "category_id": "anxiety",
        "likes_count": 8,
        "comments_count": 0,
        "is_reported": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "user_id": dummy_user_id,
        "content": "Sometimes the hardest part is just waking up and deciding to keep going. Sending love to everyone struggling right now.",
        "category_id": "depression",
        "likes_count": 20,
        "comments_count": 0,
        "is_reported": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

db.posts.insert_many(posts)
print("Successfully inserted 4 posts into the Community!")
