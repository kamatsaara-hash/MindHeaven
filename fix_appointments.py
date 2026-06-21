from pymongo import MongoClient
import random

MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database("mindhaven")

# 1. Get all active counselors
counselors = list(db.users.find({"role": "counselor"}))
counselor_ids = [c["id"] for c in counselors]
print(f"Found {len(counselors)} counselors in the database.")

# 2. Get all active users (excluding counselors and admins)
users = list(db.users.find({"role": {"$nin": ["counselor", "admin"]}}))
user_ids = [u["id"] for u in users]
print(f"Found {len(users)} users in the database.")

if not counselor_ids:
    print("Error: No counselors found. Run the seed script first!")
    client.close()
    exit(1)

if not user_ids:
    print("Error: No users found. Run the seed script first!")
    client.close()
    exit(1)

# 3. Find and update appointments
appointments = list(db.appointments.find())
print(f"Checking {len(appointments)} appointments...")

updated_count = 0

for apt in appointments:
    apt_id = apt["id"]
    counselor_id = apt.get("counselor_id")
    user_id = apt.get("user_id")
    
    update_fields = {}
    
    # Check if counselor exists
    counselor_exists = db.users.find_one({"id": counselor_id, "role": "counselor"}) is not None
    if not counselor_exists:
        new_counselor = random.choice(counselors)
        update_fields["counselor_id"] = new_counselor["id"]
        print(f"  - Appointment {apt_id}: Reassigned from invalid counselor '{counselor_id}' to '{new_counselor['nickname']}'")
        
    # Check if user exists
    user_exists = db.users.find_one({"id": user_id, "role": "user"}) is not None
    if not user_exists:
        new_user = random.choice(users)
        update_fields["user_id"] = new_user["id"]
        print(f"  - Appointment {apt_id}: Reassigned from invalid client '{user_id}' to '{new_user['nickname']}'")
        
    if update_fields:
        db.appointments.update_one({"id": apt_id}, {"$set": update_fields})
        updated_count += 1

print(f"\nDone! Fixed {updated_count} appointments with invalid foreign keys.")
client.close()
