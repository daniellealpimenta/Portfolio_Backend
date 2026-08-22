from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project_image import ProjectImageRepository
from Repositories.project import ProjectRepository
from Schemas.project_image import ProjectImageCreate, ProjectImageUpdate
from uuid import UUID

class ProjectImageService:
    def __init__(self, db: Session):
        self.repository = ProjectImageRepository(db)

    def _get_owning_project(self, project_id: UUID, current_user_id: UUID):
        project_repo = ProjectRepository(self.repository.db)
        project = project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=400, detail="Projeto associado não existe")
        if project.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Esse projeto não pertence a você")
        return project

    def create_image(self, image_data: ProjectImageCreate, current_user_id: UUID):
        self._get_owning_project(image_data.project_id, current_user_id)
        return self.repository.create(image_data)

    def get_all_images(self):
        return self.repository.get_all()

    def get_image_by_id(self, image_id: UUID):
        image = self.repository.get_by_id(image_id)
        if not image:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        return image

    def get_images_by_project_id(self, project_id: UUID):
        return self.repository.get_by_project_id(project_id)

    def update_image(self, image_id: UUID, image_data: ProjectImageUpdate, current_user_id: UUID):
        image = self.get_image_by_id(image_id)
        self._get_owning_project(image.project_id, current_user_id)

        updated = self.repository.update(image_id, image_data)
        return updated

    def delete_image(self, image_id: UUID, current_user_id: UUID):
        image = self.get_image_by_id(image_id)
        self._get_owning_project(image.project_id, current_user_id)

        self.repository.delete(image_id)
        return {"detail": "Imagem deletada com sucesso"}
