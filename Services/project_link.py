from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project_link import ProjectLinkRepository
from Repositories.project import ProjectRepository
from Schemas.project_link import ProjectLinkCreate, ProjectLinkUpdate
from uuid import UUID

class ProjectLinkService:
    def __init__(self, db: Session):
        self.repository = ProjectLinkRepository(db)

    def _get_owning_project(self, project_id: UUID, current_user_id: UUID):
        project_repo = ProjectRepository(self.repository.db)
        project = project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=400, detail="Projeto associado não existe")
        if project.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Esse projeto não pertence a você")
        return project

    def create_link(self, link_data: ProjectLinkCreate, current_user_id: UUID):
        self._get_owning_project(link_data.project_id, current_user_id)
        return self.repository.create(link_data)

    def get_all_links(self):
        return self.repository.get_all()

    def get_link_by_id(self, link_id: UUID):
        link = self.repository.get_by_id(link_id)
        if not link:
            raise HTTPException(status_code=404, detail="Link não encontrado")
        return link

    def get_links_by_project_id(self, project_id: UUID):
        return self.repository.get_by_project_id(project_id)

    def update_link(self, link_id: UUID, link_data: ProjectLinkUpdate, current_user_id: UUID):
        link = self.get_link_by_id(link_id)
        self._get_owning_project(link.project_id, current_user_id)

        updated = self.repository.update(link_id, link_data)
        return updated

    def delete_link(self, link_id: UUID, current_user_id: UUID):
        link = self.get_link_by_id(link_id)
        self._get_owning_project(link.project_id, current_user_id)

        self.repository.delete(link_id)
        return {"detail": "Link deletado com sucesso"}
