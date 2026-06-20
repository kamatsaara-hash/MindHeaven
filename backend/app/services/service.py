import uuid
from datetime import datetime
from typing import Any
from app.database.database import db
from app.schemas.schemas import (
    UserCreate, PostCreate, CommentCreate, ResourceCreate, 
    CounselorCreate, ReportCreate, UserResponse, PostResponse, CommentResponse, ResourceResponse
)
from app.auth.jwt import hash_password

def generate_id():
    return str(uuid.uuid4())

# User operations
def create_user(user_create: UserCreate) -> dict:
    user_dict = {
        "id": generate_id(),
        "email": user_create.email,
        "hashed_password": hash_password(user_create.password),
        "nickname": user_create.nickname,
        "phone": user_create.phone,
        "is_anonymous": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "bio": None,
        "avatar_url": None,
        "liked_posts": [],
        "liked_comments": [],
        "liked_resources": [],
        "saved_resources": []
    }
    db.users.insert_one(user_dict)
    return user_dict

def create_anonymous_user() -> dict:
    user_dict = {
        "id": generate_id(),
        "nickname": f"Anonymous User {uuid.uuid4().hex[:6]}",
        "is_anonymous": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "email": None,
        "hashed_password": None,
        "bio": None,
        "avatar_url": None,
        "liked_posts": [],
        "liked_comments": [],
        "liked_resources": [],
        "saved_resources": []
    }
    db.users.insert_one(user_dict)
    return user_dict

def get_user_by_email(email: str) -> dict | None:
    return db.users.find_one({"email": email}, {"_id": False})

def get_user_by_id(user_id: str | None) -> dict | None:
    return db.users.find_one({"id": user_id}, {"_id": False})

# Post operations
def create_post(post_create: PostCreate, user_id: str) -> dict:
    post_dict = {
        "id": generate_id(),
        "user_id": user_id,
        "content": post_create.content,
        "category_id": post_create.category_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_reported": False,
        "likes_count": 0,
        "comments_count": 0
    }
    db.posts.insert_one(post_dict)
    return get_post_response(post_dict)

def get_post_response(post_dict: dict, current_user_id: str | None = None) -> dict:
    author = get_user_by_id(post_dict.get("user_id"))
    post_dict["author"] = author if author else {"id": "unknown", "nickname": "Unknown", "is_anonymous": True, "created_at": datetime.utcnow()}
    
    if current_user_id:
        user = get_user_by_id(current_user_id)
        post_dict["liked"] = post_dict["id"] in (user.get("liked_posts", []) if user else [])
    else:
        post_dict["liked"] = False
        
    return post_dict

def get_posts(category_id: str | None = None, skip: int = 0, limit: int = 10, current_user_id: str | None = None):
    query: dict[str, Any] = {"is_reported": False}
    if category_id:
        query["category_id"] = category_id
        
    posts = list(db.posts.find(query, {"_id": False}).sort("created_at", -1).skip(skip).limit(limit))
    return [get_post_response(post, current_user_id) for post in posts]

def get_post_by_id(post_id: str, current_user_id: str | None = None) -> dict | None:
    post = db.posts.find_one({"id": post_id}, {"_id": False})
    if post:
        return get_post_response(post, current_user_id)
    return None

def delete_post(post_id: str) -> bool:
    result = db.posts.delete_one({"id": post_id})
    return result.deleted_count > 0

# Comment operations
def create_comment(comment_create: CommentCreate, post_id: str, user_id: str) -> dict:
    comment_dict = {
        "id": generate_id(),
        "post_id": post_id,
        "user_id": user_id,
        "content": comment_create.content,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_reported": False,
        "likes_count": 0
    }
    db.comments.insert_one(comment_dict)
    db.posts.update_one({"id": post_id}, {"$inc": {"comments_count": 1}})

    # Check for suicide / dying keywords (case-insensitive)
    content_lower = comment_create.content.lower()
    crisis_keywords = ["suicide", "suicidal", "kill myself", "end my life", "want to die", "commit suicide", "dying", "dieing"]
    has_crisis_mention = any(keyword in content_lower for keyword in crisis_keywords)
    
    if has_crisis_mention:
        # Mark user risk level as High
        db.users.update_one({"id": user_id}, {"$set": {"riskLevel": "High"}})
        
        # Retrieve nickname/email for the alert
        user = db.users.find_one({"id": user_id})
        user_name = "Anonymous User"
        if user:
            user_name = user.get("nickname") or user.get("email") or "Anonymous User"
            
        # Create crisis alert in db.crisis_alerts
        alert_id = str(uuid.uuid4())
        db.crisis_alerts.insert_one({
            "id": alert_id,
            "type": "Self-Harm Keyword Detection",
            "user": user_name,
            "content": comment_create.content,
            "risk": "High",
            "status": "pending",
            "assignedCounselor": None,
            "created_at": datetime.utcnow()
        })

    return get_comment_response(comment_dict)

def get_comment_response(comment_dict: dict, current_user_id: str | None = None) -> dict:
    author = get_user_by_id(comment_dict.get("user_id"))
    comment_dict["author"] = author if author else {"id": "unknown", "nickname": "Unknown", "is_anonymous": True, "created_at": datetime.utcnow()}
    
    if current_user_id:
        user = get_user_by_id(current_user_id)
        comment_dict["liked"] = comment_dict["id"] in (user.get("liked_comments", []) if user else [])
    else:
        comment_dict["liked"] = False
        
    return comment_dict

def get_comments(post_id: str, current_user_id: str | None = None):
    comments = list(db.comments.find({"post_id": post_id, "is_reported": False}, {"_id": False}).sort("created_at", -1))
    return [get_comment_response(c, current_user_id) for c in comments]

# Resource operations
def get_resource_response(resource_dict: dict, current_user_id: str | None = None) -> dict:
    if current_user_id:
        user = get_user_by_id(current_user_id)
        resource_dict["liked"] = resource_dict["id"] in (user.get("liked_resources", []) if user else [])
        resource_dict["saved"] = resource_dict["id"] in (user.get("saved_resources", []) if user else [])
    else:
        resource_dict["liked"] = False
        resource_dict["saved"] = False
    return resource_dict

def create_resource(resource_create: ResourceCreate) -> dict:
    resource_dict = resource_create.dict()
    resource_dict.update({
        "id": generate_id(),
        "views": 0,
        "likes_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    db.resources.insert_one(resource_dict)
    return get_resource_response(resource_dict)

def get_resources(category_id: str | None = None, skip: int = 0, limit: int = 12, current_user_id: str | None = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    resources = list(db.resources.find(query, {"_id": False}).sort("created_at", -1).skip(skip).limit(limit))
    return [get_resource_response(r, current_user_id) for r in resources]

def get_resource_by_id(resource_id: str, current_user_id: str | None = None) -> dict | None:
    db.resources.update_one({"id": resource_id}, {"$inc": {"views": 1}})
    resource = db.resources.find_one({"id": resource_id}, {"_id": False})
    if resource:
        return get_resource_response(resource, current_user_id)
    return None

# Like operations
def toggle_post_like(user_id: str, post_id: str) -> bool:
    user = get_user_by_id(user_id)
    if not user:
        return False
        
    liked_posts = user.get("liked_posts", [])
    if post_id in liked_posts:
        db.users.update_one({"id": user_id}, {"$pull": {"liked_posts": post_id}})
        db.posts.update_one({"id": post_id}, {"$inc": {"likes_count": -1}})
        return False
    else:
        db.users.update_one({"id": user_id}, {"$addToSet": {"liked_posts": post_id}})
        db.posts.update_one({"id": post_id}, {"$inc": {"likes_count": 1}})
        return True

# Report operations
def count_user_reports(user_id: str) -> int:
    # Get all post IDs for this user
    user_posts = [p["id"] for p in db.posts.find({"user_id": user_id}, {"id": 1})]
    # Get all comment IDs for this user
    user_comments = [c["id"] for c in db.comments.find({"user_id": user_id}, {"id": 1})]
    
    # Count matching reports in db.reports
    count = db.reports.count_documents({
        "$or": [
            {"reported_user_id": user_id},
            {"content_id": user_id, "content_type": "user"},
            {"content_id": {"$in": user_posts}, "content_type": "post"},
            {"content_id": {"$in": user_comments}, "content_type": "comment"}
        ]
    })
    return count

def create_report(report_create: ReportCreate, user_id: str) -> dict:
    report_dict = report_create.dict()
    
    # Identify the user being reported
    reported_user_id = None
    content_id = report_create.content_id
    content_type = report_create.content_type
    
    if content_type == "post":
        post = db.posts.find_one({"id": content_id})
        if post:
            reported_user_id = post.get("user_id")
    elif content_type == "comment":
        comment = db.comments.find_one({"id": content_id})
        if comment:
            reported_user_id = comment.get("user_id")
    elif content_type == "user":
        reported_user_id = content_id
        
    report_dict.update({
        "id": generate_id(),
        "user_id": user_id,
        "reported_user_id": reported_user_id,
        "status": "pending",
        "created_at": datetime.utcnow()
    })
    db.reports.insert_one(report_dict)

    # After saving, check if this reported user now has >= 3 reports → auto-warn
    if reported_user_id:
        total_reports = count_user_reports(reported_user_id)
        if total_reports >= 3:
            # Push a system warning to alert the user (only once per threshold)
            existing_sys_warning = db.users.find_one({
                "id": reported_user_id,
                "warnings.reason": "You have received 3 or more reports. Your account may be blocked if violations continue."
            })
            if not existing_sys_warning:
                db.users.update_one(
                    {"id": reported_user_id},
                    {"$push": {"warnings": {
                        "reason": "You have received 3 or more reports. Your account may be blocked if violations continue.",
                        "date": datetime.utcnow()
                    }}}
                )

    return report_dict


def unblock_user(user_id: str) -> bool:
    """Unblock a user and clear all their reports (reset report count to zero)."""
    user = db.users.find_one({"id": user_id})
    if not user:
        return False

    # Set status to Active and clear warnings
    db.users.update_one(
        {"id": user_id},
        {"$set": {"status": "Active", "warnings": []}}
    )

    # Delete all reports where this user is the reported party
    db.reports.delete_many({"reported_user_id": user_id})

    return True


def get_blocked_users() -> list:
    """Return all users with status 'Blocked'."""
    users = list(db.users.find({"status": "Blocked"}, {"_id": False, "hashed_password": False}))
    result = []
    for u in users:
        result.append({
            "id": u.get("id"),
            "name": u.get("nickname") or u.get("email") or "Unknown User",
            "email": u.get("email", "No Email"),
            "riskLevel": u.get("riskLevel", "High"),
            "reportCount": count_user_reports(u.get("id", "")),
            "joinedAt": u.get("created_at").strftime("%Y-%m-%d") if isinstance(u.get("created_at"), datetime) else "Unknown"
        })
    return result


def get_users_with_warnings() -> list:
    """Return users with any warnings."""
    users = list(db.users.find({"warnings": {"$exists": True, "$ne": []}}, {"_id": False, "hashed_password": False}))
    result = []
    for u in users:
        result.append({
            "id": u.get("id"),
            "name": u.get("nickname") or u.get("email") or "Unknown User",
            "email": u.get("email", "No Email"),
            "warnings": u.get("warnings", []),
            "joinedAt": u.get("created_at").strftime("%Y-%m-%d") if isinstance(u.get("created_at"), datetime) else "Unknown"
        })
    return result
