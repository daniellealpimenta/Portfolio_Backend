from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project import ProjectRepository
from Repositories.user import UserRepository

from Schemas.project import ProjectCreate, ProjectResponse, ProjectBase, Category, ProjectUpdate
from uuid import UUID

class ProjectService:
    def __init__(self, db: Session):
        # O Service instancia o Repository para poder usá-lo
        self.repository = ProjectRepository(db)

    def create_project(self, project_data: ProjectCreate):

        if project_data.user_id:
            # Se o projeto tem um user_id, checa se o usuário existe
            user_repo = UserRepository(self.repository.db)  # Reaproveita a conexão do banco
            if not user_repo.get_by_id(project_data.user_id):
                raise HTTPException(status_code=400, detail="Usuário associado não existe")
        
        # Se passou nas regras, manda o repositório salvar
        return self.repository.create(project_data)

    def get_project(self, project_id: UUID):
        project = self.repository.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return project