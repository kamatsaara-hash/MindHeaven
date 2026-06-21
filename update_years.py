from pymongo import MongoClient
from datetime import datetime

MONGO_URI = "mongodb+srv://web:YLVC8wjgLOfzERQ7@cluster0.gitqnpn.mongodb.net/users?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database("mindhaven")

appointments = list(db.appointments.find())
print(f"Checking {len(appointments)} appointments...")

updated_count = 0

for apt in appointments:
    apt_id = apt["id"]
    apt_date = apt.get("appointment_date")
    
    if isinstance(apt_date, datetime):
        if apt_date.year != 2026:
            # Replace year with 2026
            new_date = apt_date.replace(year=2026)
            db.appointments.update_one({"id": apt_id}, {"$set": {"appointment_date": new_date}})
            print(f"  - Appointment {apt_id}: Updated year from {apt_date.year} to 2026 (New Date: {new_date})")
            updated_count += 1

print(f"\nDone! Updated year to 2026 for {updated_count} appointments.")
client.close()
