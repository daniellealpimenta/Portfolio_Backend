from sqlalchemy.orm import Session
from Models.project import Project
from Schemas.project import ProjectCreate, ProjectResponse, ProjectBase, Category, ProjectUpdate
from uuid import UUID

class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, project_data: ProjectCreate) -> Project:
        # Transforma o schema em model e salva
        novo_projeto = Project(**project_data.model_dump())
        self.db.add(novo_projeto)
        self.db.commit()
        self.db.refresh(novo_projeto)
        return novo_projeto
    
    def get_all(self) -> list[Project]:
        return self.db.query(Project).all()

    def get_by_id(self, project_id: UUID) -> Project | None:
        return self.db.query(Project).filter(Project.id == project_id).first()
    
    def get_by_category(self, category: Category) -> list[Project]:
        return self.db.query(Project).filter(Project.category == category).all()
    
    def update(self, project_id: UUID, project_data: ProjectUpdate) -> Project | None:
        projeto = self.get_by_id(project_id)
        if not projeto:
            return None
        
        for field, value in project_data.model_dump(exclude_unset=True).items():
            setattr(projeto, field, value)
        
        self.db.commit()
        self.db.refresh(projeto)
        return projeto
    
    def delete(self, project_id: UUID) -> bool:
        projeto = self.get_by_id(project_id)
        if not projeto:
            return False
        
        self.db.delete(projeto)
        self.db.commit()
        return True