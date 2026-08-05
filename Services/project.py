from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project import ProjectRepository
from Repositories.user import UserRepository

from Schemas.project import ProjectCreate, ProjectResponse, ProjectBase, Category, ProjectUpdate
from uuid import UUID

class ProjectService:
    def __init__(self, db: Session):
        self.repository = ProjectRepository(db)

    def create_project(self, project_data: ProjectCreate):
        if project_data.user_id:
            user_repo = UserRepository(self.repository.db)
            if not user_repo.get_by_id(project_data.user_id):
                raise HTTPException(status_code=400, detail="Usuário associado não existe")
        return self.repository.create(project_data)

    def get_project(self, project_id: UUID):
        project = self.repository.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return project

    def get_all_projects(self):
        return self.repository.get_all()

    def get_projects_by_user(self, user_id: UUID):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(user_id):
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return self.repository.get_by_user_id(user_id)

    def get_projects_by_category(self, category: str):
        try:
            cat_enum = Category(category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Categoria inválida: {category}")
        return self.repository.get_by_category(cat_enum)

    def update_project(self, project_id: UUID, project_data: ProjectUpdate):
        updated = self.repository.update(project_id, project_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return updated

    def delete_project(self, project_id: UUID):
        success = self.repository.delete(project_id)
        if not success:
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return {"detail": "Projeto deletado com sucesso"}