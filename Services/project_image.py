from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.project_image import ProjectImageRepository
from Repositories.project import ProjectRepository
from Schemas.project_image import ProjectImageCreate, ProjectImageUpdate
from uuid import UUID

class ProjectImageService:
    def __init__(self, db: Session):
        self.repository = ProjectImageRepository(db)

    def create_image(self, image_data: ProjectImageCreate):
        project_repo = ProjectRepository(self.repository.db)
        if not project_repo.get_by_id(image_data.project_id):
            raise HTTPException(status_code=400, detail="Projeto associado não existe")
        return self.repository.create(image_data)

    def get_all_images(self):
        return self.repository.get_all()

    def get_image_by_id(self, image_id: UUID):
        image = self.repository.get_by_id(image_id)
        if not image:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        return image

    def get_images_by_project_id(self, project_id: UUID):
        project_repo = ProjectRepository(self.repository.db)
        if not project_repo.get_by_id(project_id):
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
        return self.repository.get_by_project_id(project_id)

    def update_image(self, image_id: UUID, image_data: ProjectImageUpdate):
        updated = self.repository.update(image_id, image_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        return updated

    def delete_image(self, image_id: UUID):
        success = self.repository.delete(image_id)
        if not success:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        return {"detail": "Imagem deletada com sucesso"}
