# pyrefly: ignore [missing-import]
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class WarningModel(BaseModel):
    reason: str
    date: datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    nickname: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    nickname: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    is_anonymous: bool
    created_at: datetime
    warnings: Optional[List[WarningModel]] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    bio: Optional[str] = None

# Token Schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Category Schemas
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    color: str

    class Config:
        from_attributes = True

# Post Schemas
class PostCreate(BaseModel):
    content: str
    category_id: str

class PostUpdate(BaseModel):
    content: Optional[str] = None
    category_id: Optional[str] = None

class PostResponse(BaseModel):
    id: str
    content: str
    category_id: str
    author: UserResponse
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    comments_count: int = 0
    liked: bool = False

    class Config:
        from_attributes = True

# Comment Schemas
class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    content: str
    post_id: str
    author: UserResponse
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    liked: bool = False

    class Config:
        from_attributes = True

# Resource Schemas
class ResourceCreate(BaseModel):
    title: str
    description: str
    content: str
    resource_type: str
    category_id: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class ResourceResponse(BaseModel):
    id: str
    title: str
    description: str
    resource_type: str
    category_id: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    views: int
    created_at: datetime
    likes_count: int = 0
    liked: bool = False
    saved: bool = False

    class Config:
        from_attributes = True

# Counselor Schemas
class CounselorCreate(BaseModel):
    name: str
    specialization: str
    bio: str
    email: EmailStr
    phone: Optional[str] = None
    availability: str

class CounselorResponse(BaseModel):
    id: str
    name: str
    specialization: str
    bio: str
    email: str
    phone: Optional[str] = None
    availability: str
    rating: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Report Schemas
class ReportCreate(BaseModel):
    content_id: str
    content_type: str
    reason: str
    description: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    content_id: str
    content_type: str
    reason: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Pagination
class PaginatedResponse(BaseModel):
    data: list
    total: int
    page: int
    page_size: int
    has_more: bool
