from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas.schemas import PostCreate, PostResponse, CommentCreate, CommentResponse, PaginatedResponse
from app.services.service import (
    create_post, get_posts, get_post_by_id, delete_post,
    create_comment, get_comments, toggle_post_like, get_user_by_id, count_user_reports
)
from app.database.database import db
from app.auth.jwt import decode_token
from fastapi import Header

router = APIRouter(prefix="/posts", tags=["posts"])

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = payload.get("sub")
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        # Auto-block user if reported > 5 times
        report_count = count_user_reports(user["id"])
        if report_count > 5:
            db.users.update_one({"id": user["id"]}, {"$set": {"status": "Blocked"}})
            user["status"] = "Blocked"
        if user.get("status") == "Blocked":
            raise HTTPException(status_code=403, detail="Your account is blocked. Contact Admin.")
        return user
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

def get_optional_current_user(authorization: str = Header(None)):
    if not authorization:
        return None
    try:
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        if payload:
            return payload.get("sub")
    except Exception:
        pass
    return None

@router.post("", response_model=PostResponse)
async def create_new_post(
    post_create: PostCreate,
    current_user = Depends(get_current_user)
):
    post = create_post(post_create, current_user["id"])
    return post

@router.get("", response_model=PaginatedResponse)
async def list_posts(
    category_id: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user_id = Depends(get_optional_current_user)
):
    skip = (page - 1) * page_size
    posts = get_posts(category_id, skip, page_size, current_user_id)
    # Since we don't have total easily without a second query, we'll just mock it or query it if needed.
    # For now, just return what we have (this works for the frontend mostly)
    
    return PaginatedResponse(
        data=posts,
        total=len(posts), # Note: this is just page total, true total needs db.posts.count_documents(query)
        page=page,
        page_size=page_size,
        has_more=len(posts) == page_size
    )

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str, current_user_id = Depends(get_optional_current_user)):
    post = get_post_by_id(post_id, current_user_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/{post_id}")
async def delete_post_endpoint(
    post_id: str,
    current_user = Depends(get_current_user)
):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    delete_post(post_id)
    return {"message": "Post deleted"}

@router.post("/{post_id}/like")
async def like_post(
    post_id: str,
    current_user = Depends(get_current_user)
):
    liked = toggle_post_like(current_user["id"], post_id)
    return {"liked": liked}

@router.post("/{post_id}/comments", response_model=CommentResponse)
async def create_post_comment(
    post_id: str,
    comment_create: CommentCreate,
    current_user = Depends(get_current_user)
):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment = create_comment(comment_create, post_id, current_user["id"])
    return comment

@router.get("/{post_id}/comments", response_model=list[CommentResponse])
async def list_post_comments(post_id: str, current_user_id = Depends(get_optional_current_user)):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = get_comments(post_id, current_user_id)
    return comments
