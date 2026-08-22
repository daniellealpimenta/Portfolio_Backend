from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Core.deps import get_current_user
from Models.user import User
from Schemas.project_image import ProjectImageCreate, ProjectImageResponse, ProjectImageUpdate
from Services.project_image import ProjectImageService

router = APIRouter(prefix="/project-images", tags=["Project Images"])

@router.post("/", response_model=ProjectImageResponse, status_code=201)
def create_image(image_in: ProjectImageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProjectImageService(db)
    return service.create_image(image_in, current_user.id)

@router.get("/", response_model=list[ProjectImageResponse])
def get_all_images(db: Session = Depends(get_db)):
    service = ProjectImageService(db)
    return service.get_all_images()

@router.get("/{image_id}", response_model=ProjectImageResponse)
def get_image_by_id(image_id: UUID, db: Session = Depends(get_db)):
    service = ProjectImageService(db)
    return service.get_image_by_id(image_id)

@router.get("/project/{project_id}", response_model=list[ProjectImageResponse])
def get_images_by_project_id(project_id: UUID, db: Session = Depends(get_db)):
    service = ProjectImageService(db)
    return service.get_images_by_project_id(project_id)

@router.patch("/{image_id}", response_model=ProjectImageResponse)
def update_image(image_id: UUID, image_in: ProjectImageUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProjectImageService(db)
    return service.update_image(image_id, image_in, current_user.id)

@router.delete("/{image_id}")
def delete_image(image_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProjectImageService(db)
    return service.delete_image(image_id, current_user.id)
