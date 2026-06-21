from fastapi import APIRouter, HTTPException
from app.database.database import db

from pydantic import BaseModel
from datetime import datetime, timedelta
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

    # Check for slot availability
    existing = db.appointments.find_one({
        "counselor_id": payload.counselor_id,
        "appointment_date": appointment_date,
        "status": {"$nin": ["Declined", "declined", "Cancelled", "cancelled"]}
    })
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Appointment not available at that time. Try a different slot."
        )

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
            "name": c.get("nickname") or c.get("name") or c.get("email") or "Unknown Counselor",
            "email": c.get("email"),
            "specialization": c.get("specialization", "General"),
            "bio": c.get("bio", "Licensed professional ready to help you navigate life's challenges."),
            "qualifications": c.get("qualifications", []),
            "rating": c.get("rating") if c.get("rating") is not None else 0,
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


class ReviewCreate(BaseModel):
    user_id: str
    user_nickname: str
    rating: int  # 1-5
    comment: str = ""

@router.post("/counselors/{counselor_id}/reviews")
async def submit_review(counselor_id: str, review: ReviewCreate):
    """Submit a review for a counselor"""
    counselor = db.users.find_one({"id": counselor_id, "role": "counselor"}, {"_id": False})
    if not counselor:
        return {"error": "Counselor not found"}

    rating = max(1, min(5, review.rating))
    review_doc = {
        "id": str(uuid.uuid4()),
        "counselor_id": counselor_id,
        "user_id": review.user_id,
        "user_nickname": review.user_nickname,
        "rating": rating,
        "comment": review.comment,
        "created_at": datetime.utcnow()
    }
    db.counselor_reviews.insert_one(review_doc)

    # Recalculate average rating
    all_reviews = list(db.counselor_reviews.find({"counselor_id": counselor_id}))
    avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
    db.users.update_one(
        {"id": counselor_id},
        {"$set": {"rating": round(avg_rating, 1), "reviews": len(all_reviews)}}
    )
    return {"message": "Review submitted successfully", "review_id": review_doc["id"]}

@router.get("/counselors/{counselor_id}/reviews")
async def get_reviews(counselor_id: str):
    """Get all reviews for a counselor"""
    reviews = list(db.counselor_reviews.find(
        {"counselor_id": counselor_id},
        {"_id": False}
    ).sort("created_at", -1))
    for r in reviews:
        if isinstance(r.get("created_at"), datetime):
            r["created_at"] = r["created_at"].isoformat()
    return reviews


@router.get("/users/{user_id}/appointments")
async def get_user_appointments(user_id: str):
    """Get all appointments for a specific user"""
    appointments = list(db.appointments.find({"user_id": user_id}).sort("appointment_date", -1))
    formatted = []
    for apt in appointments:
        # Fetch counselor details
        counselor = db.users.find_one({"id": apt.get("counselor_id")})
        counselor_name = "Unknown Counselor"
        if counselor:
            counselor_name = counselor.get("nickname") or counselor.get("email") or "Unknown Counselor"
        
        # Format date & time
        apt_date = apt.get("appointment_date")
        date_str = "Unknown Date"
        time_str = apt.get("time_str") or "Unknown Time"
        
        if isinstance(apt_date, datetime):
            date_str = apt_date.strftime("%B %d, %Y")
            if not apt.get("time_str"):
                time_str = apt_date.strftime("%I:%M %p")
                
        # Auto-complete status for past sessions
        apt_status = apt.get("status", "Pending Approval")
        current_ist_time = datetime.utcnow() + timedelta(hours=5, minutes=30)
        if apt_status in ["Upcoming", "Pending Approval", "scheduled", "Pending"]:
            if isinstance(apt_date, datetime) and apt_date < current_ist_time:
                apt_status = "Completed"
                db.appointments.update_one({"id": apt.get("id")}, {"$set": {"status": "Completed"}})

        formatted.append({
            "id": apt.get("id"),
            "counselor_id": apt.get("counselor_id"),
            "counselor_name": counselor_name,
            "date": date_str,
            "time": time_str,
            "status": apt_status,
            "notes": apt.get("notes", ""),
            "type": "Video Call"
        })
    return formatted
