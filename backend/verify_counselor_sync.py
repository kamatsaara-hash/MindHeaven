from pymongo import MongoClient
import uuid
from app.auth.jwt import hash_password
from datetime import datetime

MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client.get_database("mindhaven")

counselor = db.users.find_one({"role": "counselor"})
if counselor:
    print(f"Found counselor: {counselor.get('email')}, updating status to Verified...")
    result = db.users.update_one({"_id": counselor["_id"]}, {"$set": {"status": "Verified"}})
    print(f"Modified count: {result.modified_count}")
else:
    print("No counselor found. Creating one...")
    new_id = str(uuid.uuid4())
    db.users.insert_one({
        "id": new_id,
        "email": "dr.sarah@mindhaven.com",
        "hashed_password": hash_password("securepassword"),
        "nickname": "Dr. Sarah Jenkins",
        "role": "counselor",
        "status": "Verified",
        "specialization": "Anxiety & Depression",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    print("Created Dr. Sarah Jenkins as a verified counselor.")
