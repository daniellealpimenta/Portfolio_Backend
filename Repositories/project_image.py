from sqlalchemy.orm import Session
from Models.project_image import ProjectImage
from Schemas.project_image import ProjectImageCreate, ProjectImageUpdate
from uuid import UUID

class ProjectImageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, image_data: ProjectImageCreate) -> ProjectImage:
        nova_imagem = ProjectImage(**image_data.model_dump())
        self.db.add(nova_imagem)
        self.db.commit()
        self.db.refresh(nova_imagem)
        return nova_imagem

    def get_all(self) -> list[ProjectImage]:
        return self.db.query(ProjectImage).all()

    def get_by_id(self, image_id: UUID) -> ProjectImage | None:
        return self.db.query(ProjectImage).filter(ProjectImage.id == image_id).first()

    def get_by_project_id(self, project_id: UUID) -> list[ProjectImage]:
        return self.db.query(ProjectImage).filter(ProjectImage.project_id == project_id).all()

    def update(self, image_id: UUID, image_data: ProjectImageUpdate) -> ProjectImage | None:
        imagem = self.get_by_id(image_id)
        if not imagem:
            return None

        for field, value in image_data.model_dump(exclude_unset=True).items():
            setattr(imagem, field, value)

        self.db.commit()
        self.db.refresh(imagem)
        return imagem

    def delete(self, image_id: UUID) -> bool:
        imagem = self.get_by_id(image_id)
        if not imagem:
            return False

        self.db.delete(imagem)
        self.db.commit()
        return True
