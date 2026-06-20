import uuid
from datetime import datetime
from app.database.database import db
from app.auth.jwt import hash_password

def generate_id():
    return str(uuid.uuid4())

def seed_database():
    print("Seeding MongoDB database...")

    # Clear existing users for a fresh start (optional, but good for testing)
    # db.users.delete_many({})
    
    # 1. Add Admin User
    admin_email = "admin@gmail.com"
    existing_admin = db.users.find_one({"email": admin_email})
    if not existing_admin:
        admin_user = {
            "id": generate_id(),
            "email": admin_email,
            "hashed_password": hash_password("admin 123"),
            "nickname": "Super Admin",
            "role": "admin",
            "status": "Active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        db.users.insert_one(admin_user)
        print("[OK] Added Admin User")
    else:
        db.users.update_one(
            {"email": admin_email},
            {"$set": {"hashed_password": hash_password("admin 123"), "role": "admin"}}
        )
        print("[OK] Updated existing Admin User password to 'admin 123'")

    # 2. Add comprehensive Counselor data with all details
    counselors_data = [
        {
            "name": "Dr. Sarah Mitchell",
            "email": "sarah@mindhaven.com",
            "specialization": "Anxiety & Stress",
            "bio": "Licensed therapist with 10+ years of experience in cognitive behavioral therapy (CBT). Specialized in anxiety disorders and stress management.",
            "qualifications": ["PhD in Clinical Psychology", "Licensed Professional Counselor (LPC)", "Certified CBT Practitioner"],
            "phone": "+1-555-0101",
            "availability": "Mon-Fri 9AM-5PM EST",
            "rating": 4.9,
            "reviews": 147,
            "sessions_completed": 500,
            "hourly_rate": 120,
            "verified": True,
            "status": "Verified"
        },
        {
            "name": "James Chen, MD",
            "email": "james@mindhaven.com",
            "specialization": "Depression & Mood Disorders",
            "bio": "Board-certified psychiatrist specializing in mood management and medication therapy. 8+ years of clinical practice.",
            "qualifications": ["MD in Psychiatry", "Board Certified Psychiatrist", "Addiction Medicine Specialist"],
            "phone": "+1-555-0102",
            "availability": "Mon-Fri 2PM-8PM EST",
            "rating": 4.8,
            "reviews": 203,
            "sessions_completed": 680,
            "hourly_rate": 150,
            "verified": True,
            "status": "Verified"
        },
        {
            "name": "Emily Johnson",
            "email": "emily@mindhaven.com",
            "specialization": "Student Wellness",
            "bio": "School counselor helping students with academic stress, social anxiety, and career planning. 6+ years working with adolescents.",
            "qualifications": ["Masters in School Counseling", "Licensed Professional Counselor (LPC)", "Certified Academic Coach"],
            "phone": "+1-555-0103",
            "availability": "Mon-Fri 3PM-6PM EST, Weekends 10AM-2PM",
            "rating": 4.9,
            "reviews": 189,
            "sessions_completed": 410,
            "hourly_rate": 100,
            "verified": True,
            "status": "Verified"
        },
        {
            "name": "Michael Rodriguez",
            "email": "michael@mindhaven.com",
            "specialization": "Relationship & Family Therapy",
            "bio": "Licensed Marriage and Family Therapist with expertise in couples counseling and family dynamics. 12+ years of experience.",
            "qualifications": ["Masters in Marriage & Family Therapy", "LMFT License", "Couples Therapy Specialist"],
            "phone": "+1-555-0104",
            "availability": "Tue-Sat 10AM-7PM EST",
            "rating": 4.7,
            "reviews": 165,
            "sessions_completed": 520,
            "hourly_rate": 130,
            "verified": True,
            "status": "Verified"
        },
        {
            "name": "Dr. Priya Patel",
            "email": "priya@mindhaven.com",
            "specialization": "Trauma & PTSD",
            "bio": "Trauma-specialized therapist using EMDR and somatic therapies. Worked with various populations including veterans and survivors.",
            "qualifications": ["PhD in Counseling Psychology", "EMDR Certified Therapist", "Trauma-Focused Cognitive Behavioral Therapy"],
            "phone": "+1-555-0105",
            "availability": "Mon, Wed, Fri 2PM-8PM EST, Sat 10AM-4PM",
            "rating": 4.95,
            "reviews": 124,
            "sessions_completed": 380,
            "hourly_rate": 140,
            "verified": True,
            "status": "Verified"
        },
        {
            "name": "David Lee",
            "email": "david@mindhaven.com",
            "specialization": "Addiction & Recovery",
            "bio": "Substance abuse counselor with personal recovery background. Specialized in support for individuals and families dealing with addiction.",
            "qualifications": ["Masters in Addiction Counseling", "Certified Addiction Counselor (CAC)", "Recovery Coach Certified"],
            "phone": "+1-555-0106",
            "availability": "Daily 8AM-6PM EST",
            "rating": 4.8,
            "reviews": 198,
            "sessions_completed": 620,
            "hourly_rate": 110,
            "verified": True,
            "status": "Verified"
        },
        {
            "name": "Lisa Wong (New Counselor)",
            "email": "lisa@mindhaven.com",
            "specialization": "Grief & Loss",
            "bio": "Bereavement counselor helping individuals and families navigate grief and loss. Recently completed certification.",
            "qualifications": ["Masters in Counseling", "Grief Counseling Certification", "Pending LPC"],
            "phone": "+1-555-0107",
            "availability": "Mon-Thu 1PM-6PM EST",
            "rating": 0,
            "reviews": 0,
            "sessions_completed": 0,
            "hourly_rate": 95,
            "verified": False,
            "status": "Pending Verification"
        }
    ]
    
    for c in counselors_data:
        if not db.users.find_one({"email": c["email"]}):
            db.users.insert_one({
                "id": generate_id(),
                "email": c["email"],
                "hashed_password": hash_password("counselor123"),
                "nickname": c["name"],
                "role": "counselor",
                "specialization": c["specialization"],
                "bio": c.get("bio", ""),
                "qualifications": c.get("qualifications", []),
                "phone": c.get("phone", ""),
                "availability": c.get("availability", ""),
                "rating": c.get("rating", 0),
                "reviews": c.get("reviews", 0),
                "sessions_completed": c.get("sessions_completed", 0),
                "hourly_rate": c.get("hourly_rate", 0),
                "verified": c.get("verified", False),
                "status": c.get("status", "Pending Verification"),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            print(f"[OK] Added Counselor: {c['name']} ({c['status']})")
        else:
            print(f"Counselor already exists: {c['name']}")

    # 3. Add some Regular Users
    users_data = [
        {"name": "Alice Smith", "email": "alice@example.com", "riskLevel": "Low"},
        {"name": "Bob Johnson", "email": "bob@example.com", "riskLevel": "Medium"},
        {"name": "Charlie Brown", "email": "charlie@example.com", "riskLevel": "High"}
    ]
    
    for u in users_data:
        if not db.users.find_one({"email": u["email"]}):
            db.users.insert_one({
                "id": generate_id(),
                "email": u["email"],
                "hashed_password": hash_password("user123"),
                "nickname": u["name"],
                "role": "user",
                "status": "Active",
                "riskLevel": u["riskLevel"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            print(f"[OK] Added User: {u['name']}")

    # 4. Add some Reports if none exist
    if db.reports.count_documents({}) == 0:
        reports_data = [
            {"author": "Anonymous User", "content": "I just can't take it anymore. Everything is falling apart.", "riskTag": "High", "status": "pending"},
            {"author": "Charlie Brown", "content": "This other user is harassing me in DMs.", "riskTag": "Medium", "status": "pending"}
        ]
        for r in reports_data:
            db.reports.insert_one({
                "id": generate_id(),
                "author": r["author"],
                "content": r["content"],
                "riskTag": r["riskTag"],
                "status": r["status"],
                "reportedAt": datetime.utcnow().isoformat(),
                "created_at": datetime.utcnow()
            })
        print("[OK] Added Mock Reports")

    # 5. Add some Crisis Alerts if none exist
    if db.crisis_alerts.count_documents({}) == 0:
        crisis_alerts_data = [
            {
                "type": "Self-Harm Keyword Detection",
                "user": "Anonymous284",
                "content": "I don't see the point anymore.",
                "risk": "High",
                "status": "pending",
                "assignedCounselor": None
            },
            {
                "type": "Severe Anxiety Pattern",
                "user": "Jane Doe",
                "content": "My heart won't stop racing, I can't breathe",
                "risk": "Medium",
                "status": "pending",
                "assignedCounselor": None
            }
        ]
        for a in crisis_alerts_data:
            db.crisis_alerts.insert_one({
                "id": generate_id(),
                "type": a["type"],
                "user": a["user"],
                "content": a["content"],
                "risk": a["risk"],
                "status": a["status"],
                "assignedCounselor": a["assignedCounselor"],
                "created_at": datetime.utcnow()
            })
        print("[OK] Added Mock Crisis Alerts")

    print("\nDatabase seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
