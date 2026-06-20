from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.service import create_user, get_user_by_email, create_anonymous_user, count_user_reports
from app.database.database import db
from app.auth.jwt import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResponse)
async def signup(user_create: UserCreate):
    # Check if user already exists
    existing_user = get_user_by_email(user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = create_user(user_create)
    
    # Generate token
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
async def login(user_login: UserLogin):
    # Find user by email
    user = get_user_by_email(user_login.email)
    if not user or not verify_password(user_login.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Auto-block user if reported > 5 times
    report_count = count_user_reports(user["id"])
    if report_count > 5:
        db.users.update_one({"id": user["id"]}, {"$set": {"status": "Blocked"}})
        user["status"] = "Blocked"

    if user.get("status") == "Blocked":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is blocked. Contact Admin."
        )
    
    # Generate token
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/guest", response_model=TokenResponse)
async def guest_login():
    # Create anonymous user
    user = create_anonymous_user()
    
    # Generate token
    access_token = create_access_token(
        data={"sub": user["id"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
