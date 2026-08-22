from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Core.deps import get_current_user
from Core.limiter import limiter
from fastapi import Request
from Models.user import User
from Schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate, LikeIn
from Services.project import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(project_in: ProjectCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.create_project(project_in, current_user.id)

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
def update_project(project_id: UUID, project_in: ProjectUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.update_project(project_id, project_in, current_user.id)

@router.delete("/{project_id}")
def delete_project(project_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.delete_project(project_id, current_user.id)

# Curtidas seguem públicas (qualquer visitante do portfólio pode curtir),
# mas isoladas num endpoint dedicado que só incrementa/decrementa — não dá
# pra sobrescrever nenhum outro campo do projeto por aqui. Um mesmo visitante
# (identificado por um id anônimo salvo em cookie, não é login) só conta uma vez.
@router.post("/{project_id}/like", response_model=ProjectResponse)
@limiter.limit("30/minute")
def like_project(request: Request, project_id: UUID, body: LikeIn, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.like_project(project_id, body.visitor_id)

@router.post("/{project_id}/unlike", response_model=ProjectResponse)
@limiter.limit("30/minute")
def unlike_project(request: Request, project_id: UUID, body: LikeIn, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.unlike_project(project_id, body.visitor_id)

@router.get("/liked/{visitor_id}", response_model=list[UUID])
def get_liked_projects(visitor_id: str, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.get_liked_project_ids(visitor_id)
