from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project_link import ProjectLinkRepository
from Repositories.project import ProjectRepository
from Schemas.project_link import ProjectLinkCreate, ProjectLinkUpdate
from uuid import UUID

class ProjectLinkService:
    def __init__(self, db: Session):
        self.repository = ProjectLinkRepository(db)

    def create_link(self, link_data: ProjectLinkCreate):
        project_repo = ProjectRepository(self.repository.db)
        if not project_repo.get_by_id(link_data.project_id):
            raise HTTPException(status_code=400, detail="Projeto associado não existe")
        return self.repository.create(link_data)

    def get_all_links(self):
        return self.repository.get_all()

    def get_link_by_id(self, link_id: UUID):
        link = self.repository.get_by_id(link_id)
        if not link:
            raise HTTPException(status_code=404, detail="Link não encontrado")
        return link

    def get_links_by_project_id(self, project_id: UUID):
        project_repo = ProjectRepository(self.repository.db)
        if not project_repo.get_by_id(project_id):
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return self.repository.get_by_project_id(project_id)

    def update_link(self, link_id: UUID, link_data: ProjectLinkUpdate):
        updated = self.repository.update(link_id, link_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Link não encontrado")
        return updated

    def delete_link(self, link_id: UUID):
        success = self.repository.delete(link_id)
        if not success:
            raise HTTPException(status_code=404, detail="Link não encontrado")
        return {"detail": "Link deletado com sucesso"}
