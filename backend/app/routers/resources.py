from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.schemas import ResourceCreate, ResourceResponse, PaginatedResponse
from app.services.service import create_resource, get_resources, get_resource_by_id
from app.routers.posts import get_current_user, get_optional_current_user

router = APIRouter(prefix="/resources", tags=["resources"])

@router.post("", response_model=ResourceResponse)
async def create_new_resource(
    resource_create: ResourceCreate,
    current_user = Depends(get_current_user)
):
    resource = create_resource(resource_create)
    return resource

@router.get("", response_model=PaginatedResponse)
async def list_resources(
    category_id: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    current_user_id = Depends(get_optional_current_user)
):
    skip = (page - 1) * page_size
    resources = get_resources(category_id, skip, page_size, current_user_id)
    
    return PaginatedResponse(
        data=resources,
        total=len(resources),
        page=page,
        page_size=page_size,
        has_more=len(resources) == page_size
    )

@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource(resource_id: str, current_user_id = Depends(get_optional_current_user)):
    resource = get_resource_by_id(resource_id, current_user_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource
