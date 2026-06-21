from pymongo import MongoClient
from datetime import datetime
import uuid
import bcrypt

MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database("mindhaven")

def hash_pw(pw):
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

counselors = [
    {
        "nickname": "Dr. Priya Sharma",
        "email": "priya.sharma@mindhaven.com",
        "specialization": "Anxiety & Stress Management",
        "bio": "With over 12 years of experience, Dr. Priya specializes in cognitive behavioral therapy and mindfulness-based stress reduction. She has helped hundreds of clients manage anxiety and reclaim their lives.",
        "qualifications": ["PhD Clinical Psychology – NIMHANS", "CBT Certified Practitioner", "Mindfulness-Based Stress Reduction (MBSR)"],
        "phone": "+91 98400 11111",
        "availability": "Mon–Fri, 9 AM – 5 PM IST",
        "hourly_rate": 1500,
        "rating": 4.9,
        "reviews": 127,
        "sessions_completed": 340,
    },
    {
        "nickname": "Dr. Arjun Mehta",
        "email": "arjun.mehta@mindhaven.com",
        "specialization": "Depression & Mood Disorders",
        "bio": "Dr. Arjun is a compassionate therapist with expertise in treating depression, bipolar disorder, and mood dysregulation. His integrative approach combines evidence-based techniques with holistic care.",
        "qualifications": ["MD Psychiatry – AIIMS Delhi", "Certified in DBT", "Member – Indian Psychiatric Society"],
        "phone": "+91 98400 22222",
        "availability": "Mon–Sat, 10 AM – 6 PM IST",
        "hourly_rate": 2000,
        "rating": 4.8,
        "reviews": 98,
        "sessions_completed": 285,
    },
    {
        "nickname": "Dr. Sneha Iyer",
        "email": "sneha.iyer@mindhaven.com",
        "specialization": "Relationship & Family Therapy",
        "bio": "Dr. Sneha helps individuals, couples, and families navigate relationship challenges, communication breakdowns, and life transitions. She creates a safe, non-judgmental space for healing.",
        "qualifications": ["M.Phil Clinical Psychology – University of Madras", "Certified Couples Therapist", "Emotionally Focused Therapy (EFT)"],
        "phone": "+91 98400 33333",
        "availability": "Tue–Sun, 11 AM – 7 PM IST",
        "hourly_rate": 1800,
        "rating": 4.7,
        "reviews": 84,
        "sessions_completed": 210,
    },
    {
        "nickname": "Dr. Rohan Kapoor",
        "email": "rohan.kapoor@mindhaven.com",
        "specialization": "Trauma & PTSD",
        "bio": "Dr. Rohan is a trauma-informed therapist trained in EMDR and somatic experiencing. He works with survivors of childhood trauma, accidents, and complex PTSD to help them process and heal.",
        "qualifications": ["PhD Psychology – Tata Institute", "EMDR Certified Therapist", "Somatic Experiencing Practitioner"],
        "phone": "+91 98400 44444",
        "availability": "Mon–Fri, 8 AM – 4 PM IST",
        "hourly_rate": 2200,
        "rating": 4.9,
        "reviews": 76,
        "sessions_completed": 198,
    },
    {
        "nickname": "Dr. Meera Nair",
        "email": "meera.nair@mindhaven.com",
        "specialization": "Academic & Career Stress",
        "bio": "Dr. Meera works primarily with students and young professionals experiencing burnout, academic pressure, and career anxiety. She blends solution-focused therapy with practical coping strategies.",
        "qualifications": ["M.Sc. Psychology – Kerala University", "Career Counseling Certificate – NCDA", "Burnout Recovery Specialist"],
        "phone": "+91 98400 55555",
        "availability": "Mon–Sat, 12 PM – 8 PM IST",
        "hourly_rate": 1200,
        "rating": 4.6,
        "reviews": 113,
        "sessions_completed": 312,
    },
    {
        "nickname": "Dr. Vikram Bose",
        "email": "vikram.bose@mindhaven.com",
        "specialization": "Addiction & Recovery",
        "bio": "Dr. Vikram specializes in substance use disorders, behavioral addictions, and recovery coaching. He uses motivational interviewing and 12-step facilitation to empower lasting change.",
        "qualifications": ["MD Psychiatry – Calcutta Medical College", "Addiction Psychiatry Board Certified", "Motivational Interviewing Trainer"],
        "phone": "+91 98400 66666",
        "availability": "Wed–Sun, 9 AM – 5 PM IST",
        "hourly_rate": 1900,
        "rating": 4.5,
        "reviews": 62,
        "sessions_completed": 175,
    },
    {
        "nickname": "Dr. Ananya Reddy",
        "email": "ananya.reddy@mindhaven.com",
        "specialization": "Child & Adolescent Mental Health",
        "bio": "Dr. Ananya is a child psychologist with 8 years of experience treating ADHD, learning disabilities, school phobia, and teenage depression. She uses play therapy and family-centred approaches.",
        "qualifications": ["M.Phil Child Psychology – Bangalore University", "Play Therapy Certified", "School Psychology Certificate"],
        "phone": "+91 98400 77777",
        "availability": "Mon–Fri, 9 AM – 6 PM IST",
        "hourly_rate": 1600,
        "rating": 4.8,
        "reviews": 89,
        "sessions_completed": 263,
    },
    {
        "nickname": "Dr. Suresh Pillai",
        "email": "suresh.pillai@mindhaven.com",
        "specialization": "OCD & Phobias",
        "bio": "Dr. Suresh is an OCD specialist with expertise in Exposure and Response Prevention (ERP). He also treats specific phobias, social anxiety disorder, and health anxiety with highly effective CBT protocols.",
        "qualifications": ["PhD Psychology – IIT Bombay", "OCD Specialist – IOCDF", "ERP Certified Therapist"],
        "phone": "+91 98400 88888",
        "availability": "Tue–Sat, 10 AM – 6 PM IST",
        "hourly_rate": 2100,
        "rating": 4.7,
        "reviews": 54,
        "sessions_completed": 143,
    },
    {
        "nickname": "Dr. Kavitha Menon",
        "email": "kavitha.menon@mindhaven.com",
        "specialization": "Grief & Loss",
        "bio": "Dr. Kavitha specializes in grief counseling, bereavement support, and end-of-life psychology. She helps individuals and families navigate loss with compassion, dignity, and evidence-based care.",
        "qualifications": ["M.Phil Clinical Psychology – Manipal University", "Grief Counseling Certification – ADEC", "Palliative Care Training"],
        "phone": "+91 98400 99999",
        "availability": "Mon–Fri, 10 AM – 5 PM IST",
        "hourly_rate": 1400,
        "rating": 4.9,
        "reviews": 71,
        "sessions_completed": 189,
    },
    {
        "nickname": "Dr. Rahul Joshi",
        "email": "rahul.joshi@mindhaven.com",
        "specialization": "Self-Esteem & Personal Growth",
        "bio": "Dr. Rahul is an ACT and positive psychology therapist who helps clients build resilience, self-compassion, and confidence. He's passionate about empowering people to live authentically and purposefully.",
        "qualifications": ["M.Sc. Applied Psychology – Pune University", "ACT Certified Therapist", "Positive Psychology Practitioner – MAPP"],
        "phone": "+91 98400 10101",
        "availability": "Mon–Sat, 8 AM – 2 PM IST",
        "hourly_rate": 1300,
        "rating": 4.6,
        "reviews": 102,
        "sessions_completed": 276,
    },
]

inserted = 0
skipped = 0

for c in counselors:
    # Skip if email already exists
    if db.users.find_one({"email": c["email"]}):
        print(f"  Skipping (exists): {c['nickname']}")
        skipped += 1
        continue

    db.users.insert_one({
        "id": str(uuid.uuid4()),
        "email": c["email"],
        "hashed_password": hash_pw("counselor123"),
        "nickname": c["nickname"],
        "role": "counselor",
        "specialization": c["specialization"],
        "bio": c["bio"],
        "qualifications": c["qualifications"],
        "phone": c["phone"],
        "availability": c["availability"],
        "hourly_rate": c["hourly_rate"],
        "rating": c["rating"],
        "reviews": c["reviews"],
        "sessions_completed": c["sessions_completed"],
        "status": "Verified",
        "verified": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })
    print(f"  [OK] Inserted: {c['nickname']} ({c['specialization']}) - Rating: {c['rating']}")
    inserted += 1

print(f"\nDone! {inserted} inserted, {skipped} skipped.")
client.close()
