from sqlalchemy.orm import Session
from Models.project import Project
from Schemas.project import ProjectCreate, ProjectResponse, ProjectBase, Category, ProjectUpdate
from uuid import UUID
import Models.associations
from Models.tool import Tool
from Models.user import User
from Models.project_image import ProjectImage
from Models.project_link import ProjectLink

class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, project_data: ProjectCreate) -> Project:
        # Transforma o schema em model e salva. categories precisa virar lista de
        # strings puras (não membros do enum Category) antes de ir pro array do banco.
        data = project_data.model_dump()
        data["categories"] = [c.value for c in project_data.categories]
        novo_projeto = Project(**data)
        self.db.add(novo_projeto)
        self.db.commit()
        self.db.refresh(novo_projeto)
        return novo_projeto

    def get_all(self) -> list[Project]:
        return self.db.query(Project).all()

    def get_by_id(self, project_id: UUID) -> Project | None:
        return self.db.query(Project).filter(Project.id == project_id).first()

    def get_by_category(self, category: Category) -> list[Project]:
        return self.db.query(Project).filter(Project.categories.any(category.value)).all()

    def get_by_user_id(self, user_id: UUID) -> list[Project]:
        return self.db.query(Project).filter(Project.user_id == user_id).all()

    def update(self, project_id: UUID, project_data: ProjectUpdate) -> Project | None:
        projeto = self.get_by_id(project_id)
        if not projeto:
            return None

        update_dict = project_data.model_dump(exclude_unset=True)
        if project_data.categories is not None:
            update_dict["categories"] = [c.value for c in project_data.categories]

        for field, value in update_dict.items():
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