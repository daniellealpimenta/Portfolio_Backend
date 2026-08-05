from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from Services.project import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.create_project(project_in)

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: UUID, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.get_project(project_id)

@router.get("/", response_model=list[ProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.get_all_projects()

@router.get("/user/{user_id}", response_model=list[ProjectResponse])
def get_projects_by_user(user_id: UUID, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.get_projects_by_user(user_id)

@router.get("/category/{category}", response_model=list[ProjectResponse])
def get_projects_by_category(category: str, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.get_projects_by_category(category)

@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: UUID, project_in: ProjectUpdate, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.update_project(project_id, project_in)

@router.delete("/{project_id}")
def delete_project(project_id: UUID, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.delete_project(project_id)
