"""Comprehensive seed data for MindHaven database with posts, comments, and appointments"""

import uuid
from datetime import datetime, timedelta
from app.database.database import db
from app.auth.jwt import hash_password
import random

def generate_id():
    return str(uuid.uuid4())

def seed_comprehensive_data():
    print("🌱 Seeding comprehensive MindHaven database...")

    # 1. Clear collections (optional - comment out to preserve data)
    # db.users.delete_many({})
    # db.posts.delete_many({})
    # db.comments.delete_many({})
    # db.appointments.delete_many({})

    # 2. Add more regular users with varied risk levels
    print("\n📝 Adding more users...")
    additional_users = [
        {"name": "Sarah Connor", "email": "sarah.connor@example.com", "riskLevel": "High"},
        {"name": "John Davis", "email": "john.davis@example.com", "riskLevel": "Medium"},
        {"name": "Emma Wilson", "email": "emma.wilson@example.com", "riskLevel": "Low"},
        {"name": "Michael Brown", "email": "michael.brown@example.com", "riskLevel": "Medium"},
        {"name": "Lisa Anderson", "email": "lisa.anderson@example.com", "riskLevel": "High"},
        {"name": "Robert Taylor", "email": "robert.taylor@example.com", "riskLevel": "Low"},
        {"name": "Jennifer White", "email": "jennifer.white@example.com", "riskLevel": "Medium"},
        {"name": "David Miller", "email": "david.miller@example.com", "riskLevel": "Low"},
        {"name": "Patricia Garcia", "email": "patricia.garcia@example.com", "riskLevel": "High"},
        {"name": "James Martinez", "email": "james.martinez@example.com", "riskLevel": "Medium"},
    ]

    for u in additional_users:
        if not db.users.find_one({"email": u["email"]}):
            db.users.insert_one({
                "id": generate_id(),
                "email": u["email"],
                "hashed_password": hash_password("user123"),
                "nickname": u["name"],
                "role": "user",
                "status": "Active",
                "riskLevel": u["riskLevel"],
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 180)),
                "updated_at": datetime.utcnow()
            })
            print(f"  ✓ Added {u['name']}")

    # 3. Get some user IDs for posts and comments
    users = list(db.users.find({"role": "user"}, {"_id": False, "id": 1}))
    user_ids = [u["id"] for u in users]

    # 4. Add posts
    print("\n💬 Adding community posts...")
    post_data = [
        {
            "title": "Dealing with work stress",
            "content": "I've been feeling overwhelmed with work lately. Does anyone have tips for managing stress?",
            "category": "Work Burnout",
            "author_name": random.choice(users)["id"]
        },
        {
            "title": "Anxiety before exams",
            "content": "I'm really anxious about my upcoming exams. The pressure is getting to me.",
            "category": "Academic Pressure",
            "author_name": random.choice(users)["id"]
        },
        {
            "title": "Self-care routine that works",
            "content": "Just started a new self-care routine and it's helping so much! Who else practices self-care?",
            "category": "Self Care",
            "author_name": random.choice(users)["id"]
        },
        {
            "title": "Depression and motivation",
            "content": "Struggling to find motivation lately. Depression has been hitting hard.",
            "category": "Depression",
            "author_name": random.choice(users)["id"]
        },
        {
            "title": "Relationship advice needed",
            "content": "Going through a tough time in my relationship. Looking for some perspective.",
            "category": "Relationships",
            "author_name": random.choice(users)["id"]
        },
    ]

    posts = []
    for post in post_data:
        if db.posts.count_documents({"title": post["title"]}) == 0:
            post_id = generate_id()
            db.posts.insert_one({
                "id": post_id,
                "title": post["title"],
                "content": post["content"],
                "category": post["category"],
                "user_id": post["author_name"],
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                "updated_at": datetime.utcnow(),
                "likes": random.randint(0, 20),
                "comments_count": random.randint(0, 10),
                "status": "approved"
            })
            posts.append(post_id)
            print(f"  ✓ Added post: {post['title']}")

    # 5. Add comments to posts
    print("\n💭 Adding comments...")
    if len(posts) > 0:
        comments_data = [
            "This resonates with me. Thank you for sharing.",
            "I've been through this too. It gets better.",
            "Great perspective! Never thought about it that way.",
            "Completely understand. You're not alone.",
            "This helped me so much. Keep strong!",
            "Same situation here. We can get through this.",
            "Your story gave me hope. Thank you.",
        ]

        for i, post_id in enumerate(posts):
            num_comments = random.randint(2, 5)
            for _ in range(num_comments):
                db.comments.insert_one({
                    "id": generate_id(),
                    "post_id": post_id,
                    "user_id": random.choice(user_ids),
                    "content": random.choice(comments_data),
                    "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 15)),
                    "likes": random.randint(0, 5)
                })
        print(f"  ✓ Added {len(posts) * 3} comments")

    # 6. Add appointments
    print("\n📅 Adding appointments...")
    counselors = list(db.users.find({"role": "counselor", "status": "Verified"}, {"_id": False, "id": 1}))
    counselor_ids = [c["id"] for c in counselors]

    if len(counselor_ids) > 0 and len(user_ids) > 0:
        # Create some appointments for today and near future
        for i in range(random.randint(3, 6)):
            appointment_date = datetime.utcnow() + timedelta(days=random.randint(0, 7))
            db.appointments.insert_one({
                "id": generate_id(),
                "counselor_id": random.choice(counselor_ids),
                "user_id": random.choice(user_ids),
                "appointment_date": appointment_date,
                "status": "scheduled",
                "notes": "Regular session",
                "created_at": datetime.utcnow()
            })
            print(f"  ✓ Added appointment for {appointment_date.strftime('%Y-%m-%d')}")

    # 7. Summary
    print("\n" + "="*50)
    print("✅ Comprehensive database seeding completed!")
    print("="*50)
    print(f"📊 Current database status:")
    print(f"   • Total Users: {db.users.count_documents({})}")
    print(f"   • Active Users: {db.users.count_documents({'status': 'Active'})}")
    print(f"   • Counselors: {db.users.count_documents({'role': 'counselor'})}")
    print(f"   • Posts: {db.posts.count_documents({})}")
    print(f"   • Comments: {db.comments.count_documents({})}")
    print(f"   • Appointments: {db.appointments.count_documents({})}")
    print("="*50)

if __name__ == "__main__":
    seed_comprehensive_data()
