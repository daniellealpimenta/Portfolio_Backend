from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Schemas.project_link import ProjectLinkCreate, ProjectLinkResponse, ProjectLinkUpdate
from Services.project_link import ProjectLinkService

router = APIRouter(prefix="/project-links", tags=["Project Links"])

@router.post("/", response_model=ProjectLinkResponse, status_code=201)
def create_link(link_in: ProjectLinkCreate, db: Session = Depends(get_db)):
    service = ProjectLinkService(db)
    return service.create_link(link_in)

@router.get("/", response_model=list[ProjectLinkResponse])
def get_all_links(db: Session = Depends(get_db)):
    service = ProjectLinkService(db)
    return service.get_all_links()

@router.get("/{link_id}", response_model=ProjectLinkResponse)
def get_link_by_id(link_id: UUID, db: Session = Depends(get_db)):
    service = ProjectLinkService(db)
    return service.get_link_by_id(link_id)

@router.get("/project/{project_id}", response_model=list[ProjectLinkResponse])
def get_links_by_project_id(project_id: UUID, db: Session = Depends(get_db)):
    service = ProjectLinkService(db)
    return service.get_links_by_project_id(project_id)

@router.patch("/{link_id}", response_model=ProjectLinkResponse)
def update_link(link_id: UUID, link_in: ProjectLinkUpdate, db: Session = Depends(get_db)):
    service = ProjectLinkService(db)
    return service.update_link(link_id, link_in)

@router.delete("/{link_id}")
def delete_link(link_id: UUID, db: Session = Depends(get_db)):
    service = ProjectLinkService(db)
    return service.delete_link(link_id)
