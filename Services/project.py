from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project import ProjectRepository
from Models.project_like import ProjectLike

from Schemas.project import ProjectCreate, ProjectResponse, ProjectBase, Category, ProjectUpdate
from uuid import UUID

class ProjectService:
    def __init__(self, db: Session):
        self.repository = ProjectRepository(db)

    def create_project(self, project_data: ProjectCreate, current_user_id: UUID):
        project_data.user_id = current_user_id
        return self.repository.create(project_data)

    def get_project(self, project_id: UUID):
        project = self.repository.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return project

    def get_all_projects(self):
        return self.repository.get_all()

    def get_projects_by_user(self, user_id: UUID):
        return self.repository.get_by_user_id(user_id)

    def get_projects_by_category(self, category: str):
        try:
            cat_enum = Category(category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Categoria inválida: {category}")
        return self.repository.get_by_category(cat_enum)

    def update_project(self, project_id: UUID, project_data: ProjectUpdate, current_user_id: UUID):
        project = self.get_project(project_id)
        if project.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar esse projeto")

        updated = self.repository.update(project_id, project_data)
        return updated

    def delete_project(self, project_id: UUID, current_user_id: UUID):
        project = self.get_project(project_id)
        if project.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para excluir esse projeto")

        self.repository.delete(project_id)
        return {"detail": "Projeto deletado com sucesso"}

    def _get_like(self, project_id: UUID, visitor_id: str) -> ProjectLike | None:
        return self.repository.db.query(ProjectLike).filter(
            ProjectLike.project_id == project_id,
            ProjectLike.visitor_id == visitor_id
        ).first()

    def like_project(self, project_id: UUID, visitor_id: str):
        project = self.get_project(project_id)

        if self._get_like(project_id, visitor_id):
            return project  # esse visitante já curtiu — idempotente, não soma de novo

        self.repository.db.add(ProjectLike(project_id=project_id, visitor_id=visitor_id))
        project.likes = (project.likes or 0) + 1
        self.repository.db.commit()
        self.repository.db.refresh(project)
        return project

    def unlike_project(self, project_id: UUID, visitor_id: str):
        project = self.get_project(project_id)

        like = self._get_like(project_id, visitor_id)
        if not like:
            return project  # esse visitante não tinha curtido — nada a desfazer

        self.repository.db.delete(like)
        project.likes = max(0, (project.likes or 0) - 1)
        self.repository.db.commit()
        self.repository.db.refresh(project)
        return project

    def get_liked_project_ids(self, visitor_id: str) -> list[UUID]:
        rows = self.repository.db.query(ProjectLike.project_id).filter(
            ProjectLike.visitor_id == visitor_id
        ).all()
        return [r[0] for r in rows]
