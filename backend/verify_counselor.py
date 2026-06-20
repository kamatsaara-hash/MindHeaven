import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# Assume standard connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.mindhaven

async def verify_counselor():
    counselor = await db.users.find_one({"role": "counselor"})
    if counselor:
        print(f"Found counselor: {counselor['email']}, updating status to Verified...")
        result = await db.users.update_one({"_id": counselor["_id"]}, {"$set": {"status": "Verified"}})
        print(f"Modified count: {result.modified_count}")
    else:
        print("No counselor found.")

if __name__ == "__main__":
    asyncio.run(verify_counselor())
