from datetime import datetime, timedelta
from typing import Optional, Any
from app.database.database import db
from app.auth.jwt import hash_password
import uuid
from calendar import month_name

def get_dashboard_stats():
    """Get comprehensive dashboard statistics from MongoDB"""
    
    # 1. User Statistics
    total_users = db.users.count_documents({})
    active_users = db.users.count_documents({"status": "Active"})
    blocked_users = db.users.count_documents({"status": "Blocked"})
    
    # 2. Counselor Statistics
    counselors_available = db.users.count_documents({"role": "counselor", "status": "Verified"})
    total_counselors = db.users.count_documents({"role": "counselor"})
    
    # 3. High Risk Alerts (users with High risk level)
    high_risk_users = db.users.count_documents({"riskLevel": "High"})
    medium_risk_users = db.users.count_documents({"riskLevel": "Medium"})
    high_risk_alerts = high_risk_users
    
    # 4. Appointment Statistics
    appointments_today = db.appointments.count_documents({
        "appointment_date": {
            "$gte": datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0),
            "$lt": datetime.utcnow().replace(hour=23, minute=59, second=59, microsecond=999999)
        }
    }) if db.appointments.count_documents({}) > 0 else 0
    
    appointments_total = db.appointments.count_documents({}) if db.appointments.count_documents({}) > 0 else 0
    
    # 5. Content Statistics
    reported_posts = db.reports.count_documents({"status": "pending"})
    total_posts = db.posts.count_documents({}) if db.posts.count_documents({}) > 0 else 0
    total_comments = db.comments.count_documents({}) if db.comments.count_documents({}) > 0 else 0
    
    # 6. Calculate User Growth Over Time (Last 12 months)
    user_growth = calculate_user_growth()
    
    # 7. Calculate Topic Engagement (from posts)
    topic_engagement = calculate_topic_engagement()
    
    # 8. Calculate Risk Distribution
    risk_distribution = {
        "high": high_risk_users,
        "medium": medium_risk_users,
        "low": db.users.count_documents({"riskLevel": "Low"})
    }
    
    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "blockedUsers": blocked_users,
        "counselorsAvailable": counselors_available,
        "totalCounselors": total_counselors,
        "appointmentsToday": appointments_today,
        "appointmentsTotal": appointments_total,
        "reportedPosts": reported_posts,
        "totalPosts": total_posts,
        "totalComments": total_comments,
        "highRiskAlerts": high_risk_alerts,
        "mediumRiskAlerts": medium_risk_users,
        "riskDistribution": risk_distribution,
        "userGrowth": user_growth,
        "topicEngagement": topic_engagement
    }

def calculate_user_growth():
    """Calculate monthly user growth for the last 12 months"""
    now = datetime.utcnow()
    months_data = []
    
    for i in range(11, -1, -1):
        # Calculate date for this month
        if i == 0:
            month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = now
        else:
            # Go back i months
            year = now.year
            month = now.month - i
            if month <= 0:
                month += 12
                year -= 1
            month_start = datetime(year, month, 1)
            # Get next month's first day
            if month == 12:
                month_end = datetime(year + 1, 1, 1)
            else:
                month_end = datetime(year, month + 1, 1)
        
        # Count users created up to end of this month
        users_count = db.users.count_documents({
            "created_at": {"$lt": month_end}
        })
        
        month_name_str = month_start.strftime("%b")
        months_data.append({
            "name": month_name_str,
            "users": users_count
        })
    
    return months_data

def calculate_topic_engagement():
    """Calculate engagement by topic/category from posts"""
    topics_data = []
    
    # Get all posts and their categories
    categories = [
        "Anxiety",
        "Depression", 
        "Stress",
        "Academic Pressure",
        "Work Burnout",
        "Self Care",
        "Relationships"
    ]
    
    for category in categories:
        count = db.posts.count_documents({"category": category}) if db.posts.count_documents({}) > 0 else 0
        if count == 0:
            # Assign random engagement value for demo if no real posts
            count = len(topics_data) * 100 + 200
        topics_data.append({
            "name": category,
            "value": count
        })
    
    # Sort by value descending
    topics_data.sort(key=lambda x: x["value"], reverse=True)
    return topics_data[:5]  # Return top 5

def get_all_users():
    users = list(db.users.find({}, {"_id": False, "hashed_password": False}).sort("created_at", -1))
    
    # Map to frontend expected format
    formatted_users = []
    for u in users:
        formatted_users.append({
            "id": u.get("id"),
            "name": u.get("nickname") or u.get("email") or "Unknown User",
            "email": u.get("email", "No Email"),
            "status": u.get("status", "Active"),
            "riskLevel": u.get("riskLevel", "Low"),
            "joinedAt": u.get("created_at").strftime("%Y-%m-%d") if isinstance(u.get("created_at"), datetime) else "Unknown"
        })
    return formatted_users

def delete_user(user_id: str):
    result = db.users.delete_one({"id": user_id})
    # Also delete their posts and comments
    db.posts.delete_many({"user_id": user_id})
    db.comments.delete_many({"user_id": user_id})
    return result.deleted_count > 0

def update_user_status(user_id: str, status: str):
    update_dict: dict[str, Any] = {"status": status}
    if status == "Verified":
        update_dict["verified"] = True
    elif status in ["Rejected", "Pending Verification"]:
        update_dict["verified"] = False
    result = db.users.update_one({"id": user_id}, {"$set": update_dict})
    return result.modified_count > 0

def create_user(user_data: dict):
    new_id = str(uuid.uuid4())
    db.users.insert_one({
        "id": new_id,
        "email": user_data.get("email"),
        "hashed_password": hash_password(user_data.get("password", "default123")),
        "nickname": user_data.get("name"),
        "role": user_data.get("role", "user"),
        "status": "Active",
        "riskLevel": user_data.get("riskLevel", "Low"),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    return True

def get_counselors():
    """Get all counselors with comprehensive details for admin management"""
    counselors = list(db.users.find({"role": "counselor"}, {"_id": False, "hashed_password": False}))
    formatted = []
    for c in counselors:
        formatted.append({
            "id": c.get("id"),
            "name": c.get("nickname") or c.get("email"),
            "email": c.get("email", "No Email"),
            "specialization": c.get("specialization", "General"),
            "bio": c.get("bio", "Professional mental health provider"),
            "qualifications": c.get("qualifications", []),
            "phone": c.get("phone", "Not provided"),
            "availability": c.get("availability", "Contact for details"),
            "rating": c.get("rating", 0),
            "reviews": c.get("reviews", 0),
            "status": c.get("status", "Pending Verification"),
            "sessionsCompleted": c.get("sessions_completed", 0),
            "hourlyRate": c.get("hourly_rate", 0),
            "verified": c.get("verified", False),
            "joinedAt": c.get("created_at").strftime("%Y-%m-%d") if isinstance(c.get("created_at"), datetime) else "Unknown"
        })
    return formatted

def create_counselor(counselor_data: dict):
    """Create a new counselor (admin only)"""
    new_id = str(uuid.uuid4())
    db.users.insert_one({
        "id": new_id,
        "email": counselor_data.get("email"),
        "hashed_password": hash_password(counselor_data.get("password", "counselor123")),
        "nickname": counselor_data.get("name"),
        "role": "counselor",
        "specialization": counselor_data.get("specialization", "General"),
        "bio": counselor_data.get("bio", ""),
        "qualifications": counselor_data.get("qualifications", []),
        "phone": counselor_data.get("phone", ""),
        "availability": counselor_data.get("availability", ""),
        "rating": 0,
        "reviews": 0,
        "sessions_completed": 0,
        "hourly_rate": counselor_data.get("hourly_rate", 0),
        "status": "Verified",
        "verified": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    return True

def update_counselor(counselor_id: str, update_data: dict):
    """Update counselor information"""
    update_dict = {
        "updated_at": datetime.utcnow()
    }
    
    # Only update provided fields
    allowed_fields = ["specialization", "bio", "qualifications", "phone", "availability", "hourly_rate", "status"]
    for field in allowed_fields:
        if field in update_data:
            update_dict[field] = update_data[field]
    
    result = db.users.update_one({"id": counselor_id}, {"$set": update_dict})
    return result.modified_count > 0

def delete_counselor(counselor_id: str):
    """Delete a counselor"""
    result = db.users.delete_one({"id": counselor_id})
    return result.deleted_count > 0

# Report operations
def get_all_reports():
    reports = list(db.reports.find({"status": {"$ne": "resolved"}}).sort("created_at", -1))
    formatted_reports = []
    for r in reports:
        # If it's a seed report (has direct author, content)
        if "content" in r:
            formatted_reports.append({
                "id": r.get("id"),
                "author": r.get("author", "Anonymous"),
                "content": r.get("content", ""),
                "riskTag": r.get("riskTag", "Low"),
                "reportedAt": r.get("reportedAt") or (r.get("created_at").isoformat() if r.get("created_at") else datetime.utcnow().isoformat()),
                "status": r.get("status", "pending")
            })
        else:
            # It's an API-created report (references content_id)
            # Find the reported post or comment
            content_id = r.get("content_id")
            content_type = r.get("content_type", "post")
            content_text = "[Content Deleted or Missing]"
            author_name = "Anonymous"
            
            if content_type == "post":
                post = db.posts.find_one({"id": content_id})
                if post:
                    content_text = post.get("content", "")
                    author = db.users.find_one({"id": post.get("user_id")})
                    if author:
                        author_name = author.get("nickname") or author.get("email") or "Anonymous"
            elif content_type == "comment":
                comment = db.comments.find_one({"id": content_id})
                if comment:
                    content_text = comment.get("content", "")
                    author = db.users.find_one({"id": comment.get("user_id")})
                    if author:
                        author_name = author.get("nickname") or author.get("email") or "Anonymous"
            elif content_type == "user":
                user = db.users.find_one({"id": content_id})
                if user:
                    author_name = user.get("nickname") or user.get("email") or "Anonymous"
                    content_text = f"Reported User Detail: {r.get('description', '') or 'No details provided'}"
                else:
                    content_text = "[User Deleted or Missing]"
            
            formatted_reports.append({
                "id": r.get("id"),
                "author": author_name,
                "content": content_text,
                "riskTag": r.get("reason", "Medium"),
                "reportedAt": r.get("created_at").isoformat() if r.get("created_at") else datetime.utcnow().isoformat(),
                "status": r.get("status", "pending")
            })
    return formatted_reports

def handle_report_action(report_id: str, action: str, warning_reason: Optional[str] = None):
    report = db.reports.find_one({"id": report_id})
    if not report:
        return False
        
    db.reports.update_one({"id": report_id}, {"$set": {"status": "resolved"}})
    
    content_id = report.get("content_id")
    content_type = report.get("content_type", "post")
    
    if action == "Remove Post":
        if content_id:
            if content_type == "post":
                db.posts.delete_one({"id": content_id})
                db.comments.delete_many({"post_id": content_id})
            elif content_type == "comment":
                db.comments.delete_one({"id": content_id})
            elif content_type == "user":
                db.users.update_one({"id": content_id}, {"$set": {"status": "Blocked"}})
                
    elif action == "Warn User" or warning_reason:
        user_id = None
        if content_id:
            if content_type == "post":
                post = db.posts.find_one({"id": content_id})
                if post:
                    user_id = post.get("user_id")
            elif content_type == "comment":
                comment = db.comments.find_one({"id": content_id})
                if comment:
                    user_id = comment.get("user_id")
            elif content_type == "user":
                user_id = content_id
        else:
            author_name = report.get("author")
            user = db.users.find_one({"nickname": author_name})
            if user:
                user_id = user.get("id")
                
        if user_id:
            db.users.update_one(
                {"id": user_id},
                {
                    "$set": {"riskLevel": "High"},
                    "$push": {"warnings": {
                        "reason": warning_reason or "Community guideline violation",
                        "date": datetime.utcnow()
                    }}
                }
            )
            
    return True

# Crisis operations
def get_crisis_alerts():
    alerts = list(db.crisis_alerts.find().sort("created_at", -1))
    formatted_alerts = []
    for a in alerts:
        formatted_alerts.append({
            "id": a.get("id"),
            "type": a.get("type"),
            "user": a.get("user"),
            "content": a.get("content"),
            "risk": a.get("risk"),
            "status": a.get("status"),
            "assignedCounselor": a.get("assignedCounselor"),
            "time": a.get("time") or "Just now"
        })
    return formatted_alerts

def handle_crisis_action(alert_id: str, action: str, counselor_name: Optional[str] = None):
    alert = db.crisis_alerts.find_one({"id": alert_id})
    if not alert:
        return False
        
    if action == "Dismiss":
        db.crisis_alerts.update_one({"id": alert_id}, {"$set": {"status": "dismissed"}})
    elif action == "Assign Counselor":
        db.crisis_alerts.update_one(
            {"id": alert_id},
            {"$set": {
                "status": "assigned",
                "assignedCounselor": counselor_name
            }}
        )
    return True

def get_appointments():
    appointments = list(db.appointments.find().sort("appointment_date", 1))
    formatted = []
    for apt in appointments:
        # Fetch user details
        user = db.users.find_one({"id": apt.get("user_id")})
        user_name = "Unknown Client"
        if user:
            user_name = user.get("nickname") or user.get("email") or "Unknown Client"
        
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
        
        apt_status = apt.get("status", "Pending Approval")
        if apt_status in ["Upcoming", "Pending Approval", "scheduled", "Pending"]:
            if isinstance(apt_date, datetime) and apt_date < datetime.utcnow():
                apt_status = "Completed"
                db.appointments.update_one({"id": apt.get("id")}, {"$set": {"status": "Completed"}})

        formatted.append({
            "id": apt.get("id"),
            "user": user_name,
            "counselor": counselor_name,
            "date": date_str,
            "time": time_str,
            "status": apt_status,
            "type": "Video Call"
        })
    return formatted

def update_appointment_status(appointment_id: str, status: str):
    db_status = status
    if status == "approved":
        db_status = "Upcoming"
    elif status == "declined":
        db_status = "Declined"
        
    result = db.appointments.update_one({"id": appointment_id}, {"$set": {"status": db_status}})
    return result.modified_count > 0

