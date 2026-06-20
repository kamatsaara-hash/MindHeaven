from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import ReportCreate, ReportResponse
from app.services.service import create_report
from app.routers.posts import get_current_user
from app.database.database import db

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("", response_model=ReportResponse)
async def create_new_report(
    report_create: ReportCreate,
    current_user = Depends(get_current_user)
):
    try:
        report = create_report(report_create, current_user["id"])
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users")
async def get_users_for_reporting(current_user = Depends(get_current_user)):
    try:
        # Fetch all users in database (excluding current user)
        # Return only id, nickname, and email
        users = list(db.users.find(
            {"id": {"$ne": current_user["id"]}},
            {"_id": False, "id": True, "nickname": True, "email": True}
        ))
        # Ensure name mapping is present (nickname or email)
        formatted_users = []
        for u in users:
            formatted_users.append({
                "id": u.get("id"),
                "nickname": u.get("nickname") or u.get("email") or "Anonymous User"
            })
        return formatted_users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
