from pymongo import MongoClient
from datetime import datetime, timedelta
import uuid
import random

MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database("mindhaven")

# Sample review comments based on specialization categories
review_pool = {
    "Anxiety & Stress Management": [
        "Incredible sessions. Dr. Priya helped me manage my panic attacks and gave me practical techniques to use daily.",
        "Very understanding and patient. I feel much more in control of my anxiety now.",
        "A life-changing experience. Highly recommend for stress management."
    ],
    "Depression & Mood Disorders": [
        "Dr. Arjun is incredibly empathetic. He helped me navigate through my darkest times.",
        "An amazing therapist. The sessions feel like a safe haven.",
        "Very professional and supportive. I have seen significant improvement in my mood."
    ],
    "Relationship & Family Therapy": [
        "Helped us communicate much better as a couple. Highly recommend her family counseling.",
        "Dr. Sneha provided us with the tools to resolve our conflicts constructively.",
        "Very insightful. She helped us understand each other's perspectives."
    ],
    "Trauma & PTSD": [
        "The EMDR sessions with Dr. Rohan were intense but incredibly healing. He is a wonderful guide.",
        "I felt safe and supported throughout the trauma recovery process.",
        "Highly skilled and compassionate therapist."
    ],
    "Academic & Career Stress": [
        "Really helped me overcome burnout. I have a much healthier work-life balance now.",
        "Perfect therapist for young professionals. Very practical advice.",
        "Dr. Meera helped me navigate career anxiety and make the right choices."
    ],
    "Addiction & Recovery": [
        "Dr. Vikram's support was pivotal in my recovery journey. Highly recommend.",
        "A non-judgmental and extremely supportive therapist.",
        "Helped me build resilience and stay on track with my goals."
    ],
    "Child & Adolescent Mental Health": [
        "My teenage daughter opened up to Dr. Ananya immediately. She has been a great support.",
        "Excellent child psychologist. Very patient and engaging.",
        "Highly recommend for adolescent behavioral support."
    ],
    "OCD & Phobias": [
        "The ERP treatment structure was clear and very effective for my OCD.",
        "Dr. Suresh is highly knowledgeable. I feel much more confident managing my triggers.",
        "Helped me break free from repetitive cycles of anxiety."
    ],
    "Grief & Loss": [
        "Dr. Kavitha helped me navigate the painful loss of my partner. Extremely compassionate.",
        "Her bereavement support was a lifeline during a very difficult time.",
        "A very kind and empathetic listener."
    ],
    "Self-Esteem & Personal Growth": [
        "Highly recommend for anyone looking to build self-compassion and confidence.",
        "Dr. Rahul has a very positive, encouraging, and authentic approach.",
        "Great guidance for personal growth and resilience."
    ]
}

generic_reviews = [
    "An exceptional therapist who really listens and cares.",
    "Very professional, clean scheduling, and super helpful sessions.",
    "Highly recommended. Extremely knowledgeable and compassionate."
]

user_names = [
    "Aarav S.", "Riya M.", "Amit K.", "Neha P.", "Siddharth J.",
    "Anjali D.", "Vikram R.", "Pooja H.", "Karan G.", "Sneha B."
]

counselors = list(db.users.find({"role": "counselor"}))
print(f"Found {len(counselors)} counselors. Seeding reviews...")

inserted_count = 0

for c in counselors:
    counselor_id = c["id"]
    spec = c.get("specialization", "General")
    
    # Check if there are already reviews for this counselor
    existing_count = db.counselor_reviews.count_documents({"counselor_id": counselor_id})
    if existing_count > 0:
        print(f"  Counselor {c['nickname']} already has {existing_count} reviews. Skipping review generation.")
        continue

    # Determine templates to use
    templates = review_pool.get(spec, generic_reviews)
    num_reviews = random.randint(2, 3)
    
    selected_users = random.sample(user_names, num_reviews)
    selected_templates = random.sample(templates, min(len(templates), num_reviews))
    
    reviews_added = []
    total_rating = 0
    
    for i in range(num_reviews):
        # Determine rating based on counselor's average rating field
        counselor_rating = c.get("rating", 4.8)
        # Give ratings close to the counselor's target rating
        rating = random.choice([5, 5, 4]) if counselor_rating >= 4.8 else random.choice([5, 4, 4, 3])
        
        # Ensure we have a template
        comment = selected_templates[i] if i < len(selected_templates) else random.choice(generic_reviews)
        
        review_doc = {
            "id": str(uuid.uuid4()),
            "counselor_id": counselor_id,
            "user_id": str(uuid.uuid4()),
            "user_nickname": selected_users[i],
            "rating": rating,
            "comment": comment,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30))
        }
        
        db.counselor_reviews.insert_one(review_doc)
        reviews_added.append(review_doc)
        total_rating += rating
        inserted_count += 1
        
    # Update user document with the calculated ratings
    avg_rating = round(total_rating / num_reviews, 1)
    db.users.update_one(
        {"id": counselor_id},
        {"$set": {"rating": avg_rating, "reviews": num_reviews}}
    )
    print(f"  [OK] Added {num_reviews} reviews for {c['nickname']} (New Rating: {avg_rating})")

print(f"\nDone! Successfully seeded {inserted_count} reviews across counselors.")
client.close()
