from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.services import admin_service
from app.services.service import unblock_user, get_blocked_users, get_users_with_warnings
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])

class StatusUpdate(BaseModel):
    status: str

class UserCreateAdmin(BaseModel):
    name: str
    email: str
    role: str
    riskLevel: str
    password: str

class CounselorCreate(BaseModel):
    name: str
    email: str
    specialization: str
    bio: str = ""
    qualifications: List[str] = []
    phone: str = ""
    availability: str = ""
    hourly_rate: int = 0
    password: str = "counselor123"

class CounselorUpdate(BaseModel):
    specialization: Optional[str] = None
    bio: Optional[str] = None
    qualifications: Optional[List[str]] = None
    phone: Optional[str] = None
    availability: Optional[str] = None
    hourly_rate: Optional[int] = None
    status: Optional[str] = None

@router.get("/stats")
async def get_dashboard_stats():
    return admin_service.get_dashboard_stats()

@router.get("/users")
async def get_users():
    return admin_service.get_all_users()

@router.post("/users")
async def create_user(user_data: UserCreateAdmin):
    admin_service.create_user(user_data.dict())
    return {"message": "User created successfully"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    success = admin_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.patch("/users/{user_id}/status")
async def update_user_status(user_id: str, update: StatusUpdate):
    success = admin_service.update_user_status(user_id, update.status)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User status updated to {update.status}"}

@router.get("/blocked-users")
async def get_all_blocked_users():
    """Get all blocked users with their report counts."""
    return get_blocked_users()

@router.post("/users/{user_id}/unblock")
async def unblock_user_endpoint(user_id: str):
    """Unblock a user and reset their report count to zero."""
    success = unblock_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User unblocked successfully and report count reset to zero"}

@router.get("/counselors")
async def get_counselors():
    """Get all counselors with full details for admin management"""
    return admin_service.get_counselors()

@router.post("/counselors")
async def create_counselor(counselor_data: CounselorCreate):
    """Create a new counselor (admin only)"""
    try:
        admin_service.create_counselor(counselor_data.dict())
        return {"message": "Counselor created successfully", "status": "Pending Verification"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/counselors/{counselor_id}")
async def update_counselor(counselor_id: str, update: CounselorUpdate):
    """Update counselor information"""
    update_data = update.dict(exclude_unset=True)
    success = admin_service.update_counselor(counselor_id, update_data)
    if not success:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return {"message": "Counselor updated successfully"}

@router.delete("/counselors/{counselor_id}")
async def delete_counselor(counselor_id: str):
    """Delete a counselor"""
    success = admin_service.delete_counselor(counselor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return {"message": "Counselor deleted successfully"}

class ReportAction(BaseModel):
    action: str
    warning_reason: Optional[str] = None

class CrisisAction(BaseModel):
    action: str
    counselor_name: Optional[str] = None

@router.get("/reports")
async def get_reports():
    return admin_service.get_all_reports()

@router.post("/reports/{report_id}/action")
async def report_action(report_id: str, payload: ReportAction):
    success = admin_service.handle_report_action(report_id, payload.action, payload.warning_reason)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": f"Action {payload.action} completed successfully"}

@router.get("/crisis")
async def get_crisis():
    return admin_service.get_crisis_alerts()

@router.post("/crisis/{alert_id}/action")
async def crisis_action(alert_id: str, payload: CrisisAction):
    success = admin_service.handle_crisis_action(alert_id, payload.action, payload.counselor_name)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": f"Action {payload.action} completed successfully"}

@router.get("/warnings")
async def get_users_warnings():
    """Return list of users that have warnings"""
    return get_users_with_warnings()

@router.get("/appointments")
async def get_appointments():
    return admin_service.get_appointments()

@router.patch("/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, payload: StatusUpdate):
    success = admin_service.update_appointment_status(appointment_id, payload.status)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": f"Appointment status updated to {payload.status}"}
