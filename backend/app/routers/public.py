from fastapi import APIRouter
from app.database.database import db

from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(prefix="/public", tags=["public"])

class AppointmentCreate(BaseModel):
    counselor_id: str
    user_id: str
    appointment_date: str  # Format: "YYYY-MM-DD"
    appointment_time: str  # Format: "10:00 AM"
    notes: str = "Regular session"

@router.post("/appointments")
async def create_public_appointment(payload: AppointmentCreate):
    new_id = str(uuid.uuid4())
    try:
        dt_str = f"{payload.appointment_date} {payload.appointment_time}"
        appointment_date = datetime.strptime(dt_str, "%Y-%m-%d %I:%M %p")
    except Exception:
        appointment_date = datetime.utcnow()

    db.appointments.insert_one({
        "id": new_id,
        "counselor_id": payload.counselor_id,
        "user_id": payload.user_id,
        "appointment_date": appointment_date,
        "time_str": payload.appointment_time,
        "status": "Pending Approval",
        "notes": payload.notes,
        "created_at": datetime.utcnow()
    })
    return {"message": "Appointment booked successfully", "appointment_id": new_id}

@router.get("/counselors")
async def get_verified_counselors():
    """Get all verified counselors for public display"""
    counselors = list(db.users.find({"role": "counselor", "status": "Verified"}, {"_id": False, "hashed_password": False}))
    formatted = []
    for c in counselors:
        formatted.append({
            "id": c.get("id"),
            "name": c.get("nickname") or c.get("email"),
            "email": c.get("email"),
            "specialization": c.get("specialization", "General"),
            "bio": c.get("bio", "Licensed professional ready to help you navigate life's challenges."),
            "qualifications": c.get("qualifications", []),
            "rating": c.get("rating", 4.5),
            "reviews": c.get("reviews", 0),
            "verified": True,
            "phone": c.get("phone", "Available on profile"),
            "availability": c.get("availability", "Contact for availability"),
            "hourly_rate": c.get("hourly_rate", 0),
            "sessions_completed": c.get("sessions_completed", 0)
        })
    return formatted

@router.get("/counselors/{counselor_id}")
async def get_counselor_details(counselor_id: str):
    """Get detailed information about a specific verified counselor"""
    counselor = db.users.find_one({"id": counselor_id, "role": "counselor", "status": "Verified"}, {"_id": False, "hashed_password": False})
    if not counselor:
        return {"error": "Counselor not found"}
    
    return {
        "id": counselor.get("id"),
        "name": counselor.get("nickname") or counselor.get("email"),
        "email": counselor.get("email"),
        "specialization": counselor.get("specialization", "General"),
        "bio": counselor.get("bio", ""),
        "qualifications": counselor.get("qualifications", []),
        "rating": counselor.get("rating", 4.5),
        "reviews": counselor.get("reviews", 0),
        "verified": True,
        "phone": counselor.get("phone", ""),
        "availability": counselor.get("availability", ""),
        "hourly_rate": counselor.get("hourly_rate", 0),
        "sessions_completed": counselor.get("sessions_completed", 0),
        "joined_date": counselor.get("created_at", "").isoformat() if counselor.get("created_at") else ""
    }

@router.get("/counselors/by-specialization/{specialization}")
async def get_counselors_by_specialization(specialization: str):
    """Get verified counselors filtered by specialization"""
    counselors = list(db.users.find(
        {"role": "counselor", "status": "Verified", "specialization": {"$regex": specialization, "$options": "i"}},
        {"_id": False, "hashed_password": False}
    ))
    formatted = []
    for c in counselors:
        formatted.append({
            "id": c.get("id"),
            "name": c.get("nickname") or c.get("email"),
            "specialization": c.get("specialization", "General"),
            "bio": c.get("bio", ""),
            "rating": c.get("rating", 4.5),
            "reviews": c.get("reviews", 0),
            "verified": True,
            "phone": c.get("phone", ""),
            "availability": c.get("availability", ""),
            "hourly_rate": c.get("hourly_rate", 0)
        })
    return formatted
